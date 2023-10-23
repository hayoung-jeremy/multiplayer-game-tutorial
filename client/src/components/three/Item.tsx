import { useGLTF } from "@react-three/drei";

interface Props {
  name: string;
}

const Item = ({ name }: Props) => {
  const { scene } = useGLTF(`models/items/${name}.glb`);

  return <primitive object={scene} />;
};

export default Item;
