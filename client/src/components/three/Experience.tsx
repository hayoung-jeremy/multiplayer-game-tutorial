import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import HoodieCharacter from "./HoodieCharacter";

const Experience = () => {
  return (
    <>
      <HoodieCharacter hairColor="pink" topColor="blue" bottomColor="green" />
      <HoodieCharacter position-x={1} hairColor="red" topColor="yellow" bottomColor="white" />
      <OrbitControls />
      <ContactShadows blur={2} />
      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
 