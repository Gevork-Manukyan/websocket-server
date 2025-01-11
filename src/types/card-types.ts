import { Character } from "./shared-types";

export type Card = {
    name: string;
    price: number;
  }
  
  export type ElementalCard = Card & {
    element: Element;
    attack: number;
    health: number;
  }
  
  export type ElementalWarriorCard = ElementalCard & {
    ability: undefined; 
    rowRequirement: (1 | 2 | 3)[];
  }
  
  export type ElementalChampion = ElementalWarriorCard & {
    price: 1;
    levelRequirement: 4 | 6 | 8;
  }
  
  export type ElementalSage = ElementalCard & {
    character: Character;
  }
  
  export type ItemCard = Card;
  
  export type AttackCard = ItemCard;
  
  export type UtilityCard = ItemCard;
  
  export type InstantCard = ItemCard;
  