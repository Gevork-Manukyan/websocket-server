import { Document, Schema } from 'mongoose';
import { ElementalCard } from '../../types';
import { SpaceOption } from '../../types/types';

// Define the base types
type BattlefieldSpaceBase = {
    spaceNumber: SpaceOption;
    value: ElementalCard | null;
    connections: {
        TL?: number | null;  // Index in the fieldArray
        T?: number | null;
        TR?: number | null;
        L?: number | null;
        R?: number | null;
        BL?: number | null;
        B?: number | null;
        BR?: number | null;
    };
};

type BattlefieldBase = {
    fieldArray: BattlefieldSpaceBase[];
    numPlayersOnTeam: 1 | 2;
};

// Extend Document for MongoDB
export interface IBattlefieldSpace extends Document, BattlefieldSpaceBase {}

export interface IBattlefield extends Document, BattlefieldBase {}

// Define the schemas
export const BattlefieldSpaceSchema = new Schema<IBattlefieldSpace>({
    spaceNumber: { type: Number, required: true },
    value: { type: Schema.Types.Mixed, required: true, default: null },
    connections: { type: Schema.Types.Mixed, required: true, default: null }
});

export const BattlefieldSchema = new Schema<IBattlefield>({
    fieldArray: { type: [BattlefieldSpaceSchema], required: true },
    numPlayersOnTeam: { type: Number, required: true, enum: [1, 2] }
});