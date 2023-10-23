import { useState } from "react";
import { Vector3 } from "three";
import { ContactShadows, Environment, OrbitControls, useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";

import { charactersAtom, mapAtom } from "../jotai/users";
import { socket } from "@/socket";

import HoodieCharacter from "./HoodieCharacter";
import Item from "./Item";

const Experience = () => {
  const [isOnFloor, setIsOnFloor] = useState(false);
  useCursor(isOnFloor);
  const characters = useAtomValue(charactersAtom);
  const map = useAtomValue(mapAtom);

  return (
    <>
      {characters.map(character => (
        <HoodieCharacter
          key={character.id}
          userId={character.id}
          position={new Vector3(character.position[0], character.position[1], character.position[2])}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}

      {map &&
        map.items.map((item, idx) => {
          return <Item key={`${item}-${idx}`} item={item} />;
        })}

      {map && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position-x={map.size[0] / 2}
          position-y={-0.001}
          position-z={map.size[1] / 2}
          onClick={e => {
            socket.emit("move", [e.point.x, 0, e.point.z]);
          }}
          onPointerEnter={() => setIsOnFloor(true)}
          onPointerLeave={() => setIsOnFloor(false)}
        >
          <planeGeometry args={map.size} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      )}

      <OrbitControls />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
