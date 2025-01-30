import { z } from "zod";
import { ConGame } from "../models/ConGame";
import { ElementalChampion, ElementalSage, ElementalStarterCard, ElementalWarriorCard, ItemCard } from "./card-types";

export type gameId = string;

export const ElementSchema = z.enum(["twig", "pebble", "leaf", "droplet"]);
export const SageSchema = z.enum(["Cedar", "Gravel", "Porella", "Torrent"]);
export type Element = z.infer<typeof ElementSchema>;
export type Sage = z.infer<typeof SageSchema>;

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