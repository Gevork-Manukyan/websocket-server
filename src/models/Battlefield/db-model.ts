import { Document, Schema } from 'mongoose';
import { ElementalCard } from '../../types';
import { SpaceOption } from '../../types/types';

// Define the base types
type BattlefieldBase = {
    fieldArray: BattlefieldSpaceBase[];
    numPlayersOnTeam: 1 | 2;
};

type BattlefieldSpaceBase = {
    spaceNumber: SpaceOption;
    value: ElementalCard | null;
    connections: {
        TL?: string | null;
        T?: string | null;
        TR?: string | null;
        L?: string | null;
        R?: string | null;
        BL?: string | null;
        B?: string | null;
        BR?: string | null;
    };
};

// Extend Document for MongoDB
export interface IBattlefield extends Document, BattlefieldBase {}

export interface IBattlefieldSpace extends Document, BattlefieldSpaceBase {}

// Define the schemas
export const BattlefieldSchema = new Schema<IBattlefield>({
    fieldArray: [{ type: Schema.Types.Mixed, required: true }],
    numPlayersOnTeam: { type: Number, required: true, enum: [1, 2] }
});

export const BattlefieldSpaceSchema = new Schema<IBattlefieldSpace>({
    spaceNumber: { type: Number, required: true },
    value: { type: Schema.Types.Mixed, required: true, default: null },
    connections: {
        TL: { type: Schema.Types.Mixed, default: null },
        T: { type: Schema.Types.Mixed, default: null },
        TR: { type: Schema.Types.Mixed, default: null },
        L: { type: Schema.Types.Mixed, default: null },
        R: { type: Schema.Types.Mixed, default: null },
        BL: { type: Schema.Types.Mixed, default: null },
        B: { type: Schema.Types.Mixed, default: null },
        BR: { type: Schema.Types.Mixed, default: null }
    }
});