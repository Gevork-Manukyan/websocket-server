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
import { handleSocketError, processEvent } from "./utils/utilities";
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
  })

  socket.on(
    "create-game", 
    ({ gameId, numPlayers }: CreateGameData) => {
      try {
        const newGame = gameStateManager.addGame(new ConGame(gameId, numPlayers))
        newGame.addPlayer(new Player(socket.id, true)) // First player to join is the host
        socket.join(gameId)
        socket.emit("create-game--success")
      } catch (error) {
        handleSocketError(socket, "create-game", error as CustomError)
      }
    }
  )

  socket.on(
    "join-game",
    ({ gameId }: JoinGameData) => {
      try {
        gameStateManager.getGame(gameId).addPlayer(new Player(socket.id));
        socket.join(gameId);
        socket.emit("join-game--success");
      } catch (error) {
        handleSocketError(socket, "join-game", error as CustomError)
      }
    }
  );
  

  socket.on(
    "select-sage",
    ({ gameId, sage }: SelectSageData) => {
      try {
        gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
        socket.emit("select-sage--success");
      } catch (error) {
        handleSocketError(socket, "select-sage", error as CustomError)
      }
    }
  );

  socket.on(
    "toggle-ready-status",
    ({ gameId }: ToggleReadyStatusData) => {
      try {
        const game = gameStateManager.getGame(gameId)
        const currPlayer = game.getPlayer(socket.id);
        currPlayer.toggleReady();
        
        if (currPlayer.isReady) {
          game.incrementPlayersReady()
          socket.emit("ready-status--ready");
        } else {
          game.decrementPlayersReady()
          socket.emit("ready-status--not-ready");
        }
      } catch (error) {
        handleSocketError(socket, "toggle-ready-status", error as CustomError)
      }
    }
  );

  socket.on(
    "join-team",
    ({ gameId, team }: JoinTeamData) => {
      try {
        gameStateManager.getGame(gameId).joinTeam(socket.id, team);
        socket.emit("join-team--success")
      } catch (error) {
        handleSocketError(socket, "join-team", error as CustomError)
      }
    }
  );

  socket.on(
    "clear-teams", 
    ({ gameId }: ClearTeamsData) => {
      try {
        gameStateManager.getGame(gameId).clearTeams()
        socket.emit("clear-teams--success")
      } catch (error) {
        handleSocketError(socket, "clear-teams", error as CustomError)
      }
    }
  );

  socket.on(
    "start-game",
    ({ gameId }: StartGameData) => {
      try {
        const game = gameStateManager.getGame(gameId);
        const playerId = socket.id;
        
        game.startGame(playerId);
        gameEventEmitter.emitPickWarriors(game.players);
  
        // TODO: coin flip for who is first. Players decide play order if 4 players
  
        game.setStarted(true);
      } catch (error) {
        handleSocketError(socket, "start-game", error as CustomError)
      }
    }
  );

  socket.on(
    "chose-warriors",
    ({ gameId, choices }: ChoseWarriorsData) => {
      try {
        gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);
        // TODO: Emit to player to choose battlefield layout
      } catch (error) {
        handleSocketError(socket, "chose-warriors", error as CustomError)
      }
    }
  );

  socket.on("finished-setup", ({ gameId }: FinishedSetupData) => {
    try {
      const game = gameStateManager.getGame(gameId);
      game.numPlayersFinishedSetup++;
  
      if (game.numPlayersFinishedSetup === game.players.length)
        // TODO: Go to choosing who is first and emit to players who is first
        return;
    } catch (error) {
      handleSocketError(socket, "finished-setup", error as CustomError)
    }
  });

  socket.on("leave-game", ({ gameId }: LeaveGameData) => {
    try {
      gameStateManager.getGame(gameId).removePlayer(socket.id);
      socket.leave(gameId)
      socket.emit("leave-game--success")
    } catch (error) {
      handleSocketError(socket, "leave-game", error as CustomError)
    }
  });
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app };