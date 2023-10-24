import { gameMap } from "../constants/index.js";

export const generateRandomPosition = () => {
  return [Math.random() * gameMap.size[0], 0, Math.random() * gameMap.size[1]];
};

export const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
