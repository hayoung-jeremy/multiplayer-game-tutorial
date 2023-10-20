import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import HoodieCharacter from "./HoodieCharacter";
import { useAtom, useAtomValue } from "jotai";
import { charactersAtom } from "../jotai/users";

const Experience = () => {
  const characters = useAtomValue(charactersAtom);

  return (
    <>
      {characters.map(character => (
        <HoodieCharacter
          key={character.id}
          position={character.position}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
      <OrbitControls />
      <ContactShadows blur={2} />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
