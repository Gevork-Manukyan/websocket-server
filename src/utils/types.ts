import { ConGame } from "../CONGame/ConGame";

export type gameId = string;
export type CurrentGames = {
  [key: gameId]: ConGame;
};