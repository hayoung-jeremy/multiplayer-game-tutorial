import { atom } from "jotai";

export interface User {
  id: string;
  position: [number, number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
}

export const charactersAtom = atom<User[]>([]);
