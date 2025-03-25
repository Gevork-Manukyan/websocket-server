import { ConGame, GameState, ActiveConGame } from "../models";
import { gameId, TransitionEvent } from "../types";
import { GameConflictError } from "./CustomError/GameError";

type GameStateInfo = {
    game: ConGame;
    state: GameState;
}

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

    getGame(gameId: gameId): ConGame {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        return gameState.game;
    }

    private setGame(gameId: gameId, game: ConGame): void {
        this.currentGames[gameId].game = game;
    }

    getGameState(gameId: gameId): GameState {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        return gameState.state;
    }

    getActiveGame(gameId: gameId): ActiveConGame {
        const game = this.getGame(gameId);
        if (!this.isActiveGame(game)) {
            throw new Error("Game has not finished setup yet.");
        }
        return game;
    }

    private isActiveGame(game: ConGame): game is ActiveConGame {
        return game.getHasFinishedSetup();
    }

    // TODO: call db function to create gameId
    createGame(numPlayers: ConGame['numPlayersTotal']): ConGame {
        const gameId = `game-${Object.keys(this.currentGames).length + 1}` as gameId;
        const game = new ConGame(gameId, numPlayers);
        this.currentGames[gameId] = {
            game,
            state: new GameState(gameId)
        };
        return game;
    }

    getCurrentGames(): { [key: gameId]: GameStateInfo } {
        return this.currentGames;
    }

    deleteGame(gameId: gameId): void {
        if (this.currentGames.hasOwnProperty(gameId)) {
            delete this.currentGames[gameId];
        }
    }

    beginBattle(game: ConGame): ActiveConGame {
        const activeGame = game.finishedSetup();
        this.setGame(game.id, activeGame);
        return activeGame;
    }

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
}

// Export a singleton instance
export const gameStateManager = GameStateManager.getInstance();