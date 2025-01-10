import { ConGame } from "../CONGame/ConGame";

export type gameId = string;
export type CurrentGames = {
  [key: gameId]: ConGame;
};

export type Player = {
  id: string; // socket id
  isReady: boolean;
  isGameHost: boolean;
  toggleReady: () => void;
};
