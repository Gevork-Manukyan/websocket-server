import { createServer } from "http"; 
import { Server } from "socket.io";
import mongoose from "mongoose";
import { AllSpaceOptionsSchema, CancelSetupData, CancelSetupEvent, ChoseWarriorsData, ChoseWarriorsEvent, ClearTeamsData, ClearTeamsEvent, CreateGameData, CreateGameEvent, PlayerFinishedSetupData, PlayerFinishedSetupEvent, JoinGameData, JoinGameEvent, JoinTeamData, JoinTeamEvent, LeaveGameData, LeaveGameEvent, SelectSageData, SelectSageEvent, SocketEventMap, StartGameData, StartGameEvent, SwapWarriorsData, SwapWarriorsEvent, ToggleReadyStatusData, ToggleReadyStatusEvent, AllPlayersSetupEvent, AllPlayersSetupData, CurrentGameStateEvent, AllSagesSelectedData, AllSagesSelectedEvent, ActivateDayBreakEvent, ActivateDayBreakData, CurrentGameStateData, GetDayBreakCardsEvent, GetDayBreakCardsData, DebugData, DebugEvent, ExitGameData, ExitGameEvent, RejoinGameData, RejoinGameEvent } from "./types";
import { PORT, processEventMiddleware, socketErrorHandler } from "./lib";
import { GameEventEmitter, GameStateManager, ValidationError, InvalidSpaceError, PlayersNotReadyError } from "./services";
import { Player } from "./models";
import { IS_PRODUCTION } from "./constants";
import { gameDatabaseService } from "./services";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize services
const gameEventEmitter = GameEventEmitter.getInstance(io);
const gameStateManager = GameStateManager.getInstance();

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");

