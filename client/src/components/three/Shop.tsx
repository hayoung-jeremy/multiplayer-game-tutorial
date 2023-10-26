import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { Group } from "three";
import { useAtomValue } from "jotai";
import { itemsAtom } from "../jotai/item";
import { mapAtom } from "../jotai/users";
import ShopItem from "./ShopItem";

const Shop = () => {
  const items = useAtomValue(itemsAtom);
  const gameMap = useAtomValue(mapAtom);

  const shopContainer = useRef<Group>(null);
  const maxX = useRef(0);
  const scrollData = useScroll();

  const shopItems = useMemo(() => {
    if (!gameMap) return;
    let x = 0;
    return Object.values(items).map((item, idx) => {
      const xPos = x;
      x += item.size[0] / gameMap.gridDivision + 1;
      maxX.current = x;
      return <ShopItem key={item.name + idx} item={item} position-x={xPos} />;
    });
  }, [items]);

  useFrame(() => {
    if (!shopContainer.current) return;

    shopContainer.current.position.x = -scrollData.offset * maxX.current;
  });

  return <group ref={shopContainer}>{shopItems}</group>;
};

export default Shop;
