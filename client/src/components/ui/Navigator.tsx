import { Close, Rotate360, Store, Undo, ViewIn3D } from "../icons";
import { cls } from "@/utils";

const Navigator = () => {
  return (
    <nav className="fixed bottom-10 left-1/2 translate-x-[-50%] pointer-events-none z-[10000]">
      <ul className="flex items-center justify-center gap-2 pointer-events-auto">
        <li
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
        <li
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
        <li
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
        <li
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
        <li
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
      </ul>
    </nav>
  );
};

export default Navigator;
