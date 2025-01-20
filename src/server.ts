import express from "express"; // Import Express
import http from "http"; // Import Node.js HTTP module
import { Server } from "socket.io"; // Import types from Socket.IO
import { ElementalWarriorCard } from "./types";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { Sage } from "./types";
import { GameEventEmitter } from "./services";
import { gameStateManager } from "./services/GameStateManager";
import { IS_PRODUCTION } from "./utils/constants";
import { PORT } from "./utils/config";

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
const gameEventEmitter = new GameEventEmitter(io)

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");
gameNamespace.on("connection", (socket) => {
  console.log("A player connected to the gameplay namespace");

  socket.on("join-game", (gameId: ConGame["id"], numPlayers: ConGame['numPlayersTotal']) => {
    let gameRoom = gameStateManager.getGame(gameId);

    // Create game if doesn't exist
    if (!gameRoom) {
      gameRoom = gameStateManager.addGame(new ConGame(gameId, numPlayers));
      gameRoom.addPlayer(new Player(socket.id, true)); // First player to join is the host
    } else {
      gameRoom.addPlayer(new Player(socket.id));
    }

    socket.join(gameId);
    socket.emit("join-game-success")
    console.log(`Player joined game: ${gameId}`);
  });

  socket.on("select-sage", (gameId: ConGame["id"], sage: Sage) => {
    const isSageChosen = gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage)
    socket.emit("select-sage-success")
  })

  socket.on("toggle-ready-status", (gameId: ConGame["id"]) => {
    const currPlayer = gameStateManager.getGame(gameId).getPlayer(socket.id)
    if (!currPlayer) throw new Error(`Player with socket ID ${socket.id} not found in game ${gameId}`);
    
    currPlayer.toggleReady();

    if (currPlayer.isReady) {
      // console.log(`Player ${socket.id} is now ready`);
      socket.emit("ready-status__ready");
    } else {
      // console.log(`Player ${socket.id} is now not ready`);
      socket.emit("ready-status__not-ready");
    }
  });

  socket.on("join-team", (gameId: ConGame['id'], team: 1 | 2) => {
    gameStateManager.getGame(gameId).joinTeam(socket.id, team);
  })

  socket.on("start-game", (gameId: ConGame["id"]) => {
    const gameRoom = gameStateManager.getGame(gameId);
    gameRoom.startGame(socket.id);    
    gameEventEmitter.emitPickWarriors(gameRoom.players)

    // TODO: coin flip for who is first. Players decide play order if 4 players

    gameRoom.setStarted(true);
    console.log(`Game ${gameId} started!`);
  });

  socket.on("chose-warriors", (gameId: ConGame['id'], choices: [ElementalWarriorCard, ElementalWarriorCard]) => {
    gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);
    
    // TODO: Emit to player to choose battlefield layout
  })

  socket.on("finished-setup", (gameId: ConGame['id']) => {
    const gameRoom = gameStateManager.getGame(gameId);
    gameRoom.numPlayersFinishedSetup++;

    if (gameRoom.numPlayersFinishedSetup === gameRoom.players.length)
      // TODO: Go to choosing who is first and emit to players who is first
      return;
  })

  socket.on("leave-game", (gameId: ConGame["id"]) => {
    const currPlayerId = socket.id;
    gameStateManager.getGame(gameId).removePlayer(currPlayerId);

    socket.leave(gameId);
    console.log(`Player ${currPlayerId} left game ${gameId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected from gameplay namespace`);
  });
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app }