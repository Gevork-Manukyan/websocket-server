import { ConGame } from "../models/ConGame";
import { ElementalCard, ElementalChampion, ElementalSage, ElementalWarriorCard, ItemCard } from "./card-types";

export type gameId = string;
export type Element = "twig" | "pebble" | "leaf" | "droplet";
export type Sage = "Cedar" | "Gravel" | "Porella" | "Torrent";

export type CurrentGames = {
  [key: gameId]: ConGame;
};

export type Decklist = {
  sage: ElementalSage;
  champions: {
    level4: ElementalChampion;
    level6: ElementalChampion;
    level8: ElementalChampion;
  },
  warriors: ElementalWarriorCard[];
  basics: ElementalCard;
  items: ItemCard[];
}