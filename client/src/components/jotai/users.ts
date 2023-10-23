import { atom } from "jotai";

export interface User {
  id: string;
  position: [number, number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
}

export const charactersAtom = atom<User[]>([]);

export type MapItem = {
  name: string;
  size: [number, number];
  gridPosition: [number, number];
  rotation?: number;
};

interface Map {
  gridDivision: number;
  items: MapItem[];
  size: [number, number];
}

export const mapAtom = atom<Map | null>(null);
export const userAtom = atom(null);
