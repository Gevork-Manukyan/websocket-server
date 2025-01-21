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
import { handleSocketError } from "./utils/utilities";

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
const gameEventEmitter = new GameEventEmitter(io);

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");
gameNamespace.on("connection", (socket) => {
  function socketCallback(
    eventName: string,
    fn: (...args: any[]) => Promise<void>
  ) {
    return handleSocketError(socket, eventName, fn);
  }

  socket.on(
    "join-game",
    socketCallback("join-game", async (gameId, numPlayers) => {
      let gameRoom = gameStateManager.getGame(gameId);

      // Create game if doesn't exist
      if (!gameRoom) {
        gameRoom = gameStateManager.addGame(new ConGame(gameId, numPlayers));
        gameRoom.addPlayer(new Player(socket.id, true)); // First player to join is the host
      } else {
        gameRoom.addPlayer(new Player(socket.id));
      }

      socket.join(gameId);
      socket.emit("join-game-success");
    })
  );

  socket.on(
    "select-sage",
    socketCallback("select-sage", async (gameId: ConGame["id"], sage: Sage) => {
      gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
      socket.emit("select-sage-success");
    })
  );

  socket.on(
    "toggle-ready-status",
    socketCallback("toggle-ready-status", async (gameId: ConGame["id"]) => {
      const currPlayer = gameStateManager.getGame(gameId).getPlayer(socket.id);
      currPlayer.toggleReady();

      if (currPlayer.isReady) {
        socket.emit("ready-status__ready");
      } else {
        socket.emit("ready-status__not-ready");
      }
    })
  );

  socket.on(
    "join-team",
    socketCallback("join-team", async (gameId: ConGame["id"], team: 1 | 2) => {
      gameStateManager.getGame(gameId).joinTeam(socket.id, team);
    })
  );

  socket.on(
    "start-game",
    socketCallback("start-game", async (gameId: ConGame["id"]) => {
      const gameRoom = gameStateManager.getGame(gameId);
      gameRoom.startGame(socket.id);
      gameEventEmitter.emitPickWarriors(gameRoom.players);

      // TODO: coin flip for who is first. Players decide play order if 4 players

      gameRoom.setStarted(true);
    })
  );

  socket.on(
    "chose-warriors",
    socketCallback("chose-warriors", async (gameId: ConGame["id"], choices: [ElementalWarriorCard, ElementalWarriorCard]) => {
        gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);

        // TODO: Emit to player to choose battlefield layout
      }
    )
  );

  socket.on("finished-setup", socketCallback("finished-setup", async (gameId: ConGame["id"]) => {
    const gameRoom = gameStateManager.getGame(gameId);
    gameRoom.numPlayersFinishedSetup++;

    if (gameRoom.numPlayersFinishedSetup === gameRoom.players.length)
      // TODO: Go to choosing who is first and emit to players who is first
      return;
  }));

  socket.on("leave-game", socketCallback("leave-game", async (gameId: ConGame["id"]) => {
    const currPlayerId = socket.id;
    gameStateManager.getGame(gameId).removePlayer(currPlayerId);

    socket.leave(gameId);
  }));
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app };
