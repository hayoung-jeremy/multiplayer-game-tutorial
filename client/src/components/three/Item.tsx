import { useMemo, useState } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useAtomValue } from "jotai";

import { mapAtom } from "../jotai/users";
import { buildModeAtom } from "../jotai/mode";
import { PositionedGameItem } from "@/types/socket";
import { useGrid } from "@/hooks";

interface Props {
  item: PositionedGameItem;
  onClick: () => void;
  isDragging: boolean;
  dragPosition: [number, number] | null;
  dragRotation: number;
  canDrop: boolean;
}

const Item = ({ item, onClick, isDragging, dragPosition, dragRotation, canDrop }: Props) => {
  const { name, size, gridPosition, rotation: itemRotation } = item;
  const rotation = isDragging ? dragRotation : itemRotation;

  const isBuildMode = useAtomValue(buildModeAtom);
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isBuildMode ? isHovered : false);

  const { scene } = useGLTF(`models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];

  const map = useAtomValue(mapAtom);

  const { gridToVector3 } = useGrid();

  if (!map) return null;

  return (
    <group
      onClick={onClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      position={gridToVector3(isDragging ? dragPosition || gridPosition : gridPosition, width, height)}
    >
      <primitive object={clone} rotation-y={rotation ? (rotation * Math.PI) / 2 : 0} />
      {isDragging && (
        <mesh>
          <boxGeometry args={[width / map.gridDivision, 0.1, height / map.gridDivision]} />
          <meshBasicMaterial color={canDrop ? "green" : "red"} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};

export default Item;
