import { Document, Schema } from 'mongoose';
import { gameId, TeamOrder, ElementalCard, ItemCard } from '../../types';
import { IPlayer, PlayerSchema } from '../Player/db-model';
import { ITeam, TeamSchema } from '../Team/db-model';

// Define the base type
type ConGameBase = {
    isStarted: boolean;
    hasFinishedSetup: boolean;
    numPlayersTotal: 2 | 4;
    numPlayersReady: number;
    numPlayersFinishedSetup: number;
    players: IPlayer[];
    team1: ITeam;
    team2: ITeam;
    teamOrder: TeamOrder;
    creatureShop: ElementalCard[];
    itemShop: ItemCard[];
    currentCreatureShopCards: ElementalCard[];
    currentItemShopCards: ItemCard[];
}

// Extend Document for MongoDB
export interface IConGame extends Document, ConGameBase {}

// Define the schema
export const ConGameSchema = new Schema({
    id: { type: String, required: true },
    isStarted: { type: Boolean, required: true },
    hasFinishedSetup: { type: Boolean, required: true },
    numPlayersTotal: { type: Number, required: true, enum: [2, 4] },
    numPlayersReady: { type: Number, required: true },
    numPlayersFinishedSetup: { type: Number, required: true },
    players: { type: [PlayerSchema], required: true },
    team1: { type: TeamSchema, required: true },
    team2: { type: TeamSchema, required: true },
    teamOrder: { type: Object, required: true },
    creatureShop: [{ type: Schema.Types.Mixed, required: true }],
    itemShop: [{ type: Schema.Types.Mixed, required: true }],
    currentCreatureShopCards: [{ type: Schema.Types.Mixed, required: true }],
    currentItemShopCards: [{ type: Schema.Types.Mixed, required: true }]
}); 