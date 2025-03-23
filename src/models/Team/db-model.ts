import { Document, Schema, Types } from 'mongoose';
import { PlayerSchema, IPlayer } from '../Player/db-model';

export interface ITeam extends Document {}

export const TeamSchema = new Schema({}); 