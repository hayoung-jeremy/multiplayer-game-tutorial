import { useState } from "react";
import { Vector3 } from "three";
import { ContactShadows, Environment, OrbitControls, useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";

import { charactersAtom } from "../jotai/users";
import { socket } from "@/socket";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";

const Experience = () => {
  const [isOnFloor, setIsOnFloor] = useState(false);
  useCursor(isOnFloor);
  const characters = useAtomValue(charactersAtom);

  return (
    <>
      {characters.map(character => (
        <HoodieCharacter
          key={character.id}
          position={new Vector3(character.position[0], character.position[1], character.position[2])}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}

      <Item name="Armchair" />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position-y={-0.001}
        onClick={e => {
          socket.emit("move", [e.point.x, 0, e.point.z]);
        }}
        onPointerEnter={() => setIsOnFloor(true)}
        onPointerLeave={() => setIsOnFloor(false)}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      <OrbitControls />
      <ContactShadows blur={2} />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
