/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Vector3 } from "three";
import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";

import { charactersAtom, mapAtom, userAtom } from "../jotai/users";
import { socket } from "@/socket";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "@/hooks";

const Experience = () => {
  const [isOnFloor, setIsOnFloor] = useState(false);
  useCursor(isOnFloor);
  const characters = useAtomValue(charactersAtom);
  const gameMap = useAtomValue(mapAtom);
  const user = useAtomValue(userAtom);

  const scene = useThree(state => state.scene);

  const { vector3ToGrid, gridToVector3 } = useGrid();

  const onCharacterMove = (e: any) => {
    const character = scene.getObjectByName(`character-${user}`);
    console.log("character : ", character);
    if (!character) return;

    socket.emit("move", vector3ToGrid(character.position), vector3ToGrid(e.point));
  };

  return (
    <>
      {gameMap &&
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
          return <Item key={`${item}-${idx}`} item={item} />;
        })}

      {gameMap && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position-x={gameMap.size[0] / 2}
          // position-y={-0.001}
          position-z={gameMap.size[1] / 2}
          onClick={onCharacterMove}
          onPointerEnter={() => setIsOnFloor(true)}
          onPointerLeave={() => setIsOnFloor(false)}
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
