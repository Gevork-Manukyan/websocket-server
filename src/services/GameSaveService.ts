import { ConGameService, ConGame } from '../models/ConGame';
import { GameStateService, GameState } from '../models/GameState';
import { State } from '../types/gamestate-types';

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
     * Saves a new game to the database
     * @param game - The game to save
     * @returns The saved game
     */
    async saveNewGame(game: ConGame): Promise<ConGame> {
        console.log('Saving new game:', game.id);
        try {
            // Save both the game and game state in parallel
            const [savedGame, savedState] = await Promise.all([
                this.conGameService.createGame(game.id, game.numPlayersTotal),
                this.gameStateService.createGameState(game.id)
            ]);

            console.log('Game and state saved successfully:', savedGame.id);
            return savedGame;
        } catch (error) {
            console.error('Failed to save new game:', error);
            throw error;
        }
    }

    /**
     * Saves the game state
     * @param game - The game to save
     * @param gameState - The game state to save
     */
    async saveGameState(game: ConGame, gameState: GameState): Promise<void> {
        console.log('Saving game state for game:', game.id);
        try {
            // Save both the game and game state in parallel
            await Promise.all([
                this.conGameService.updateGameState(game.id, game),
                this.gameStateService.updateGameState(gameState.gameId, gameState)
            ]);
        } catch (error) {
            console.error('Failed to save game state:', error);
            throw error;
        }
    }
} 