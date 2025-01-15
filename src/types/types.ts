import { ConGame } from "../models/ConGame";
import { ElementalChampion, ElementalSage, ElementalStarterCard, ElementalWarriorCard, ItemCard } from "./card-types";

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
  basic: ElementalStarterCard;
  items: ItemCard[];
}