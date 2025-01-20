"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSageDecklist = getSageDecklist;
const constants_1 = require("./constants");
function getSageDecklist(sage) {
    if (!sage)
        throw new Error(`No chosen character`);
    switch (sage) {
        case "Cedar":
            return constants_1.TwigDeck;
        case "Gravel":
            return constants_1.PebbleDeck;
        case "Porella":
            return constants_1.LeafDeck;
        case "Torrent":
            return constants_1.DropletDeck;
        default:
            throw new Error(`Unknown character class: ${sage}`);
    }
}
