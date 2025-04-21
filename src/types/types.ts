import { z } from "zod";
import { Team } from "../models/Team/Team";
import { ConGame, GameState } from "../models";
export type gameId = string;

export type TeamOrder = {
  first: Team;
  second: Team;
}

export type GameStateInfo = {
  game: ConGame;
  state: GameState;
}