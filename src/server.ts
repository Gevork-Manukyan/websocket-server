import express from "express"; 
import http from "http"; 
import { Server } from "socket.io";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { GameEventEmitter } from "./services";
import { gameStateManager } from "./services/GameStateManager";
import { IS_PRODUCTION } from "./utils/constants";
import { PORT } from "./utils/config";
import { CancelSetupData, CancelSetupEvent, ChoseWarriorsData, ChoseWarriorsEvent, ClearTeamsData, ClearTeamsEvent, CreateGameData, CreateGameEvent, FinishedSetupData, FinishedSetupEvent, JoinGameData, JoinGameEvent, JoinTeamData, JoinTeamEvent, LeaveGameData, LeaveGameEvent, SelectSageData, SelectSageEvent, SocketEventMap, StartGameData, StartGameEvent, SwapWarriorsData, SwapWarriorsEvent, ToggleReadyStatusData, ToggleReadyStatusEvent } from "./types/server-types";
import { processEvent, socketErrorHandler } from "./utils/utilities";
import { ValidationError } from "./services/CustomError/BaseError";

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

  // TODO: create a system to enforce an order of calling events. Shouldn't be able to call events out of order

  socket.on(CreateGameEvent, socketErrorHandler(socket, CreateGameEvent, async ({ gameId, numPlayers }: CreateGameData) => {
    const newGame = gameStateManager.addGame(new ConGame(gameId, numPlayers));
    newGame.addPlayer(new Player(socket.id, true)); // First player to join is the host
    socket.join(gameId);
    socket.emit(`${CreateGameEvent}--success`);
  }));

  socket.on(JoinGameEvent, socketErrorHandler(socket, JoinGameEvent, async ({ gameId }: JoinGameData) => {
    gameStateManager.getGame(gameId).addPlayer(new Player(socket.id));
    socket.join(gameId);
    socket.emit(`${JoinGameEvent}--success`);
  }));

  socket.on(SelectSageEvent, socketErrorHandler(socket, SelectSageEvent, async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    socket.emit(`${SelectSageEvent}--success`);
  }));

  socket.on(JoinTeamEvent, socketErrorHandler(socket, JoinTeamEvent, async ({ gameId, team }: JoinTeamData) => {
    gameStateManager.getGame(gameId).joinTeam(socket.id, team);
    socket.emit(`${JoinTeamEvent}--success`);
  }));

  socket.on(ClearTeamsEvent, socketErrorHandler(socket, ClearTeamsEvent, async ({ gameId }: ClearTeamsData) => {
    gameStateManager.getGame(gameId).clearTeams();
    socket.emit(`${ClearTeamsEvent}--success`);
  }));

  socket.on(ToggleReadyStatusEvent, socketErrorHandler(socket, ToggleReadyStatusEvent, async ({ gameId }: ToggleReadyStatusData) => {
    const game = gameStateManager.getGame(gameId);
    const currPlayer = game.getPlayer(socket.id);
    if (!currPlayer.sage) throw new ValidationError("Cannot toggle ready. The sage has not been set.", "sage");
    currPlayer.toggleReady();

    if (currPlayer.isReady) {
      game.incrementPlayersReady();
      socket.emit("ready-status--ready");
    } else {
      game.decrementPlayersReady();
      socket.emit("ready-status--not-ready");
    }
  }));

  socket.on(StartGameEvent, socketErrorHandler(socket, StartGameEvent, async ({ gameId }: StartGameData) => {
    const game = gameStateManager.getGame(gameId);
    const playerId = socket.id;

    game.startGame(playerId);
    gameEventEmitter.emitPickWarriors(game.players);
    // TODO: coin flip for who is first. Players decide play order if 4 players
    game.setStarted(true);
  }));

  socket.on(ChoseWarriorsEvent, socketErrorHandler(socket, ChoseWarriorsEvent, async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.getGame(gameId).getPlayer(socket.id).chooseWarriors(choices);
    socket.emit(`${ChoseWarriorsEvent}--success`)
  }));

  socket.on(SwapWarriorsEvent, socketErrorHandler(socket, SwapWarriorsEvent, async ({ gameId }: SwapWarriorsData) => {
    gameStateManager.getGame(gameId).getPlayer(socket.id).swapWarriors()
    socket.emit(`${SwapWarriorsEvent}--success`)
  }));

  socket.on(FinishedSetupEvent, socketErrorHandler(socket, FinishedSetupEvent, async ({ gameId }: FinishedSetupData) => {
    const game = gameStateManager.getGame(gameId);
    game.finishPlayerSetup(socket.id);

    if (game.numPlayersFinishedSetup === game.players.length) {
      // TODO: Go to choosing who is first and emit to players who is first
      
    }
  }));

  socket.on(CancelSetupEvent, socketErrorHandler(socket, CancelSetupEvent, async ({ gameId }: CancelSetupData) => {
    gameStateManager.getGame(gameId).cancelPlayerSetup(socket.id)
    socket.emit(`${CancelSetupEvent}--success`)
  }))

  socket.on(LeaveGameEvent, socketErrorHandler(socket, LeaveGameEvent, async ({ gameId }: LeaveGameData) => {
    gameStateManager.getGame(gameId).removePlayer(socket.id);
    socket.leave(gameId);
    socket.emit(`${LeaveGameEvent}--success`);
  }));
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app };
