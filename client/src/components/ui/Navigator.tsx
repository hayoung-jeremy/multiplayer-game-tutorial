import { useAtom } from "jotai";

import { Close, Rotate360, Store, Undo, ViewIn3D } from "../icons";
import { cls } from "@/utils";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom, shopModeAtom } from "../jotai/mode";

const Navigator = () => {
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(draggedItemRotationAtom);

  return (
    <nav className="fixed bottom-10 left-1/2 translate-x-[-50%] pointer-events-none z-[10000]">
      <ul className="flex items-center justify-center gap-2 pointer-events-auto">
        {(buildMode || shopMode) && draggedItem === null && (
          <li
            onClick={() => (shopMode ? setShopMode(false) : setBuildMode(false))}
            className={cls(
              "p-2 rounded-full",
              "border border-transparent hover:border-white",
              "text-black",
              "bg-[#ffffff50] backdrop-blur",
              "shadow-[0px_2px_12px_4px_#00000010] hover:shadow-[0px_2px_12px_4px_#ffffff40]",
              "transition-all duration-[200ms]",
              "cursor-pointer select-none"
            )}
          >
            <Undo />
          </li>
        )}
        {!buildMode && !shopMode && (
          <li
            onClick={() => setBuildMode(true)}
            className={cls(
              "p-2 rounded-full",
              "border border-transparent hover:border-white",
              "text-black",
              "bg-[#ffffff50] backdrop-blur",
              "shadow-[0px_2px_12px_4px_#00000010] hover:shadow-[0px_2px_12px_4px_#ffffff40]",
              "transition-all duration-[200ms]",
              "cursor-pointer select-none"
            )}
          >
            <ViewIn3D />
          </li>
        )}
        {buildMode && !shopMode && draggedItem === null && (
          <li
            onClick={() => setShopMode(true)}
            className={cls(
              "p-2 rounded-full",
              "border border-transparent hover:border-white",
              "text-black",
              "bg-[#ffffff50] backdrop-blur",
              "shadow-[0px_2px_12px_4px_#00000010] hover:shadow-[0px_2px_12px_4px_#ffffff40]",
              "transition-all duration-[200ms]",
              "cursor-pointer select-none"
            )}
          >
            <Store />
          </li>
        )}
        {buildMode && !shopMode && draggedItem !== null && (
          <li
            onClick={() => setDraggedItemRotation(draggedItemRotation === 3 ? 0 : draggedItemRotation + 1)}
            className={cls(
              "p-2 rounded-full",
              "border border-transparent hover:border-white",
              "text-black",
              "bg-[#ffffff50] backdrop-blur",
              "shadow-[0px_2px_12px_4px_#00000010] hover:shadow-[0px_2px_12px_4px_#ffffff40]",
              "transition-all duration-[200ms]",
              "cursor-pointer select-none"
            )}
          >
            <Rotate360 />
          </li>
        )}
        {buildMode && !shopMode && draggedItem !== null && (
          <li
            onClick={() => setDraggedItem(null)}
            className={cls(
              "p-2 rounded-full",
              "border border-transparent hover:border-white",
              "text-black",
              "bg-[#ffffff50] backdrop-blur",
              "shadow-[0px_2px_12px_4px_#00000010] hover:shadow-[0px_2px_12px_4px_#ffffff40]",
              "transition-all duration-[200ms]",
              "cursor-pointer select-none"
            )}
          >
            <Close />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigator;
