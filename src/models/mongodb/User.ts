import mongoose from 'mongoose';
import { IUser } from './types';

const userSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema); 