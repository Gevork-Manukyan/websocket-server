import express from "express"; 
import http from "http"; 
import { Server } from "socket.io";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { GameEventEmitter } from "./services";
import { gameStateManager } from "./services/GameStateManager";
import { IS_PRODUCTION } from "./utils/constants";
import { PORT } from "./utils/config";
import { ChoseWarriorsData, ClearTeamsData, CreateGameData, FinishedSetupData, JoinGameData, JoinTeamData, LeaveGameData, SelectSageData, SocketEventMap, StartGameData, ToggleReadyStatusData } from "./types/server-types";
import { handleSocketError, processEvent, socketErrorHandler } from "./utils/utilities";
import { CustomError } from "./services/CustomError/BaseError";

const app = express();
const server = http.createServer(); // Create an HTTP server

app.use(express.json());
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

  socket.use(([event, rawData], next) => {
    processEvent(socket, event as keyof SocketEventMap, rawData, next)
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("create-game", socketErrorHandler(socket, "create-game", async ({ gameId, numPlayers }: CreateGameData) => {
    const newGame = gameStateManager.addGame(new ConGame(gameId, numPlayers));
    newGame.addPlayer(new Player(socket.id, true)); // First player to join is the host
    socket.join(gameId);
    socket.emit("create-game--success");
  }));

  socket.on("join-game", socketErrorHandler(socket, "join-game", async ({ gameId }: JoinGameData) => {
    gameStateManager.getGame(gameId).addPlayer(new Player(socket.id));
    socket.join(gameId);
    socket.emit("join-game--success");
  }));

  socket.on("select-sage", socketErrorHandler(socket, "select-sage", async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    socket.emit("select-sage--success");
  }));

  socket.on("toggle-ready-status", socketErrorHandler(socket, "toggle-ready-status", async ({ gameId }: ToggleReadyStatusData) => {
    const game = gameStateManager.getGame(gameId);
    const currPlayer = game.getPlayer(socket.id);
    currPlayer.toggleReady();

    if (currPlayer.isReady) {
      game.incrementPlayersReady();
      socket.emit("ready-status--ready");
    } else {
      game.decrementPlayersReady();
      socket.emit("ready-status--not-ready");
    }
  }));

  socket.on("join-team", socketErrorHandler(socket, "join-team", async ({ gameId, team }: JoinTeamData) => {
    gameStateManager.getGame(gameId).joinTeam(socket.id, team);
    socket.emit("join-team--success");
  }));

  socket.on("clear-teams", socketErrorHandler(socket, "clear-teams", async ({ gameId }: ClearTeamsData) => {
    gameStateManager.getGame(gameId).clearTeams();
    socket.emit("clear-teams--success");
  }));

  socket.on("start-game", socketErrorHandler(socket, "start-game", async ({ gameId }: StartGameData) => {
    const game = gameStateManager.getGame(gameId);
    const playerId = socket.id;

    game.startGame(playerId);
    gameEventEmitter.emitPickWarriors(game.players);
    // TODO: coin flip for who is first. Players decide play order if 4 players
    game.setStarted(true);
  }));

  socket.on("chose-warriors", socketErrorHandler(socket, "chose-warriors", async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);
    // TODO: Emit to player to choose battlefield layout
  }));

  socket.on("finished-setup", socketErrorHandler(socket, "finished-setup", async ({ gameId }: FinishedSetupData) => {
    const game = gameStateManager.getGame(gameId);
    game.numPlayersFinishedSetup++;

    if (game.numPlayersFinishedSetup === game.players.length)
      // TODO: Go to choosing who is first and emit to players who is first
      return;
  }));

  socket.on("leave-game", socketErrorHandler(socket, "leave-game", async ({ gameId }: LeaveGameData) => {
    gameStateManager.getGame(gameId).removePlayer(socket.id);
    socket.leave(gameId);
    socket.emit("leave-game--success");
  }));
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app };
