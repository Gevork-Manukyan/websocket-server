import { ConGame } from "../models/ConGame";

export type CurrentGames = {
  [key: gameId]: ConGame;
};

export type gameId = string;

export type Element = "twig" | "pebble" | "leaf" | "droplet";
export type Sage = "Cedar" | "Gravel" | "Porella" | "Torrent";
