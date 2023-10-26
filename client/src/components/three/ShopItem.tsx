import { useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

import { GameItemProps } from "@/types/socket";
import { useGrid } from "@/hooks";

interface Props extends GroupProps {
  item: GameItemProps;
}

const ShopItem = ({ item, ...props }: Props) => {
  const { name, size } = item;
  const { scene } = useGLTF(`models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { gridToVector3 } = useGrid();

  return (
    <group {...props}>
      <group position={gridToVector3([0, 0], size[0], size[1])}>
        <primitive object={clone} />
      </group>
    </group>
  );
};

export default ShopItem;
