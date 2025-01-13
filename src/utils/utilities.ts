import { Sage } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "./constants";

export function getSageDecklist(sage: Sage | null) {
  if (!sage) throw new Error(`No chosen character`)

      switch (sage) {
        case "Cedar":
          return TwigDeck;
        case "Gravel": 
          return PebbleDeck;
        case "Porella":
          return LeafDeck;
        case "Torrent":
          return DropletDeck;
        default:
          throw new Error(`Unknown character class: ${sage}`);
      }
}