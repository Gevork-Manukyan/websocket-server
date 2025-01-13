import { AcornSquire, CalamityLeopard, Cedar, HornedHollow, QuillThornback, SlumberJack, Timber, VixVanguard } from "./";
import { AgileAssailant, BobBlight, BotanicFangs, BoulderhideBrute, CloseStrike, CoastalCoyote, Cobble, Dribble, DropletCharm, FarStrike, FrostfallEmperor, GeoWeasel, GraniteRampart, Gravel, JadeTitan, KingCrustacean, KomodoKin, LeafCharm, NaturalRestoration, OnyxBearer, OxenAvenger, PebbleCharm, PetalMage, Porella, RiptideTiger, RiverRogue, Sprout, ThornFencer, TideTurner, Torrent, TwigCharm } from "./cards";

export const PORT = 3002; // Port for the WebSocket server

export const TwigDeck = {
    sage: Cedar,
    champions: {
        level4: VixVanguard,
        level6: HornedHollow,
        level8: CalamityLeopard,
    },
    warriors: [AcornSquire, QuillThornback, SlumberJack],
    basics: Array(4).fill(Timber),
    items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, TwigCharm]
}

export const PebbleDeck = {
    sage: Gravel,
    champions: {
        level4: JadeTitan,
        level6: BoulderhideBrute,
        level8: OxenAvenger,
    },
    warriors: [GeoWeasel, GraniteRampart, OnyxBearer],
    basics: Array(4).fill(Cobble),
    items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, PebbleCharm]
}

export const LeafDeck = {
    sage: Porella,
    champions: {
        level4: AgileAssailant,
        level6: BobBlight,
        level8: KomodoKin,
    },
    warriors: [BotanicFangs, PetalMage, ThornFencer],
    basics: Array(4).fill(Sprout),
    items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, LeafCharm]
}

export const DropletDeck = {
    sage: Torrent,
    champions: {
        level4: TideTurner,
        level6: KingCrustacean,
        level8: FrostfallEmperor,
    },
    warriors: [CoastalCoyote, RiptideTiger, RiverRogue],
    basics: Array(4).fill(Dribble),
    items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, DropletCharm]
}