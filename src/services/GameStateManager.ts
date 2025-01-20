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

    addGame(game: ConGame) {
        this.currentGames[game.id] = game;
        return this.currentGames[game.id]
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