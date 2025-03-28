import { ConGameService, ConGame, ConGameModel } from '../models/ConGame';
import { GameStateService, GameState, GameStateModel } from '../models/GameState';
import { GameStateInfo } from '../types';

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
     * Creates and saves a new game to the database
     * @param numPlayersTotal - The number of players in the game
     * @returns The newly created/saved game and game state
     */
    async saveNewGame(numPlayersTotal: ConGame['numPlayersTotal']): Promise<GameStateInfo> {
        try {
            // First save the game to get its ID
            const savedGame = await this.conGameService.createGame(numPlayersTotal);
            
            // Create and save the game state with the new game ID
            const savedGameState = await this.gameStateService.createGameState(savedGame.id);

            return { game: savedGame, state: savedGameState };
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

const conGameService = new ConGameService(ConGameModel);
const gameStateService = new GameStateService(GameStateModel);
export const gameSaveService = GameSaveService.getInstance(conGameService, gameStateService);