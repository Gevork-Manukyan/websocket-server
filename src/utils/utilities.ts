import { Character } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "./constants";

export function getCharacterDecklist(character: Character) {
      switch (character) {
        case "Cedar":
          return TwigDeck;
        case "Gravel": 
          return PebbleDeck;
        case "Porella":
          return LeafDeck;
        case "Torrent":
          return DropletDeck;
        default:
          throw new Error(`Unknown character class: ${character}`);
      }
}