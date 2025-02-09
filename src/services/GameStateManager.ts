import { ConGame } from "../models";
import { ActiveConGame } from "../models/ConGame";
import { CurrentGames, gameId } from "../types";
import { ConflictError } from "./CustomError/BaseError";

class GameStateManager {
    private static instance: GameStateManager;
    private currentGames: CurrentGames = {};
    
    private constructor () {}

    static getInstance() {
        if (!GameStateManager.instance) 
            GameStateManager.instance = new GameStateManager()

        return GameStateManager.instance;
    }

    private isActiveGame(game: ConGame): game is ActiveConGame {
        return game.getHasFinishedSetup()
    }

    getGame(gameId: gameId) {
        return this.currentGames[gameId];
    }

    private setGame(gameId: gameId, game: ConGame) {
        this.currentGames[gameId] = game;
    }

    getActiveGame(gameId: gameId): ActiveConGame {
        const game = this.getGame(gameId);
        if (!this.isActiveGame(game)) {
          throw new Error("Game has not finished setup yet.");
        }
        return game;
    }

    addGame(game: ConGame) {
        if (this.currentGames[game.id] !== undefined) throw new ConflictError(`There is already an existing game with the given ID`)
        this.currentGames[game.id] = game;
        return this.currentGames[game.id]
    }

    deleteGame(gameId: gameId) {
        if (this.currentGames.hasOwnProperty(gameId))
            delete this.currentGames[gameId] 
    }

    beginBattle(game: ConGame) {
        const activeGame = game.finishedSetup();
        this.setGame(game.id, activeGame);
    }

    resetGameStateManager() {
        this.currentGames = {}
    }
}

export const gameStateManager = GameStateManager.getInstance();