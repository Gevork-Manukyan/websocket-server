import { GameSaveService } from './GameSaveService';
import { ConGameService } from '../models/ConGame/con-game.service';
import { GameStateService } from '../models/GameState/game-state.service';
import { ConGame } from '../models/ConGame/ConGame';
import { GameState } from '../models/GameState/GameState';

// Mock the services
jest.mock('../models/ConGame/con-game.service');
jest.mock('../models/GameState/game-state.service');

describe('GameSaveService', () => {
    let gameSaveService: GameSaveService;
    let conGameService: jest.Mocked<ConGameService>;
    let gameStateService: jest.Mocked<GameStateService>;
    let mockGame: ConGame;
    let mockGameState: GameState;
    const testGameId = 'test-game-id';
    const numPlayers = 2;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Create mock instances
        conGameService = new ConGameService({} as any) as jest.Mocked<ConGameService>;
        gameStateService = new GameStateService({} as any) as jest.Mocked<GameStateService>;
        
        // Create the service with mocked dependencies
        gameSaveService = GameSaveService.getInstance(conGameService, gameStateService);

        mockGame = new ConGame(numPlayers);
        mockGame.setId(testGameId);
        mockGameState = new GameState(testGameId);
    });

    describe('saveGameState', () => {
        it('should save both game and game state', async () => {
            const mockGame = new ConGame(numPlayers);
            mockGame.setId(testGameId);
            const mockGameState = new GameState(testGameId);

            // Mock the update methods
            conGameService.updateGameState.mockResolvedValue(mockGame);
            gameStateService.updateGameState.mockResolvedValue(mockGameState);

            await gameSaveService.saveGameState(mockGame, mockGameState);

            // Verify both services were called
            expect(conGameService.updateGameState).toHaveBeenCalledWith(testGameId, mockGame);
            expect(gameStateService.updateGameState).toHaveBeenCalledWith(testGameId, mockGameState);
        });

        it('should handle errors when saving fails', async () => {
            const mockGame = new ConGame(numPlayers);
            mockGame.setId(testGameId);
            const mockGameState = new GameState(testGameId);
            const mockError = new Error('Save failed');

            // Mock one of the services to fail
            conGameService.updateGameState.mockRejectedValue(mockError);
            gameStateService.updateGameState.mockResolvedValue(mockGameState);

            // The error should be caught and logged
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await gameSaveService.saveGameState(mockGame, mockGameState);
            consoleSpy.mockRestore();

            expect(consoleSpy).toHaveBeenCalledWith('Failed to save game state:', mockError);
        });
    });
}); 