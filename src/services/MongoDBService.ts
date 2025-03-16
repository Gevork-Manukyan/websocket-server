import { Game, User } from '../models/mongodb';
import { gameId } from '../types';
import { GameState, GamePhase } from '../models/mongodb/types';

export class MongoDBService {
    private static instance: MongoDBService;
    
    private constructor() {}

    static getInstance() {
        if (!MongoDBService.instance) {
            MongoDBService.instance = new MongoDBService();
        }
        return MongoDBService.instance;
    }

    // User Operations
    async createUser(playerName: string): Promise<string> {
        const user = await User.create({ playerName });
        return user.id;
    }

    async getUser(userId: string) {
        return await User.findById(userId);
    }

    // Game Operations
    async createGame(gameId: gameId, numPlayersTotal: number) {
        return await Game.create({
            gameId,
            numPlayersTotal,
            status: GameState.JOINING_GAME
        });
    }

    async getGame(gameId: gameId) {
        return await Game.findOne({ gameId });
    }

    async updateGameState(gameId: gameId, updates: Partial<any>) {
        return await Game.findOneAndUpdate(
            { gameId },
            { $set: updates },
            { new: true }
        );
    }

    async addPlayerToGame(gameId: gameId, userId: string, isHost: boolean) {
        return await Game.findOneAndUpdate(
            { gameId },
            {
                $push: {
                    'players': {
                        userId,
                        isHost,
                        isReady: false,
                        level: 1
                    }
                },
                $inc: { currentPlayers: 1 }
            },
            { new: true }
        );
    }

    async updatePlayerInGame(
        gameId: gameId,
        userId: string,
        updates: Partial<any>
    ) {
        const updatePath = Object.keys(updates).reduce((acc, key) => {
            acc[`players.$.${key}`] = updates[key];
            return acc;
        }, {} as Record<string, any>);

        return await Game.findOneAndUpdate(
            { 
                gameId,
                'players.userId': userId
            },
            { $set: updatePath },
            { new: true }
        );
    }

    async addPlayerToTeam(gameId: gameId, userId: string, teamNumber: number) {
        return await Game.findOneAndUpdate(
            { 
                gameId,
                'teams.teamNumber': teamNumber
            },
            {
                $push: {
                    'teams.$.players': {
                        userId,
                        isReady: false,
                        level: 1
                    }
                }
            },
            { new: true }
        );
    }

    async deleteGame(gameId: gameId) {
        await Game.deleteOne({ gameId });
    }

    // Shop Operations
    async updateShop(gameId: gameId, creatureShop: any[], itemShop: any[]) {
        return await Game.findOneAndUpdate(
            { gameId },
            {
                $set: {
                    creatureShop,
                    itemShop
                }
            },
            { new: true }
        );
    }

    // Game State Operations
    async updateGamePhase(gameId: gameId, phase: GamePhase, actionPoints?: number) {
        const update: any = { currentPhase: phase };
        if (actionPoints !== undefined) {
            update.actionPoints = actionPoints;
        }
        return await Game.findOneAndUpdate(
            { gameId },
            { $set: update },
            { new: true }
        );
    }
} 