gameNamespace.on("connection", (socket) => {

  /* -------- MIDDLEWARE -------- */
  socket.use(([event, rawData], next) => {
    processEventMiddleware(socket, event as keyof SocketEventMap, rawData, next)
  });

  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });

  /* -------- GAME SETUP -------- */
  // TODO: some events should emit to all players that something happened

  // TODO: FOR DEBUGING
  socket.on(DebugEvent, socketErrorHandler(socket, DebugEvent, async ({ gameId }: DebugData) => {
    const game = gameStateManager.getGame(gameId);
    socket.emit(DebugEvent, game);
  }));

  socket.on(CreateGameEvent, socketErrorHandler(socket, CreateGameEvent, async ({ userId, numPlayers }: CreateGameData) => {      
      const { game } = await gameStateManager.createGame(numPlayers);
      gameStateManager.addPlayerToGame(userId, socket.id, game.id, true);
      socket.join(game.id);
      socket.emit(`${CreateGameEvent}--success`, game.id);
  }));

  socket.on(JoinGameEvent, socketErrorHandler(socket, JoinGameEvent, async ({ userId, gameId }: JoinGameData) => {
    gameStateManager.verifyJoinGameEvent(gameId);
    await gameStateManager.addPlayerToGame(userId, socket.id, gameId, false);
    gameStateManager.processJoinGameEvent(gameId);
    socket.join(gameId);
    socket.emit(`${JoinGameEvent}--success`, gameId);
  }));

  socket.on(SelectSageEvent, socketErrorHandler(socket, SelectSageEvent, async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.verifySelectSageEvent(gameId);
    gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    gameEventEmitter.emitSageSelected(socket, gameId, sage);
    gameStateManager.processSelectSageEvent(gameId);
    socket.emit(`${SelectSageEvent}--success`);
  }));

  socket.on(AllSagesSelectedEvent, socketErrorHandler(socket, AllSagesSelectedEvent, async ({ gameId }: AllSagesSelectedData) => {
    gameStateManager.verifyAllSagesSelectedEvent(gameId);
    gameStateManager.getGame(gameId).validateAllPlayersSeclectedSage();
    gameStateManager.processAllSagesSelectedEvent(gameId);
    gameEventEmitter.emitAllSagesSelected(gameId);
    socket.emit(`${AllSagesSelectedEvent}--success`);
  }));

  socket.on(JoinTeamEvent, socketErrorHandler(socket, JoinTeamEvent, async ({ gameId, team }: JoinTeamData) => {
    gameStateManager.verifyJoinTeamEvent(gameId);
    gameStateManager.getGame(gameId).joinTeam(socket.id, team);
    gameEventEmitter.emitTeamJoined(gameId, team);
    gameStateManager.processJoinTeamEvent(gameId);
    socket.emit(`${JoinTeamEvent}--success`);
  }));

  socket.on(ClearTeamsEvent, socketErrorHandler(socket, ClearTeamsEvent, async ({ gameId }: ClearTeamsData) => {
    gameStateManager.verifyClearTeamsEvent(gameId);
    gameStateManager.getGame(gameId).clearTeams();
    gameStateManager.processClearTeamsEvent(gameId);
    socket.emit(`${ClearTeamsEvent}--success`);
  }));

  socket.on(ToggleReadyStatusEvent, socketErrorHandler(socket, ToggleReadyStatusEvent, async ({ gameId }: ToggleReadyStatusData) => {
    gameStateManager.verifyToggleReadyStatusEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const currPlayer = game.getPlayer(socket.id);
    if (!currPlayer.getSage()) throw new ValidationError("Cannot toggle ready. The sage has not been set.", "sage");
    currPlayer.toggleReady();
    
    if (currPlayer.getIsReady()) {
      game.incrementPlayersReady();
      socket.emit("ready-status--ready");
    } else {
      game.decrementPlayersReady();
      socket.emit("ready-status--not-ready");
    }
    gameStateManager.processToggleReadyStatusEvent(gameId);
    socket.emit(`${ToggleReadyStatusEvent}--success`);
  }));

  socket.on(StartGameEvent, socketErrorHandler(socket, StartGameEvent, async ({ gameId }: StartGameData) => {
    gameStateManager.verifyAllPlayersReadyEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    game.initGame();
    gameStateManager.processAllPlayersReadyEvent(gameId);
    gameEventEmitter.emitPickWarriors(game.players);
    socket.emit(`${StartGameEvent}--success`);
  }));

  socket.on(ChoseWarriorsEvent, socketErrorHandler(socket, ChoseWarriorsEvent, async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.verifyChooseWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).chooseWarriors(player, choices);
    gameStateManager.processChooseWarriorsEvent(gameId);
    socket.emit(`${ChoseWarriorsEvent}--success`)
  }));

  socket.on(SwapWarriorsEvent, socketErrorHandler(socket, SwapWarriorsEvent, async ({ gameId }: SwapWarriorsData) => {
    gameStateManager.verifySwapWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.userId).swapWarriors(player);
    gameStateManager.processSwapWarriorsEvent(gameId);
    socket.emit(`${SwapWarriorsEvent}--success`)
  }));

  socket.on(PlayerFinishedSetupEvent, socketErrorHandler(socket, PlayerFinishedSetupEvent, async ({ gameId }: PlayerFinishedSetupData) => {
    gameStateManager.verifyFinishedSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    game.getPlayer(socket.id).finishPlayerSetup();
    game.incrementPlayersFinishedSetup();
    gameStateManager.processFinishedSetupEvent(gameId);
    socket.emit(`${PlayerFinishedSetupEvent}--success`)
  }));

  socket.on(CancelSetupEvent, socketErrorHandler(socket, CancelSetupEvent, async ({ gameId }: CancelSetupData) => {
    gameStateManager.verifyCancelSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId)
    game.getPlayer(socket.id).cancelPlayerSetup();
    game.decrementPlayersFinishedSetup();
    gameStateManager.processCancelSetupEvent(gameId);
    socket.emit(`${CancelSetupEvent}--success`)
  }))

  socket.on(AllPlayersSetupEvent, socketErrorHandler(socket, AllPlayersSetupEvent, async ({ gameId }: AllPlayersSetupData) => {
    gameStateManager.verifyAllPlayersSetupEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    if (game.numPlayersFinishedSetup !== game.players.length) throw new ValidationError("All players have not finished setup", "players");
    const activeGame = gameStateManager.beginBattle(game);
    gameStateManager.processAllPlayersSetupEvent(gameId);
    gameEventEmitter.emitStartTurn(activeGame.getActiveTeam(), activeGame.getWaitingTeam());
    socket.emit(`${AllPlayersSetupEvent}--success`);
  }));

  /**
   * Save and exit the game for everyone
   */
  socket.on(ExitGameEvent, socketErrorHandler(socket, ExitGameEvent, async ({ gameId }: ExitGameData) => {
    socket.leave(gameId);
    socket.emit(`${ExitGameEvent}--success`);
  }));

  /**
   * Rejoin the game after disconnecting or exiting
   */
  socket.on(RejoinGameEvent, socketErrorHandler(socket, RejoinGameEvent, async ({ gameId, userId }: RejoinGameData) => {
    await gameStateManager.playerRejoinedGame(gameId, userId, socket.id);
    socket.join(gameId);
    socket.emit(`${RejoinGameEvent}--success`);
  }));

  /**
   * Leave the game
   */
  // TODO: db is not updated when a player leaves the game
  socket.on(LeaveGameEvent, socketErrorHandler(socket, LeaveGameEvent, async ({ gameId }: LeaveGameData) => {
    // TODO: what if host leaves? How to handle if someone leaves the game midway through?
    // If host leaves before game starts, set new host
    await gameStateManager.removePlayerFromGame(gameId, socket.id);
    socket.leave(gameId);
    socket.emit(`${LeaveGameEvent}--success`);
  }));

  /* -------- GAME BATTLING -------- */

  socket.on(CurrentGameStateEvent, socketErrorHandler(socket, CurrentGameStateEvent, async ({ gameId }: CurrentGameStateData) => {
    const game = gameStateManager.getActiveGame(gameId);
    const gameState = game.getGameState(socket.id);
    socket.emit(CurrentGameStateEvent, gameState);
  }));

  socket.on(GetDayBreakCardsEvent, socketErrorHandler(socket, GetDayBreakCardsEvent, async ({ gameId }: GetDayBreakCardsData) => {
    gameStateManager.verifyGetDayBreakCardsEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);
    const dayBreakCards = game.getDayBreakCards(socket.id);
    gameStateManager.processGetDayBreakCardsEvent(gameId);
    gameEventEmitter.emitDayBreakCards(game.getActiveTeam(), dayBreakCards);
  }));

  socket.on(ActivateDayBreakEvent, socketErrorHandler(socket, ActivateDayBreakEvent, async ({ gameId, spaceOption }: ActivateDayBreakData) => {
    gameStateManager.verifyActivateDayBreakEvent(gameId);
    const game = gameStateManager.getActiveGame(gameId);

    if (game.players.length === 2 && AllSpaceOptionsSchema.safeParse(spaceOption).error) {
      throw new InvalidSpaceError(spaceOption);
    }

    game.activateDayBreak(socket.id, spaceOption);
    gameStateManager.processActivateDayBreakEvent(gameId);
  }));

  /*
    PHASE 1
      Daybreak Effects

    PHASE 2
      Draw Card from deck
      Swap Cards
      Summon Card
      Play Attack/Spell
      Level Up
      Sage Ability
    
    PHASE 3
      Buy Card ✅
        Item Shop ✅
        Creature Shop ✅
      Sell Card
      Summon Bought Card
      Refresh Shop

    PHASE 4
      Discard any number of cards
      Draw Cards until 5

    MISC
      Both players confirm action (4 players)
      Toggle hand view (4 players - Yours/Teammate)
      Instant Cards
      Triggered Effects
      Reshuffle Discard Pile
      Gain/Lose Gold
      Gain/Lose Shield
      Gain/Lose Boost
      Take Damage
  */
});

// Start the server if not in test mode
if (IS_PRODUCTION) {
  // Connect to MongoDB first
  mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/command_of_nature")
    .then(() => {
      console.debug('Connected to MongoDB');
      // Start the server after successful database connection
      server.listen(PORT, async () => {
        console.debug(`WebSocket server running on http://localhost:${PORT}`);
        await gameStateManager.loadExistingGames();
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}

export { server, io };
