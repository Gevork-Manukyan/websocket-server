import { Element, Sage } from "./types";

export type Card = {
  name: string;
  price: number;
  img: string;
};

export type StarterCard = {
    price: 1;
}

export type AbilityCard = {
  ability: undefined;
  rowRequirement: (1 | 2 | 3)[];
}

export type ElementalCard = Card & {
  element: Element;
  attack: number;
  health: number;
};

export type ElementalStarterCard = ElementalCard & StarterCard;

export type ElementalWarriorCard = ElementalCard & AbilityCard;

export type ElementalWarriorStarterCard = ElementalWarriorCard & StarterCard;

export type ElementalChampion = ElementalWarriorCard & StarterCard & {
  levelRequirement: 4 | 6 | 8;
};

export type ElementalSage = ElementalCard &
  ElementalWarriorCard & StarterCard & {
    sage: Sage;
  };

export type ItemCard = Card & Omit<AbilityCard, "rowRequirement">;

export type AttackCard = Card & AbilityCard;

export type AttackStarterCard = AttackCard & StarterCard;

export type UtilityCard = ItemCard;

export type InstantCard = ItemCard;

export type InstantStarterCard = InstantCard & StarterCard;
