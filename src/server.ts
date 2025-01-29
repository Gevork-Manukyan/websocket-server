import express from "express"; 
import http from "http"; 
import { Server } from "socket.io";
import { ElementalWarriorCard, gameId } from "./types";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { Sage } from "./types";
import { GameEventEmitter } from "./services";
import { gameStateManager } from "./services/GameStateManager";
import { IS_PRODUCTION } from "./utils/constants";
import { PORT } from "./utils/config";
import { handleSocketError } from "./utils/utilities";
import { HostOnlyActionError } from "./services/CustomError/GameError";

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
  function socketCallback(
    eventName: string,
    fn: (...args: any[]) => Promise<void>
  ) {
    return handleSocketError(socket, eventName, fn);
  }

  // Host only actions middleware
  socket.use(([event, gameId, ...args], next) => {
    const hostOnlyEvents = ["clear-teams", "start-game"];

    if (hostOnlyEvents.includes(event)) {
      const game = gameStateManager.getGame(gameId as gameId)
      const player = game?.getPlayer(socket.id);

      if (!player || !player.isGameHost) {
        return next(new HostOnlyActionError(`perform this action`));
      }
    }

    next()
  })

  socket.on(
    "join-game",
    socketCallback("join-game", async (gameId, numPlayers) => {
      let game = gameStateManager.getGame(gameId);

      // Create game if doesn't exist
      if (!game) {
        game = gameStateManager.addGame(new ConGame(gameId, numPlayers));
        game.addPlayer(new Player(socket.id, true)); // First player to join is the host
      } else {
        game.addPlayer(new Player(socket.id));
      }

      socket.join(gameId);
      socket.emit("join-game--success");
    })
  );

  socket.on(
    "select-sage",
    socketCallback("select-sage", async (gameId: ConGame["id"], sage: Sage) => {
      gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
      socket.emit("select-sage--success");
    })
  );

  socket.on(
    "toggle-ready-status",
    socketCallback("toggle-ready--status", async (gameId: ConGame["id"]) => {
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
    })
  );

  socket.on(
    "join-team",
    socketCallback("join-team", async (gameId: ConGame["id"], team: 1 | 2) => {
      gameStateManager.getGame(gameId).joinTeam(socket.id, team);
      socket.emit("join-team--success")
    })
  );

  socket.on("clear-teams", socketCallback("clear-teams", async (gameId: ConGame["id"]) => {
    // TODO: remove all players from all teams. Only the host can do this

  }))

  socket.on(
    "start-game",
    socketCallback("start-game", async (gameId: ConGame["id"]) => {
      const game = gameStateManager.getGame(gameId);
      const playerId = socket.id;
      
      game.startGame(playerId);
      gameEventEmitter.emitPickWarriors(game.players);

      // TODO: coin flip for who is first. Players decide play order if 4 players

      game.setStarted(true);
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
    const game = gameStateManager.getGame(gameId);
    game.numPlayersFinishedSetup++;

    if (game.numPlayersFinishedSetup === game.players.length)
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
