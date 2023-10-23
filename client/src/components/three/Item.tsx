import { useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { MapItem, mapAtom } from "../jotai/users";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

interface Props {
  item: MapItem;
}

const Item = ({ item }: Props) => {
  const { name, size, gridPosition, rotation } = item;
  const map = useAtomValue(mapAtom);
  const { scene } = useGLTF(`models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  if (!map) return null;

  return (
    <primitive
      object={clone}
      position={[
        size[0] / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
        0,
        size[1] / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
      ]}
      rotation-y={rotation ? (rotation * Math.PI) / 2 : 0}
    />
  );
};

export default Item;
