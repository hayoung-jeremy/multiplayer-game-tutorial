/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";

import { charactersAtom, mapAtom, userAtom } from "../jotai/users";
import { socket } from "@/socket";
import { useGrid } from "@/hooks";

const Experience = () => {
  const [isBuildMode, setIsBuildMode] = useState(true);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragPosition, setDragPosition] = useState<[number, number] | null>(null);

  const [isOnFloor, setIsOnFloor] = useState(false);
  useCursor(isOnFloor);
  const characters = useAtomValue(charactersAtom);
  const gameMap = useAtomValue(mapAtom);
  const user = useAtomValue(userAtom);

  const scene = useThree(state => state.scene);

  const { vector3ToGrid, gridToVector3 } = useGrid();

  const onCharacterMove = (e: any) => {
    const player = scene.getObjectByName(`character-${user}`);

    if (!player) return;

    socket.emit("move", vector3ToGrid(player.position), vector3ToGrid(e.point));
  };

  return (
    <>
      {gameMap &&
        !isBuildMode &&
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

      {gameMap &&
        gameMap.gameItems.map((item, idx) => {
          return (
            <Item
              key={`${item}-${idx}`}
              item={item}
              onClick={() => setDraggedItem((prev: null) => (prev === null ? idx : prev))}
              isDragging={draggedItem === idx}
              dragPosition={dragPosition}
            />
          );
        })}

      {gameMap && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position-x={gameMap.size[0] / 2}
          position-y={-0.001}
          position-z={gameMap.size[1] / 2}
          onClick={onCharacterMove}
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
      )}
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />

      <OrbitControls />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
