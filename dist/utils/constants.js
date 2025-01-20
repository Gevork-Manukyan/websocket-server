"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropletDeck = exports.LeafDeck = exports.PebbleDeck = exports.TwigDeck = exports.PORT = void 0;
const _1 = require("./");
const cards_1 = require("./cards");
exports.PORT = 3002; // Port for the WebSocket server
exports.TwigDeck = {
    sage: _1.Cedar,
    champions: {
        level4: _1.VixVanguard,
        level6: _1.HornedHollow,
        level8: _1.CalamityLeopard,
    },
    warriors: [_1.AcornSquire, _1.QuillThornback, _1.SlumberJack],
    basic: _1.Timber,
    items: [cards_1.CloseStrike, cards_1.CloseStrike, cards_1.FarStrike, cards_1.NaturalRestoration, cards_1.TwigCharm]
};
exports.PebbleDeck = {
    sage: cards_1.Gravel,
    champions: {
        level4: cards_1.JadeTitan,
        level6: cards_1.BoulderhideBrute,
        level8: cards_1.OxenAvenger,
    },
    warriors: [cards_1.GeoWeasel, cards_1.GraniteRampart, cards_1.OnyxBearer],
    basic: cards_1.Cobble,
    items: [cards_1.CloseStrike, cards_1.CloseStrike, cards_1.FarStrike, cards_1.NaturalRestoration, cards_1.PebbleCharm]
};
exports.LeafDeck = {
    sage: cards_1.Porella,
    champions: {
        level4: cards_1.AgileAssailant,
        level6: cards_1.BobBlight,
        level8: cards_1.KomodoKin,
    },
    warriors: [cards_1.BotanicFangs, cards_1.PetalMage, cards_1.ThornFencer],
    basic: cards_1.Sprout,
    items: [cards_1.CloseStrike, cards_1.CloseStrike, cards_1.FarStrike, cards_1.NaturalRestoration, cards_1.LeafCharm]
};
exports.DropletDeck = {
    sage: cards_1.Torrent,
    champions: {
        level4: cards_1.TideTurner,
        level6: cards_1.KingCrustacean,
        level8: cards_1.FrostfallEmperor,
    },
    warriors: [cards_1.CoastalCoyote, cards_1.RiptideTiger, cards_1.RiverRogue],
    basic: cards_1.Dribble,
    items: [cards_1.CloseStrike, cards_1.CloseStrike, cards_1.FarStrike, cards_1.NaturalRestoration, cards_1.DropletCharm]
};
