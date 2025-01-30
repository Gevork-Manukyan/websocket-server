import { ConGame } from "../models";
import { gameId } from "../types";
import { ConflictError } from "./CustomError/BaseError";
import { gameStateManager } from "./GameStateManager";


describe("GameStateManager", () => {
  let mockGame: ConGame;

  beforeEach(() => {
    // Reset the singleton's state before each test
    gameStateManager.resetGameStateManager();

    // Mock a ConGame instance
    mockGame = new ConGame("game-1" as gameId, 4);
  });

  describe("getInstance", () => {
    test("returns the same instance for multiple calls", () => {
      const instance1 = gameStateManager;
      const instance2 = gameStateManager;
      expect(instance1).toBe(instance2);
    });
  });

  describe("addGame", () => {
    test("adds a new game to the current games", () => {
      gameStateManager.addGame(mockGame);

      const retrievedGame = gameStateManager.getGame("game-1" as gameId);
      expect(retrievedGame).toBe(mockGame);
    });

    test("returns the added game after adding test", () => {
      const addedGame = gameStateManager.addGame(mockGame);
      expect(addedGame).toBe(mockGame);
    });

    test("throws an error if a game with the ID already exists", () => {
      gameStateManager.addGame(mockGame)
      expect(() => gameStateManager.addGame(mockGame)).toThrow(ConflictError)
    })
  });

  describe("getGame", () => {
    test("retrieves an existing game by its ID", () => {
      gameStateManager.addGame(mockGame);
      const retrievedGame = gameStateManager.getGame("game-1" as gameId);
      expect(retrievedGame).toBe(mockGame);
    });

    test("returns undefined for a non-existent game ID", () => {
      const retrievedGame = gameStateManager.getGame("non-existent-game" as gameId);
      expect(retrievedGame).toBeUndefined();
    });
  });

  describe("deleteGame", () => {
    test("removes an existing game by its ID", () => {
      gameStateManager.addGame(mockGame);
      gameStateManager.deleteGame("game-1" as gameId);

      const retrievedGame = gameStateManager.getGame("game-1" as gameId);
      expect(retrievedGame).toBeUndefined();
    });

    test("does not throw an error when deleting a non-existent game", () => {
      expect(() => gameStateManager.deleteGame("non-existent-game" as gameId)).not.toThrow();
    });
  });

  describe("resetGameStateManager", () => {
    test("resets the current games to an empty object", () => {
      gameStateManager.addGame(mockGame);
      gameStateManager.resetGameStateManager();

      const retrievedGame = gameStateManager.getGame("game-1" as gameId);
      expect(retrievedGame).toBeUndefined();
      expect(Object.keys((gameStateManager as any).currentGames)).toHaveLength(0);
    });
  });
});
