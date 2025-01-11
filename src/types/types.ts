import { ConGame } from "../models/ConGame";
import { gameId } from "./shared-types";

export type CurrentGames = {
  [key: gameId]: ConGame;
};
