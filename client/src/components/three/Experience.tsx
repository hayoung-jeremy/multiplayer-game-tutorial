/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";

import { charactersAtom, mapAtom, userAtom } from "../jotai/users";
import { socket } from "@/socket";
import { useGrid } from "@/hooks";

const Experience = () => {
  const scene = useThree(state => state.scene);

  const characters = useAtomValue(charactersAtom);
  const gameMap = useAtomValue(mapAtom);
  const user = useAtomValue(userAtom);

  const { vector3ToGrid, gridToVector3 } = useGrid();

  const [isBuildMode, setIsBuildMode] = useState(true);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragPosition, setDragPosition] = useState<[number, number] | null>(null);
  const [items, setItems] = useState(gameMap?.gameItems);
  const [canDrop, setCanDrop] = useState(false);

  const [isOnFloor, setIsOnFloor] = useState(false);
  useCursor(isOnFloor);

  const onCharacterMove = (e: any) => {
    const player = scene.getObjectByName(`character-${user}`);

    if (!player) return;

    socket.emit("move", vector3ToGrid(player.position), vector3ToGrid(e.point));
  };

  const onNavigateBuildMode = (e: any) => {
    if (draggedItem !== null) {
      if (canDrop) {
        setItems(prev => {
          const newItems = [...(prev || [])];

          newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
          return newItems;
        });
      }
      setDraggedItem(null);
    }
  };

  useEffect(() => {
    if (!draggedItem || !items || !dragPosition || !gameMap) return;

    const item = items[draggedItem];
    const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];

    let droppable = true;

    // check if item is in bounds
    if (dragPosition[0] < 0 || dragPosition[0] + width > gameMap.size[0] * gameMap.gridDivision) {
      droppable = false;
    }

    if (dragPosition[1] < 0 || dragPosition[1] + height > gameMap.size[1] * gameMap.gridDivision) {
      droppable = false;
    }

    // check if item is not colliding with other items
    if (!item.walkable && !item.wall) {
      items.forEach((otherItem, idx) => {
        // ignore self
        if (idx === draggedItem) return;

        // ignore wall and floor
        if (otherItem.walkable || otherItem.wall) return;

        // check item overlapped
        const otherWidth = otherItem.rotation === 1 || otherItem.rotation === 3 ? otherItem.size[1] : otherItem.size[0];
        const otherHeight =
          otherItem.rotation === 1 || otherItem.rotation === 3 ? otherItem.size[0] : otherItem.size[1];

        if (
          dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
          dragPosition[0] + width > otherItem.gridPosition[0] &&
          dragPosition[1] < otherItem.gridPosition[1] + otherHeight &&
          dragPosition[1] + height > otherItem.gridPosition[1]
        ) {
          droppable = false;
        }
      });
    }
    setCanDrop(droppable);
  }, [dragPosition, draggedItem, items]);

  if (!gameMap) return;

  return (
    <>
      {!isBuildMode &&
        characters.map(character => (
          <HoodieCharacter
            key={character.id}
            userId={character.id}
            path={character.path}
            position={gridToVector3(character.position)}
            hairColor={character.hairColor}
            topColor={character.topColor}
            bottomColor={character.bottomColor}
          />
        ))}

      {(isBuildMode ? items : gameMap.gameItems)?.map((item, idx) => {
        return (
          <Item
            key={`${item}-${idx}`}
            item={item}
            onClick={() => setDraggedItem((prev: null) => (prev === null ? idx : prev))}
            isDragging={draggedItem === idx}
            dragPosition={dragPosition}
            canDrop={canDrop}
          />
        );
      })}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position-x={gameMap.size[0] / 2}
        position-y={-0.001}
        position-z={gameMap.size[1] / 2}
        onClick={isBuildMode ? onNavigateBuildMode : onCharacterMove}
        onPointerEnter={() => setIsOnFloor(true)}
        onPointerLeave={() => setIsOnFloor(false)}
        onPointerMove={e => {
          if (!isBuildMode) return;
          const newPosition = vector3ToGrid(e.point);
          if (!dragPosition || dragPosition[0] !== newPosition[0] || dragPosition[1] !== newPosition[1]) {
            setDragPosition(newPosition);
          }
        }}
      >
        <planeGeometry args={gameMap.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />

      <OrbitControls />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
