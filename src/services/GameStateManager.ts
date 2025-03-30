import { ConGame, GameState, ActiveConGame } from "../models";
import { gameId, GameStateInfo, TransitionEvent } from "../types";
import { GameConflictError } from "./CustomError/GameError";
import { gameDatabaseService } from "./GameDatabaseService";

export class GameStateManager {
    private static instance: GameStateManager;
    private currentGames: {
        [key: gameId]: GameStateInfo;
    } = {};

    private constructor() {}

    static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    /**
     * Creates a new game/state and saves it to the database
     * @param numPlayersTotal - The number of players in the game
     * @returns The newly created/saved game and game state
     */
    async createGame(numPlayersTotal: ConGame['numPlayersTotal']): Promise<GameStateInfo> {
        const { game, state } = await gameDatabaseService.saveNewGame(numPlayersTotal);
        this.addGameAndState(game.id, game, state);
        return { game, state };
    }

    /**
     * Loads all existing games from the database into the GameStateManager
     */
    async loadExistingGames(): Promise<void> {
        try {
            // Find all games
            const games = await gameDatabaseService.findAllGames();
            
            // For each game, load its state and add it to the GameStateManager
            for (const game of games) {
                try {
                    const gameState = await gameDatabaseService.findGameStateByGameId(game.id);
                    this.addGameAndState(game.id, game, gameState);
                    console.debug(`Loaded game ${game.id} from database`);
                } catch (error) {
                    console.error(`Failed to load game ${game.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Failed to load existing games:', error);
        }
    }

    /**
     * Adds a game and game state to the current games
     * @param gameId - The id of the game to add
     * @param game - The game to add
     * @param gameState - The game state to add
     */
    addGameAndState(gameId: gameId, game: ConGame, gameState: GameState): void {
        this.currentGames[gameId] = {
            game: game,
            state: gameState
        };
    }

    /**
     * Gets a game from the current games
     * @param gameId - The id of the game to get
     * @returns The game
     */
    getGame(gameId: gameId): ConGame {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        return gameState.game;
    }

    /**
     * Sets a game in the current games
     * @param gameId - The id of the game to set
     * @param game - The game to set
     */
    setGame(gameId: gameId, game: ConGame): void {
        this.currentGames[gameId].game = game;
    }

    /**
     * Gets a game state from the current games
     * @param gameId - The id of the game to get
     * @returns The game state
     */
    getGameState(gameId: gameId): GameState {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        if (!gameState.state) throw new GameConflictError(gameId, 'Game state not loaded');
        return gameState.state;
    }

    /**
     * Sets a game state in the current games
     * @param gameId - The id of the game to set
     * @param gameState - The game state to set
     */
    setGameState(gameId: gameId, gameState: GameState): void {
        this.currentGames[gameId].state = gameState;
    }

    /**
     * Gets an active game from the current games
     * @param gameId - The id of the game to get
     * @returns The active game
     */
    getActiveGame(gameId: gameId): ActiveConGame {
        const game = this.getGame(gameId);
        if (!this.isActiveGame(game)) {
            throw new Error("Game has not finished setup yet.");
        }
        return game;
    }

    /**
     * Checks if a game is an active game
     * @param game - The game to check
     * @returns True if the game is an active game, false otherwise
     */
    private isActiveGame(game: ConGame): game is ActiveConGame {
        return game.getHasFinishedSetup();
    }

    /**
     * Gets the current games
     * @returns The current games
     */
    getCurrentGames(): { [key: gameId]: GameStateInfo } {
        return this.currentGames;
    }

    /**
     * Deletes a game from the current games
     * @param gameId - The id of the game to delete
     */
    deleteGame(gameId: gameId): void {
        if (this.currentGames.hasOwnProperty(gameId)) {
            delete this.currentGames[gameId];
        }
    }

    /**
     * Begins a battle
     * @param game - The game to begin
     * @returns The active game
     */
    beginBattle(game: ConGame): ActiveConGame {
        const activeGame = game.finishedSetup();
        this.setGame(game.id, activeGame);
        return activeGame;
    }

    /**
     * Resets the game state manager
     */
    resetGameStateManager(): void {
        this.currentGames = {};
    }

    /* -------- PROCESSING GAME STATE -------- */

    // Player Joined
    verifyJoinGameEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_JOINED);
    }

    processJoinGameEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.PLAYER_JOINED);
    }

    // Player Selected Sage
    verifySelectSageEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_SELECTED_SAGE);
    }

    processSelectSageEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.PLAYER_SELECTED_SAGE);
    }

    // All Sages Selected
    verifyAllSagesSelectedEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_SAGES_SELECTED);
    }

    processAllSagesSelectedEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.ALL_SAGES_SELECTED);
    }

    // Player Joined Team
    verifyJoinTeamEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_JOINED_TEAM);
    }

    processJoinTeamEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.PLAYER_JOINED_TEAM);
    }

    // Clear Teams
    verifyClearTeamsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CLEAR_TEAMS);
    }

    processClearTeamsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.CLEAR_TEAMS);
    }

    // Toggle Ready Status
    verifyToggleReadyStatusEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.TOGGLE_READY_STATUS);
    }

    processToggleReadyStatusEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.TOGGLE_READY_STATUS);
    }

    // All Players Ready
    verifyAllPlayersReadyEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_PLAYERS_READY);
    }

    processAllPlayersReadyEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.ALL_PLAYERS_READY);
    }

    // Choose Warriors
    verifyChooseWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CHOOSE_WARRIORS);
    }

    processChooseWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.CHOOSE_WARRIORS);
    }

    // Swap Warriors
    verifySwapWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.SWAP_WARRIORS);
    }

    processSwapWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.SWAP_WARRIORS);
    }

    // Finished Setup
    verifyFinishedSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.PLAYER_FINISHED_SETUP);
    }

    processFinishedSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.PLAYER_FINISHED_SETUP);
    }

    // Cancel Setup
    verifyCancelSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.CANCEL_SETUP);
    }

    processCancelSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.CANCEL_SETUP);
    }

    // All Players Setup
    verifyAllPlayersSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE);
    }

    processAllPlayersSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE);
    }

    // Get Day Break Cards
    verifyGetDayBreakCardsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.GET_DAY_BREAK_CARDS);
    }

    processGetDayBreakCardsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.GET_DAY_BREAK_CARDS);
    }

    // Activate Day Break
    verifyActivateDayBreakEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent(TransitionEvent.DAY_BREAK_CARD);
    }

    processActivateDayBreakEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent(TransitionEvent.DAY_BREAK_CARD);
    }

    // Add method to get all games for testing
    getAllGames(): { [key: gameId]: GameStateInfo } {
        return this.currentGames;
    }

    // Add method to clear games for testing
    clearGames(): void {
        this.currentGames = {};
    }
}