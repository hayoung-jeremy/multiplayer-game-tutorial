/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { useAtom, useAtomValue } from "jotai";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";

import { charactersAtom, mapAtom, userAtom } from "../jotai/users";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom, shopModeAtom } from "../jotai/mode";
import { socket } from "@/socket";
import { useGrid } from "@/hooks";

const Experience = () => {
  const { scene, camera } = useThree();
  const controls = useRef<any>(null);

  const characters = useAtomValue(charactersAtom);
  const gameMap = useAtomValue(mapAtom);
  const user = useAtomValue(userAtom);

  const { vector3ToGrid, gridToVector3 } = useGrid();

  const [isBuildMode, setIsBuildMode] = useAtom(buildModeAtom);
  const isShopMode = useAtomValue(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(draggedItemRotationAtom);
  const [dragPosition, setDragPosition] = useState<[number, number] | null>(null);
  const [items, setItems] = useState(gameMap ? gameMap.gameItems : null);
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
          newItems[draggedItem].rotation = draggedItemRotation;
          return newItems;
        });
      }
      setDraggedItem(null);
    }
  };

  useEffect(() => {
    if (!draggedItem || !items || !dragPosition || !gameMap) return;

    const item = items[draggedItem];
    const width = draggedItemRotation === 1 || draggedItemRotation === 3 ? item.size[1] : item.size[0];
    const height = draggedItemRotation === 1 || draggedItemRotation === 3 ? item.size[0] : item.size[1];

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
  }, [dragPosition, draggedItem, items, draggedItemRotation]);

  useEffect(() => {
    if (items === null || items.length === 0) return;

    if (isBuildMode) {
      setItems(gameMap?.gameItems || []);
      camera.position.set(8, 8, 8);
      controls.current?.target.set(0, 0, 0);
    } else {
      socket.emit("itemsUpdate", items);
    }
  }, [isBuildMode]);

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
            onClick={() => {
              if (isBuildMode) {
                setDraggedItem(prev => (prev === null ? idx : prev));
                setDraggedItemRotation(item.rotation || 0);
              }
            }}
            isDragging={draggedItem === idx}
            dragPosition={dragPosition}
            dragRotation={draggedItemRotation}
            canDrop={canDrop}
          />
        );
      })}

      <mesh
        receiveShadow
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
      {isBuildMode && !isShopMode && <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />}

      <color attach="background" args={["#d9e1e9"]} />
      <directionalLight position={[-4, 4, -4]} castShadow intensity={0.35} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera
          attach="shadow-camera"
          args={[-gameMap.size[0], gameMap.size[1], 10, -10]}
          far={gameMap.size[0] + gameMap.size[1]}
        />
      </directionalLight>
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        screenSpacePanning={false}
      />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
