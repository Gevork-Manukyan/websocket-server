import { Model } from 'mongoose';
import { IGameState } from './db-model';
import { GameState } from './GameState';
import { NotFoundError } from '../../services/CustomError/BaseError';
import { TransitionEvent } from '../../types/gamestate-types';

export class GameStateService {
    private model: Model<IGameState>;

    constructor(model: Model<IGameState>) {
        this.model = model;
    }

    async createGameState(gameId: string): Promise<GameState> {
        const gameState = new GameState(gameId);
        const doc = await this.model.create(gameState.toMongoose());
        return GameState.fromMongoose(doc);
    }

    async findGameStateById(id: string): Promise<GameState> {
        const doc = await this.model.findById(id);
        if (!doc) {
            throw new NotFoundError('GameState', `GameState with id ${id} not found`);
        }
        return GameState.fromMongoose(doc);
    }

    async findGameStateByGameId(gameId: string): Promise<GameState> {
        const doc = await this.model.findOne({ gameId });
        if (!doc) {
            throw new NotFoundError('GameState', `GameState for game ${gameId} not found`);
        }
        return GameState.fromMongoose(doc);
    }

    async updateGameState(id: string, updates: Partial<GameState>): Promise<GameState> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!doc) {
            throw new NotFoundError('GameState', `GameState with id ${id} not found`);
        }
        return GameState.fromMongoose(doc);
    }

    async processGameStateEvent(id: string, event: TransitionEvent): Promise<GameState> {
        const gameState = await this.findGameStateById(id);
        gameState.processEvent(event);
        return this.updateGameState(id, gameState);
    }

    async deleteGameState(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('GameState', `GameState with id ${id} not found`);
        }
    }

    async deleteGameStateByGameId(gameId: string): Promise<void> {
        const result = await this.model.deleteOne({ gameId });
        if (result.deletedCount === 0) {
            throw new NotFoundError('GameState', `GameState for game ${gameId} not found`);
        }
    }
} 