/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector3 } from "three";
import { useAtomValue } from "jotai";
import { mapAtom } from "@/components/jotai/users";

const useGrid = () => {
  const gameMap = useAtomValue(mapAtom);

  const vector3ToGrid = (vector3: Vector3) => {
    if (!gameMap) return [0, 0];
    return [Math.floor(vector3.x * gameMap.gridDivision), Math.floor(vector3.z * gameMap.gridDivision)];
  };
  const gridToVector3 = (gridPosition: [number, number], width = 1, height = 1) => {
    if (!gameMap) return new Vector3(0, 0, 0);

    return new Vector3(
      width / gameMap.gridDivision / 2 + gridPosition[0] / gameMap.gridDivision,
      0,
      height / gameMap.gridDivision / 2 + gridPosition[1] / gameMap.gridDivision
    );
  };

  return {
    vector3ToGrid,
    gridToVector3,
  };
};

export default useGrid;
