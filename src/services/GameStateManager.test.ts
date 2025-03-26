import { GameState } from "../models/GameState/GameState";
import { ConGame } from "../models/ConGame/ConGame";
import { GameStateManager } from "./GameStateManager";
import { gameId } from "../types";
import { GameConflictError } from "./CustomError/GameError";

describe("GameStateManager", () => {
    let gameStateManager: GameStateManager;
    let mockGame: ConGame;

    beforeEach(() => {
        gameStateManager = GameStateManager.getInstance();
        gameStateManager.resetGameStateManager();
        mockGame = new ConGame("game-1" as gameId, 4);
    });

    describe("getInstance", () => {
        test("returns the same instance on multiple calls", () => {
            const instance1 = GameStateManager.getInstance();
            const instance2 = GameStateManager.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe("getGame", () => {
        test("returns the game for a valid game ID", () => {
            gameStateManager.createGame(mockGame.numPlayersTotal);
            const retrievedGame = gameStateManager.getGame("game-1" as gameId);
            expect(retrievedGame).toBe(mockGame);
        });

        test("throws an error for a non-existent game ID", () => {
            expect(() => gameStateManager.getGame("non-existent-game" as gameId)).toThrow(GameConflictError);
        });
    });

    describe("createGame", () => {
        test("creates a new game with the given number of players", () => {
            const newGame = gameStateManager.createGame(4);
            expect(newGame.numPlayersTotal).toBe(4);
        });

        test("throws an error if a game with the ID already exists", () => {
            gameStateManager.createGame(mockGame.numPlayersTotal);
            expect(() => gameStateManager.createGame(mockGame.numPlayersTotal)).toThrow(GameConflictError);
        });
    });

    describe("deleteGame", () => {
        test("deletes an existing game", () => {
            gameStateManager.createGame(mockGame.numPlayersTotal);
            gameStateManager.deleteGame(mockGame.id as gameId);
            expect(() => gameStateManager.getGame(mockGame.id as gameId)).toThrow(GameConflictError);
        });

        test("does not throw an error when deleting a non-existent game", () => {
            expect(() => gameStateManager.deleteGame("non-existent-game" as gameId)).not.toThrow();
        });
    });

    describe("resetGameStateManager", () => {
        test("clears all games", () => {
            gameStateManager.createGame(mockGame.numPlayersTotal);
            gameStateManager.resetGameStateManager();
            expect(() => gameStateManager.getGame(mockGame.id as gameId)).toThrow(GameConflictError);
        });
    });
});
