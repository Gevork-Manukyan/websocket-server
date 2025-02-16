import { z } from "zod";
import { ElementalChampion, ElementalSage, ElementalStarterCard, ElementalWarriorCard, ItemCard } from "./card-types";

export type gameId = string;

export const ElementSchema = z.enum(["twig", "pebble", "leaf", "droplet"]);
export const SageSchema = z.enum(["Cedar", "Gravel", "Porella", "Torrent"]);
export type Element = z.infer<typeof ElementSchema>;
export type Sage = z.infer<typeof SageSchema>;

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


export const OnePlayerSpaceOptionsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
export const AllSpaceOptionsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
]);

export type OnePlayerSpaceOptions = z.infer<typeof OnePlayerSpaceOptionsSchema>;
export type TwoPlayerSpaceOptions = z.infer<typeof AllSpaceOptionsSchema>;
export type SpaceOption = OnePlayerSpaceOptions | TwoPlayerSpaceOptions