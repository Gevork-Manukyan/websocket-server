import { ConGame } from "../models";
import { GameState } from "../models/GameState";
import { ActiveConGame } from "../models/ConGame";
import { gameId } from "../types";
import { ConflictError } from "./CustomError/BaseError";
import { GameConflictError } from "./CustomError/GameError";

type CurrentGames = {
    [key: gameId]: {
        game: ConGame;
        state: GameState;
    }
};

class GameStateManager {
    private static instance: GameStateManager;
    private currentGames: CurrentGames = {};
    
    private constructor () {}

    static getInstance() {
        if (!GameStateManager.instance) 
            GameStateManager.instance = new GameStateManager()

        return GameStateManager.instance;
    }

    getGame(gameId: gameId) {
        const gameState = this.currentGames[gameId];
        if (!gameState) throw new GameConflictError(gameId);
        return gameState.game;
    }

    private setGame(gameId: gameId, game: ConGame) {
        this.currentGames[gameId].game = game;
    }

    private getGameState(gameId: gameId) {
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
        return game.getHasFinishedSetup()
    }

    createGame(gameId: gameId, numPlayers: ConGame['numPlayersTotal']) {
        if (this.currentGames[gameId] !== undefined) throw new ConflictError(`There is already an existing game with the given ID`)
        this.currentGames[gameId] = {
            game: new ConGame(gameId, numPlayers),
            state: new GameState(gameId)
        };

        return this.currentGames[gameId].game;
    }

    deleteGame(gameId: gameId) {
        if (this.currentGames.hasOwnProperty(gameId))
            delete this.currentGames[gameId] 
    }

    beginBattle(game: ConGame): ActiveConGame {
        const activeGame = game.finishedSetup();
        this.setGame(game.id, activeGame);
        return activeGame;
    }

    resetGameStateManager() {
        this.currentGames = {};
    }


    /* -------- PROCESSING GAME STATE -------- */

    // Player Joined
    verifyJoinGameEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('player-joined');
    }

    processJoinGameEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('player-joined');
    }

    // Player Selected Sage
    verifySelectSageEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('player-selected-sage');
    }

    processSelectSageEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('player-selected-sage');
    }

    // All Sages Selected
    verifyAllSagesSelectedEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('all-sages-selected');
    }

    processAllSagesSelectedEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('all-sages-selected');
    }

    // Player Joined Team
    verifyJoinTeamEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('player-joined-team');
    }

    processJoinTeamEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('player-joined-team');
    }

    // Clear Teams
    verifyClearTeamsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('clear-teams');
    }

    processClearTeamsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('clear-teams');
    }

    // Toggle Ready Status
    verifyToggleReadyStatusEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('toggle-ready-status');
    }

    processToggleReadyStatusEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('toggle-ready-status');
    }

    // All Players Ready
    verifyAllPlayersReadyEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('all-players-ready');
    }

    processAllPlayersReadyEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('all-players-ready');
    }

    // Choose Warriors
    verifyChooseWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('choose-warriors');
    }

    processChooseWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('choose-warriors');
    }

    // Swap Warriors
    verifySwapWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('swap-warriors');
    }

    processSwapWarriorsEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('swap-warriors');
    }

    // Finished Setup
    verifyFinishedSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('player-finished-setup');
    }

    processFinishedSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('player-finished-setup');
    }

    // Cancel Setup
    verifyCancelSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('cancel-setup');
    }

    processCancelSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('cancel-setup');
    }

    // All Players Setup
    verifyAllPlayersSetupEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('all-players-setup-complete');
    }

    processAllPlayersSetupEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('all-players-setup-complete');
    }

    // Activate Day Break
    verifyActivateDayBreakEvent(gameId: gameId) {
        this.getGameState(gameId).verifyEvent('day-break-card');
    }

    processActivateDayBreakEvent(gameId: gameId) {
        this.getGameState(gameId).processEvent('day-break-card');
    }
}

export const gameStateManager = GameStateManager.getInstance();