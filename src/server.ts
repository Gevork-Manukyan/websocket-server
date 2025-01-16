import express from "express"; // Import Express
import http from "http"; // Import Node.js HTTP module
import { Server } from "socket.io"; // Import types from Socket.IO
import { PORT } from "./utils/constants";
import { CurrentGames, ElementalWarriorCard } from "./types";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { Sage } from "./types";
import { GameEventEmitter } from "./services";

const app = express();
const server = http.createServer(); // Create an HTTP server

// Middleware to parse JSON requests
app.use(express.json());
// Allows for CORS
// const cors = require('cors');
// app.use(cors())

// Initialize the WebSocket server with CORS settings
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for development)
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

// Init Variables
const gameEventEmitter = new GameEventEmitter(io)
const currentGames: CurrentGames = {};

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");
gameNamespace.on("connection", (socket) => {
  console.log("A player connected to the gameplay namespace");

  socket.on("join-game", (gameId: ConGame["id"], numPlayers: ConGame['numPlayersTotal']) => {
    let gameRoom = currentGames[gameId];

    // Create game if doesn't exist
    if (!gameRoom) {
      gameRoom = new ConGame(gameId, numPlayers);
      gameRoom.addPlayer(new Player(socket.id, true)); // Make first player to join the host
    } else {
      gameRoom.addPlayer(new Player(socket.id));
    }

    socket.join(gameId); // Creates room if doesn't exist
    console.log(`Player joined game: ${gameId}`);
  });

  socket.on("toggle-ready-status", (gameId: ConGame["id"]) => {
    const currPlayer = currentGames[gameId].getPlayer(socket.id)
    if (!currPlayer)
      throw new Error(
        `Player with socket ID ${socket.id} not found in game ${gameId}`
      );
    currPlayer.toggleReady();

    console.log(
      `Player ${currPlayer.id} is ${
        currPlayer.isReady ? "ready!" : "not ready."
      }`
    );
  });

  socket.on("select-sage", (gameId: ConGame["id"], sage: Sage) => {
    const isSageChosen = currentGames[gameId].setPlayerSage(socket.id, sage)

  })

  socket.on("join-team", (gameId: ConGame['id'], team: 1 | 2) => {
    currentGames[gameId].joinTeam(socket.id, team);
  })

  socket.on("start-game", (gameId: ConGame["id"]) => {
    const gameRoom = currentGames[gameId];
    gameRoom.startGame(socket.id);    
    gameEventEmitter.emitPickWarriors(gameRoom.players)

    gameRoom.setStarted(true);
    console.log(`Game ${gameId} started!`);
  });

  socket.on("chose-warriors", (gameId: ConGame['id'], choices: [ElementalWarriorCard, ElementalWarriorCard]) => {
    currentGames[gameId].chooseWarriors(socket.id, choices);
    
    // TODO: Emit to player to choose battlefield layout
  })

  socket.on("finished-setup", (gameId: ConGame['id']) => {
    const gameRoom = currentGames[gameId];
    gameRoom.numPlayersFinishedSetup++;

    if (gameRoom.numPlayersFinishedSetup === gameRoom.players.length)
      // TODO: Go to choosing who is first and emit to players who is first
      return;
  })

  socket.on("leave-game", (gameId: ConGame["id"]) => {
    const currPlayerId = socket.id;
    currentGames[gameId].removePlayer(currPlayerId);

    socket.leave(gameId);
    console.log(`Player ${currPlayerId} left game ${gameId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected from gameplay namespace`);
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});