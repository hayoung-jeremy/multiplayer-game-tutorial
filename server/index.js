import { Server } from "socket.io";
import pathfinding from "pathfinding";

import { gameMap, gameItems } from "./constants/index.js";
import { generateRandomPosition, generateRandomHexColor } from "./utils/index.js";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

const characters = [];
.


const grid = new pathfinding.Grid(gameMap.size[0] * gameMap.gridDivision, gameMap.size[1] * gameMap.gridDivision);

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

  socket.on("move", position => {
    const character = characters.find(character => character.id === socket.id);
    character.position = position;
    io.emit("characters", characters);
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
