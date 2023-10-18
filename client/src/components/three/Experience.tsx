import { Environment, OrbitControls } from "@react-three/drei";
import HoodieCharacter from "./HoodieCharacter";

const Experience = () => {
  return (
    <>
      <HoodieCharacter />
      <OrbitControls />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
