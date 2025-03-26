import express from "express"; 
import { createServer } from "http"; 
import { Server } from "socket.io";
import { AllSpaceOptionsSchema, CancelSetupData, CancelSetupEvent, ChoseWarriorsData, ChoseWarriorsEvent, ClearTeamsData, ClearTeamsEvent, CreateGameData, CreateGameEvent, PlayerFinishedSetupData, PlayerFinishedSetupEvent, JoinGameData, JoinGameEvent, JoinTeamData, JoinTeamEvent, LeaveGameData, LeaveGameEvent, SelectSageData, SelectSageEvent, SocketEventMap, StartGameData, StartGameEvent, SwapWarriorsData, SwapWarriorsEvent, ToggleReadyStatusData, ToggleReadyStatusEvent, AllPlayersSetupEvent, AllPlayersSetupData, CurrentGameStateEvent, AllSagesSelectedData, AllSagesSelectedEvent, ActivateDayBreakEvent, ActivateDayBreakData, CurrentGameStateData, GetDayBreakCardsEvent, GetDayBreakCardsData } from "./types";
import { PORT, processEventMiddleware, socketErrorHandler } from "./lib";
import { GameEventEmitter, GameStateManager, GameSaveService, ValidationError, InvalidSpaceError, PlayersNotReadyError } from "./services";
import { IS_PRODUCTION } from "./constants";
import { Player, ConGameService, GameStateService, ConGameModel, GameStateModel } from "./models";

const app = express();
const server = createServer(app);
const gameEventEmitter = GameEventEmitter.getInstance(server);
const gameStateManager = GameStateManager.getInstance();

// Initialize database services
const conGameService = new ConGameService(ConGameModel);
const gameStateService = new GameStateService(GameStateModel);
const gameSaveService = GameSaveService.getInstance(conGameService, gameStateService);

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

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");

// Initialize the GameEventEmitter with the gameplay namespace
gameEventEmitter.initializeIO(gameNamespace);

// Load existing games from database
async function loadExistingGames() {
  try {
    // Find all games
    const games = await conGameService.findAllGames();
    
    // For each game, load its state and add it to the GameStateManager
    for (const game of games) {
      try {
        const gameState = await gameStateService.findGameStateByGameId(game.id);
        gameStateManager.loadGame(game, gameState);
        console.log(`Loaded game ${game.id} from database`);
      } catch (error) {
        console.error(`Failed to load game ${game.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to load existing games:', error);
  }
}

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

  socket.on(CreateGameEvent, socketErrorHandler(socket, CreateGameEvent, async ({ userId, numPlayers }: CreateGameData) => {
    const newGame = gameStateManager.createGame(numPlayers);
    newGame.addPlayer(new Player(userId, socket.id, true)); // First player to join is the host
    socket.join(newGame.id);
    socket.emit(`${CreateGameEvent}--success`);
  }));

  socket.on(JoinGameEvent, socketErrorHandler(socket, JoinGameEvent, async ({ userId, gameId }: JoinGameData) => {
    gameStateManager.verifyJoinGameEvent(gameId);
    gameStateManager.getGame(gameId).addPlayer(new Player(userId, socket.id));
    socket.join(gameId);
    gameStateManager.processJoinGameEvent(gameId);
    socket.emit(`${JoinGameEvent}--success`);
  }));

  socket.on(SelectSageEvent, socketErrorHandler(socket, SelectSageEvent, async ({ gameId, sage }: SelectSageData) => {
    gameStateManager.verifySelectSageEvent(gameId);
    gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    gameEventEmitter.emitSageSelected(socket, gameId, sage);
    gameStateManager.processSelectSageEvent(gameId);
    socket.emit(`${SelectSageEvent}--success`);
  }));

  socket.on(AllSagesSelectedEvent, socketErrorHandler(socket, AllSagesSelectedEvent, async ({ gameId }: AllSagesSelectedData) => {
    gameStateManager.processAllSagesSelectedEvent(gameId);
    gameEventEmitter.emitAllSagesSelected(gameId);
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
  }));

  socket.on(StartGameEvent, socketErrorHandler(socket, StartGameEvent, async ({ gameId }: StartGameData) => {
    const game = gameStateManager.getGame(gameId);

    // All players must be ready
    if (game.numPlayersReady !== game.numPlayersTotal) throw new PlayersNotReadyError(game.numPlayersReady, game.numPlayersTotal)
    gameStateManager.verifyAllPlayersReadyEvent(gameId);

    game.initGame();
    gameStateManager.processAllPlayersReadyEvent(gameId);
    gameEventEmitter.emitPickWarriors(game.players);
  }));

  socket.on(ChoseWarriorsEvent, socketErrorHandler(socket, ChoseWarriorsEvent, async ({ gameId, choices }: ChoseWarriorsData) => {
    gameStateManager.verifyChooseWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.id).chooseWarriors(player, choices);
    gameStateManager.processChooseWarriorsEvent(gameId);
    socket.emit(`${ChoseWarriorsEvent}--success`)
  }));

  socket.on(SwapWarriorsEvent, socketErrorHandler(socket, SwapWarriorsEvent, async ({ gameId }: SwapWarriorsData) => {
    gameStateManager.verifySwapWarriorsEvent(gameId);
    const game = gameStateManager.getGame(gameId);
    const player = game.getPlayer(socket.id);
    game.getPlayerTeam(player.id).swapWarriors(player);
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
  }));

  socket.on(LeaveGameEvent, socketErrorHandler(socket, LeaveGameEvent, async ({ gameId }: LeaveGameData) => {
    gameStateManager.getGame(gameId).removePlayer(socket.id);
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
  server.listen(PORT, async () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
    await loadExistingGames();
  });
}

export { server, io, app };
