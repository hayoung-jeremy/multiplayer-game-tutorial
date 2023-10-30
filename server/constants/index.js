export const gameItems = {
  bed: {
    name: "Bed",
    size: [5, 7],
  },
  desk: {
    name: "Desk",
    size: [5, 3],
  },
  couch: {
    name: "Couch",
    size: [6, 5],
  },
  table: {
    name: "Table",
    size: [5, 3],
  },
  grandfathersClock: {
    name: "GrandfathersClock",
    size: [2, 1],
  },
  cabinet: {
    name: "Cabinet",
    size: [2, 1],
  },
  armchair: {
    name: "Armchair",
    size: [3, 2],
  },
  bookshelf: {
    name: "Bookshelf",
    size: [3, 1],
  },
  wallCorkboard: {
    name: "WallCorkboard",
    size: [3, 1],
    wall: true,
  },
  rug: {
    name: "Rug",
    size: [4, 6],
    walkable: true,
  },
};

export const gameMap = {
  size: [10, 10],
  gridDivision: 2,
  gameItems: [
    {
      ...gameItems.armchair,
      gridPosition: [9, 6],
      rotation: 0,
    },

    {
      ...gameItems.bed,
      gridPosition: [15, 0],
      rotation: 0,
    },
    {
      ...gameItems.desk,
      gridPosition: [0, 8],
      rotation: 1,
    },
    {
      ...gameItems.couch,
      gridPosition: [0, 0],
      rotation: 1,
    },
    {
      ...gameItems.table,
      gridPosition: [8, 8],
      rotation: 0,
    },
    {
      ...gameItems.grandfathersClock,
      gridPosition: [0, 12],
      rotation: 1,
    },
    {
      ...gameItems.wallCorkboard,
      gridPosition: [8, 0],
      rotation: 0,
    },
    {
      ...gameItems.rug,
      gridPosition: [10, 0],
      rotation: 0,
    },
  ],
};
