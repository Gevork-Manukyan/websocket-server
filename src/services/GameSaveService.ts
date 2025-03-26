import { ConGameService, ConGame } from '../models/ConGame';
import { GameStateService, GameState } from '../models/GameState';

export class GameSaveService {
    private static instance: GameSaveService;
    private conGameService: ConGameService;
    private gameStateService: GameStateService;

    private constructor(conGameService: ConGameService, gameStateService: GameStateService) {
        this.conGameService = conGameService;
        this.gameStateService = gameStateService;
    }

    static getInstance(conGameService: ConGameService, gameStateService: GameStateService): GameSaveService {
        if (!GameSaveService.instance) {
            GameSaveService.instance = new GameSaveService(conGameService, gameStateService);
        }
        return GameSaveService.instance;
    }

    /**
     * Saves the game state
     * @param game - The game to save
     * @param gameState - The game state to save
     */
    async saveGameState(game: ConGame, gameState: GameState): Promise<void> {
        try {
            // Save both the game and game state in parallel
            await Promise.all([
                this.conGameService.updateGameState(game.id, game),
                this.gameStateService.updateGameState(gameState.gameId, gameState)
            ]);
        } catch (error) {
            console.error('Failed to save game state:', error);
            // TODO: You might want to add error handling here
            // For example, retrying the save or notifying the game server
        }
    }
} 