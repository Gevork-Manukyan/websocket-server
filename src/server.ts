import express from "express"; 
import http from "http"; 
import { Server } from "socket.io";
import { gameId } from "./types";
import { ConGame } from "./models/ConGame";
import { Player } from "./models/Player";
import { GameEventEmitter } from "./services";
import { gameStateManager } from "./services/GameStateManager";
import { IS_PRODUCTION } from "./utils/constants";
import { PORT } from "./utils/config";
import { handleSocketError } from "./utils/utilities";
import { HostOnlyActionError } from "./services/CustomError/GameError";
import { ValidationError } from "./services/CustomError/BaseError";
import { ChoseWarriorsData, ClearTeamsData, CreateGameData, EventSchemas, FinishedSetupData, JoinGameData, JoinTeamData, LeaveGameData, SelectSageData, SocketEventMap, StartGameData, ToggleReadyStatusData } from "./types/server-types";

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

  // Host only actions middleware
  socket.use(([event, gameId, ..._], next) => {
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
    "create-game", 
    socketCallback("create-game", async({ gameId, numPlayers }: CreateGameData) => {
      const newGame = gameStateManager.addGame(new ConGame(gameId, numPlayers))
      newGame.addPlayer(new Player(socket.id, true)) // First player to join is the host
      socket.join(gameId)
      socket.emit("create-game--success")
    })
  )

  socket.on(
    "join-game",
    socketCallback("join-game", async ({ gameId }: JoinGameData) => {
      gameStateManager.getGame(gameId).addPlayer(new Player(socket.id));
      socket.join(gameId);
      socket.emit("join-game--success");
    })
  );
  

  socket.on(
    "select-sage",
    socketCallback("select-sage", async ({ gameId, sage }: SelectSageData) => {
      gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
      socket.emit("select-sage--success");
    })
  );

  socket.on(
    "toggle-ready-status",
    socketCallback("toggle-ready-status", async ({ gameId }: ToggleReadyStatusData) => {
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
    socketCallback("join-team", async ({ gameId, team }: JoinTeamData) => {
      gameStateManager.getGame(gameId).joinTeam(socket.id, team);
      socket.emit("join-team--success")
    })
  );

  socket.on("clear-teams", socketCallback("clear-teams", async ({ gameId }: ClearTeamsData) => {
    gameStateManager.getGame(gameId).clearTeams()
    socket.emit("clear-teams--success")
  }))

  socket.on(
    "start-game",
    socketCallback("start-game", async ({ gameId }: StartGameData) => {
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
    socketCallback("chose-warriors", async ({ gameId, choices }: ChoseWarriorsData) => {
        gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);

        // TODO: Emit to player to choose battlefield layout
      }
    )
  );

  socket.on("finished-setup", socketCallback("finished-setup", async ({ gameId }: FinishedSetupData) => {
    const game = gameStateManager.getGame(gameId);
    game.numPlayersFinishedSetup++;

    if (game.numPlayersFinishedSetup === game.players.length)
      // TODO: Go to choosing who is first and emit to players who is first
      return;
  }));

  socket.on("leave-game", socketCallback("leave-game", async ({ gameId }: LeaveGameData) => {
    gameStateManager.getGame(gameId).removePlayer(socket.id);
    socket.leave(gameId)
    socket.emit("leave-game--success")
  }));

  /**
   * Middleware that catches any error that may occur during the event, and checks arguments for correctness
   * @param eventName 
   * @param fn 
   * @returns 
   */
  function socketCallback<T extends keyof SocketEventMap>(
    eventName: T,
    fn: (data: SocketEventMap[T]) => Promise<void>
  ) {
    return async (rawData: unknown) => {
      try {
        const result = EventSchemas[eventName].safeParse(rawData);
  
        if (!result.success) {
          throw new ValidationError(`Invalid data for event: ${eventName}`, `${rawData}`);
        }
  
        const data = result.data as SocketEventMap[T];

        await fn(data);
      } catch (error) {
        handleSocketError(socket, eventName, async () => {
          throw error;
        })();
      }
    };
  }  
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
  });
}

export { server, io, app };