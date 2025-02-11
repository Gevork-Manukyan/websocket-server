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

export type TransitionEvent = 'all-sages-selected' | 'all-teams-joined' | 'all-players-ready' | 'all-players-setup-complete' | 'next-phase' | 'day-break-card' | 'draw-card' | 'swap-cards' | 'summon-card' | 'attack' | 'utility' | 'sage-skill' | 'buy-card' | 'sell-card' | 'refresh-shop' | 'done-discarding-cards' | 'done-drawing-new-hand' | 'win-game';
