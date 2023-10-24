import { GameCharacter, GameMap } from "@/types/socket";
import { atom } from "jotai";

export const charactersAtom = atom<GameCharacter[]>([]);
export const mapAtom = atom<GameMap | null>(null);
export const userAtom = atom<string | null>(null);
