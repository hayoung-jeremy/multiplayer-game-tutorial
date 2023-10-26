import { atom } from "jotai";

export const buildModeAtom = atom(false);
export const shopModeAtom = atom(false);
export const draggedItemAtom = atom<number | null>(null);
export const draggedItemRotationAtom = atom(0);
