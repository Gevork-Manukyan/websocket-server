import { gameStateManager } from './GameStateManager';
import { MongoDBService } from './MongoDBService';

export const mongoDBService = MongoDBService.getInstance();
export { gameStateManager };

export * from './GameStateManager';
export * from './GameEventEmitter';
export * from './CustomError/BaseError';
export * from './CustomError/GameError';
