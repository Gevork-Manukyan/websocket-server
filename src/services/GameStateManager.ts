import { ConGame } from "../models";
import { GameState } from "../models/GameState";
import { gameId } from "../types";
import { ConflictError } from "./CustomError/BaseError";

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
        return this.currentGames[gameId].game;
    }

    getGameState(gameId: gameId) {
        return this.currentGames[gameId].state;
    }

    addGame(game: ConGame) {
        if (this.currentGames[game.id] !== undefined) throw new ConflictError(`There is already an existing game with the given ID`)
        this.currentGames[game.id].game = game;
        this.currentGames[game.id].state = new GameState();
        return this.currentGames[game.id].game;
    }

    deleteGame(gameId: gameId) {
        if (this.currentGames.hasOwnProperty(gameId))
            delete this.currentGames[gameId] 
    }

    resetGameStateManager() {
        this.currentGames = {};
    }
}

export const gameStateManager = GameStateManager.getInstance();