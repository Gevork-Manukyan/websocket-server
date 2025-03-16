import { Document } from 'mongoose';

export enum GameState {
    JOINING_GAME = 'JOINING_GAME',
    JOINING_TEAMS = 'JOINING_TEAMS',
    READY_UP = 'READY_UP',
    STARTING_SETUP = 'STARTING_SETUP',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED'
}

export enum GamePhase {
    PHASE1 = 'PHASE1',
    RESOLVE_DAY_BREAK_CARDS = 'RESOLVE_DAY_BREAK_CARDS',
    PHASE2 = 'PHASE2',
    PHASE3 = 'PHASE3',
    DISCARDING_CARDS = 'DISCARDING_CARDS',
    DRAWING_NEW_HAND = 'DRAWING_NEW_HAND',
    END_GAME = 'END_GAME'
}

export interface IUser extends Document {
    playerName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPlayer extends Document {
    socketId?: string;
    isHost: boolean;
    isReady: boolean;
    userId: string;
    teamId?: string;
    sage?: any;
    level: number;
    hand?: any[];
    deck?: any[];
    field?: any;
    joinedAt: Date;
}

export interface ITeam extends Document {
    teamNumber: number;
    teamSize: number;
    players: IPlayer[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IGame extends Document {
    gameId: string;
    numPlayersTotal: number;
    currentPlayers: number;
    isStarted: boolean;
    hasFinishedSetup: boolean;
    numPlayersReady: number;
    numPlayersFinishedSetup: number;
    status: GameState;
    teams: ITeam[];
    players: IPlayer[];
    creatureShop?: any[];
    itemShop?: any[];
    activeTeam?: number;
    currentPhase?: GamePhase;
    actionPoints?: number;
    maxActionPoints?: number;
    createdAt: Date;
    updatedAt: Date;
} 