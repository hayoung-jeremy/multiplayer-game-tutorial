export interface GameCharacter {
  id: string;
  position: [number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
  path: [number, number][];
}

export interface GameItemProps {
  name: string;
  size: [number, number];
}

export type GameItemsDictionary = {
  [key: string]: GameItemProps;
};

export interface PositionedGameItem extends GameItemProps {
  gridPosition: [number, number];
  rotation?: number;
  walkable?: boolean;
  wall?: boolean;
  tmp?: boolean;
}

export interface GameMap {
  size: [number, number];
  gridDivision: number;
  gameItems: PositionedGameItem[];
}

export interface GameObject {
  id: string;
  characters: GameCharacter[];
  gameItems: GameItemsDictionary;
  gameMap: GameMap;
}
