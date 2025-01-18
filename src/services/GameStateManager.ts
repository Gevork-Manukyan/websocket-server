import { ConGame } from "../models";
import { CurrentGames, gameId } from "../types";

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
        return this.currentGames[gameId];
    }

    addGame(gameId: gameId, game: ConGame) {
        this.currentGames[gameId] = game;
        return this.currentGames[gameId]
    }

    deleteGame(gameId: gameId) {
        if (this.currentGames.hasOwnProperty(gameId))
            delete this.currentGames[gameId] 
    }

    resetGameStateManager() {
        this.currentGames = {}
    }
}

export const gameStateManager = GameStateManager.getInstance();