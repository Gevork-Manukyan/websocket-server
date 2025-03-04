import { Decklist } from "../types/types";
import {
  AcornSquire,
  CalamityLeopard,
  Cedar,
  HornedHollow,
  QuillThornback,
  SlumberJack,
  Timber,
  VixVanguard,
} from "./";
import {
  AgileAssailant,
  BogBlight,
  BotanicFangs,
  BoulderhideBrute,
  CloseStrike,
  CoastalCoyote,
  Cobble,
  Dribble,
  DropletCharm,
  FarStrike,
  FrostfallEmperor,
  GeoWeasel,
  GraniteRampart,
  Gravel,
  JadeTitan,
  KingCrustacean,
  KomodoKin,
  LeafCharm,
  NaturalRestoration,
  OnyxBearer,
  OxenAvenger,
  PebbleCharm,
  PetalMage,
  Porella,
  RiptideTiger,
  RiverRogue,
  Sprout,
  ThornFencer,
  TideTurner,
  Torrent,
  TwigCharm,
} from "./cards";
import { NODE_ENV } from "./config";

/* ------- ENV ------- */
export const IS_PRODUCTION = NODE_ENV === "production";

/* ------- DECKLISTS ------- */
export const TwigDeck: Decklist = {
  sage: Cedar,
  champions: {
    level4: VixVanguard,
    level6: HornedHollow,
    level8: CalamityLeopard,
  },
  warriors: [AcornSquire, QuillThornback, SlumberJack],
  basic: Timber,
  items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, TwigCharm],
};

export const PebbleDeck: Decklist = {
  sage: Gravel,
  champions: {
    level4: JadeTitan,
    level6: BoulderhideBrute,
    level8: OxenAvenger,
  },
  warriors: [GeoWeasel, GraniteRampart, OnyxBearer],
  basic: Cobble,
  items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, PebbleCharm],
};

export const LeafDeck: Decklist = {
  sage: Porella,
  champions: {
    level4: AgileAssailant,
    level6: BogBlight,
    level8: KomodoKin,
  },
  warriors: [BotanicFangs, PetalMage, ThornFencer],
  basic: Sprout,
  items: [CloseStrike, CloseStrike, FarStrike, NaturalRestoration, LeafCharm],
};

export const DropletDeck: Decklist = {
  sage: Torrent,
  champions: {
    level4: TideTurner,
    level6: KingCrustacean,
    level8: FrostfallEmperor,
  },
  warriors: [CoastalCoyote, RiptideTiger, RiverRogue],
  basic: Dribble,
  items: [
    CloseStrike,
    CloseStrike,
    FarStrike,
    NaturalRestoration,
    DropletCharm,
  ],
};
