"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateManager = void 0;
class GameStateManager {
    constructor() {
        this.currentGames = {};
    }
    static getInstance() {
        if (!GameStateManager.instance)
            GameStateManager.instance = new GameStateManager();
        return GameStateManager.instance;
    }
    getGame(gameId) {
        return this.currentGames[gameId];
    }
    addGame(gameId, game) {
        this.currentGames[gameId] = game;
        return this.currentGames[gameId];
    }
    deleteGame(gameId) {
        if (this.currentGames.hasOwnProperty(gameId))
            delete this.currentGames[gameId];
    }
    resetGameStateManager() {
        this.currentGames = {};
    }
}
exports.gameStateManager = GameStateManager.getInstance();
