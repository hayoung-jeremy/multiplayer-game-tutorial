/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { charactersAtom, mapAtom, userAtom } from "../jotai/users";
import { socket } from "@/socket";
import { GameObject } from "@/types/socket";

const SocketManager = () => {
  const setCharacters = useSetAtom(charactersAtom);
  const setMap = useSetAtom(mapAtom);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello(value: GameObject) {
      console.log("hello", value);
      setMap(value.gameMap);
      setUser(value.id);
      setCharacters(value.characters);
    }

    function onCharacters(value: any) {
      console.log("characters", value);
      setCharacters(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, [setCharacters]);

  return null;
};

export default SocketManager;
