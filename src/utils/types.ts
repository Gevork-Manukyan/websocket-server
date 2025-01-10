import { ConGame } from "../CONGame/ConGame";

export type gameId = string;
export type CurrentGames = {
  [key: gameId]: ConGame;
};

export type Element = "twig" | "pebble" | "leaf" | "droplet";
export type Character = "Cedar" | "Gravel" | "Porella" | "Torrent";

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
  // TODO: Since each ability is pretty unique either create a ton of micro functions (ie. get gold, do damage, etc) 
  // or give each character a custom function to be called
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

export type ItemCard = Card & {

}

export type AttackCard = ItemCard & {

}

export type UtilityCard = ItemCard & {

}

export type InstantCard = ItemCard & {

}

