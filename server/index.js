import { Server } from "socket.io";
import pathfinding from "pathfinding";

import { gameMap, gameItems } from "./constants/index.js";
import { generateRandomHexColor } from "./utils/index.js";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

const characters = [];

const grid = new pathfinding.Grid(gameMap.size[0] * gameMap.gridDivision, gameMap.size[1] * gameMap.gridDivision);
const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (start, end) => {
  if (!start || !end || start.length !== 2 || end.length !== 2) {
    console.error("Invalid arguments for findPath:", start, end);
    return;
  }

  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);

  return path;
};

const updateGrid = () => {
  // reset
  for (let x = 0; x < gameMap.size[0] * gameMap.gridDivision; x++) {
    for (let y = 0; y < gameMap.size[1] * gameMap.gridDivision; y++) {
      grid.setWalkableAt(x, y, true);
    }
  }

  gameMap.gameItems.forEach(item => {
    if (item.walkable || item.wall) return;

    const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid.setWalkableAt(x + item.gridPosition[0], y + item.gridPosition[1], false);
      }
    }
  });
};

updateGrid();

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * gameMap.size[0] * gameMap.gridDivision);
    const y = Math.floor(Math.random() * gameMap.size[1] * gameMap.gridDivision);
    if (grid.isWalkableAt(x, y)) return [x, y];
  }
};

io.on("connection", socket => {
  console.log("user connected");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("hello", {
    gameMap,
    characters,
    id: socket.id,
    gameItems,
  });

  io.emit("characters", characters);

  socket.on("move", (from, to) => {
    console.log(from);
    console.log(to);
    const character = characters.find(character => character.id === socket.id);
    const path = findPath(from, to);
    if (!path) return;

    console.log("path : ", path);

    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("itemsUpdate", items => {
    if (items === null) return;
    console.log("넘어온 items : ", items);
    gameMap.gameItems = items;
    characters.forEach(character => {
      character.path = [];
      character.position = generateRandomPosition();
    });
    updateGrid();
    io.emit("mapUpdated", {
      gameMap,
      characters,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    characters.splice(
      characters.findIndex(character => character.id === socket.id),
      1
    );

    io.emit("characters", characters);
  });
});
