import mongoose from 'mongoose';
import { IGame, GameState, GamePhase } from './types';

const gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true, unique: true },
    numPlayersTotal: { type: Number, required: true },
    currentPlayers: { type: Number, default: 0 },
    isStarted: { type: Boolean, default: false },
    hasFinishedSetup: { type: Boolean, default: false },
    numPlayersReady: { type: Number, default: 0 },
    numPlayersFinishedSetup: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: Object.values(GameState),
        default: GameState.JOINING_GAME 
    },
    teams: [{
        teamNumber: { type: Number, required: true },
        teamSize: { type: Number, required: true },
        players: [{
            socketId: String,
            isHost: { type: Boolean, default: false },
            isReady: { type: Boolean, default: false },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            sage: mongoose.Schema.Types.Mixed,
            level: { type: Number, default: 1 },
            hand: [mongoose.Schema.Types.Mixed],
            deck: [mongoose.Schema.Types.Mixed],
            field: mongoose.Schema.Types.Mixed,
            joinedAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    creatureShop: [mongoose.Schema.Types.Mixed],
    itemShop: [mongoose.Schema.Types.Mixed],
    activeTeam: Number,
    currentPhase: {
        type: String,
        enum: Object.values(GamePhase)
    },
    actionPoints: Number,
    maxActionPoints: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Game = mongoose.model<IGame>('Game', gameSchema); 