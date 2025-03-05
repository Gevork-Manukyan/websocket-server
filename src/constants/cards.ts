import { ElementalCard, ElementalSage } from "../types";
import {
  AttackCard,
  ElementalChampion,
  ElementalWarriorCard,
  InstantCard,
  UtilityCard,
} from "../types";
import {
  AttackStarterCard,
  ElementalStarterCard,
  ElementalWarriorStarterCard,
  InstantStarterCard,
} from "../types/card-types";

// ------------ SAGES ------------
export const Cedar: ElementalSage = {
  name: "Cedar",
  sage: "Cedar",
  img: "",
  price: 1,
  element: "twig",
  attack: 3,
  health: 12,
  ability: undefined,
  rowRequirement: [1, 2, 3],
  isDayBreak: true,
};

export const Gravel: ElementalSage = {
  name: "Gravel",
  sage: "Gravel",
  img: "",
  price: 1,
  element: "pebble",
  attack: 3,
  health: 12,
  ability: undefined,
  rowRequirement: [1, 2, 3],
  isDayBreak: true,
};

export const Porella: ElementalSage = {
  name: "Porella",
  sage: "Porella",
  img: "",
  price: 1,
  element: "leaf",
  attack: 3,
  health: 12,
  ability: undefined,
  rowRequirement: [1, 2, 3],
  isDayBreak: true,
};

export const Torrent: ElementalSage = {
  name: "Torrent",
  sage: "Torrent",
  img: "",
  price: 1,
  element: "droplet",
  attack: 3,
  health: 12,
  ability: undefined,
  rowRequirement: [1, 2, 3],
  isDayBreak: true,
};

// ------------ CHAMPIONS ------------
// *** Twigs ***
export const VixVanguard: ElementalChampion = {
  name: "Vix Vanguard",
  price: 1,
  img: "",
  element: "twig",
  attack: 3,
  health: 6,
  ability: undefined,
  rowRequirement: [1],
  levelRequirement: 4,
  isDayBreak: true,
};

export const HornedHollow: ElementalChampion = {
  name: "Horned Hollow",
  price: 1,
  img: "",
  element: "twig",
  attack: 6,
  health: 4,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 6,
  isDayBreak: false,
};

export const CalamityLeopard: ElementalChampion = {
  name: "Calamity Leopard",
  price: 1,
  img: "",
  element: "twig",
  attack: 3,
  health: 8,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 8,
  isDayBreak: false,
};

// *** Pebbles ***
export const JadeTitan: ElementalChampion = {
  name: "Jade Titan",
  price: 1,
  img: "",
  element: "pebble",
  attack: 3,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  levelRequirement: 4,
  isDayBreak: false,
};

export const BoulderhideBrute: ElementalChampion = {
  name: "Boulderhide Brute",
  price: 1,
  img: "",
  element: "pebble",
  attack: 6,
  health: 6,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 6,
  isDayBreak: false,
};

export const OxenAvenger: ElementalChampion = {
  name: "Oxen Avenger",
  price: 1,
  img: "",
  element: "pebble",
  attack: 8,
  health: 7,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 8,
  isDayBreak: false,
};

// *** Leafs ***
export const AgileAssailant: ElementalChampion = {
  name: "Agile Assailant",
  price: 1,
  img: "",
  element: "leaf",
  attack: 3,
  health: 5,
  ability: undefined,
  rowRequirement: [2],
  levelRequirement: 4,
  isDayBreak: false,
};

export const BogBlight: ElementalChampion = {
  name: "Bog Blight",
  price: 1,
  img: "",
  element: "leaf",
  attack: 4,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  levelRequirement: 6,
  isDayBreak: true,
};

export const KomodoKin: ElementalChampion = {
  name: "Komodo Kin",
  price: 1,
  img: "",
  element: "leaf",
  attack: 8,
  health: 6,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 8,
  isDayBreak: false,
};

// *** Droplets ***
export const TideTurner: ElementalChampion = {
  name: "Tide Turner",
  price: 1,
  img: "",
  element: "droplet",
  attack: 4,
  health: 4,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 4,
  isDayBreak: false,
};

export const KingCrustacean: ElementalChampion = {
  name: "King Crustacean",
  price: 1,
  img: "",
  element: "droplet",
  attack: 3,
  health: 7,
  ability: undefined,
  rowRequirement: [1, 2],
  levelRequirement: 6,
  isDayBreak: false,
};

export const FrostfallEmperor: ElementalChampion = {
  name: "Frostfall Emperor",
  price: 1,
  img: "",
  element: "droplet",
  attack: 2,
  health: 12,
  ability: undefined,
  rowRequirement: [1],
  levelRequirement: 8,
  isDayBreak: false,
};

// ------------ BASICS ------------
// *** Twigs ***
export const Timber: ElementalStarterCard = {
  name: "Timber",
  price: 1,
  element: "twig",
  img: "",
  attack: 2,
  health: 2,
};

export const Bruce: ElementalCard = {
  name: "Bruce",
  price: 2,
  element: "twig",
  img: "",
  attack: 3,
  health: 3,
};

export const Willow: ElementalCard = {
  name: "Willow",
  price: 1,
  element: "twig",
  img: "",
  attack: 1,
  health: 3,
};

// *** Pebbles ***
export const Cobble: ElementalStarterCard = {
  name: "Cobble",
  price: 1,
  element: "pebble",
  img: "",
  attack: 2,
  health: 2,
};

export const Flint: ElementalCard = {
  name: "Flint",
  price: 1,
  element: "pebble",
  img: "",
  attack: 1,
  health: 3,
};

export const Rocco: ElementalCard = {
  name: "Rocco",
  price: 2,
  element: "pebble",
  img: "",
  attack: 3,
  health: 3,
};

// *** Leafs ***
export const Sprout: ElementalStarterCard = {
  name: "Sprout",
  price: 1,
  element: "leaf",
  img: "",
  attack: 2,
  health: 2,
};

export const Herbert: ElementalCard = {
  name: "Herbert",
  price: 2,
  element: "leaf",
  img: "",
  attack: 3,
  health: 3,
};

export const Mush: ElementalCard = {
  name: "Mush",
  price: 1,
  element: "leaf",
  img: "",
  attack: 1,
  health: 3,
};

// *** Droplets ***
export const Dribble: ElementalStarterCard = {
  name: "Dribble",
  price: 1,
  element: "droplet",
  img: "",
  attack: 2,
  health: 2,
};

export const Dewy: ElementalCard = {
  name: "Dewy",
  price: 2,
  element: "droplet",
  img: "",
  attack: 3,
  health: 3,
};

export const Wade: ElementalCard = {
  name: "Wade",
  img: "",
  price: 1,
  element: "droplet",
  attack: 1,
  health: 3,
};

// ------------ WARRIORS ------------
// *** Twigs ***
export const AcornSquire: ElementalWarriorStarterCard = {
  name: "Acorn Squire",
  img: "",
  price: 1,
  element: "twig",
  attack: 2,
  health: 3,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: false,
};

export const QuillThornback: ElementalWarriorStarterCard = {
  name: "Quill Thornback",
  img: "",
  price: 1,
  element: "twig",
  attack: 3,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const SlumberJack: ElementalWarriorStarterCard = {
  name: "Slumber Jack",
  img: "",
  price: 1,
  element: "twig",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: true,
};

export const CamouChameleon: ElementalWarriorCard = {
  name: "Camou Chameleon",
  img: "",
  price: 7,
  element: "twig",
  attack: 4,
  health: 5,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

export const LumberClaw: ElementalWarriorCard = {
  name: "Lumber Claw",
  img: "",
  price: 4,
  element: "twig",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const PineSnapper: ElementalWarriorCard = {
  name: "Pine Snapper",
  img: "",
  price: 3,
  element: "twig",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const SplinterStinger: ElementalWarriorCard = {
  name: "Splinter Stinger",
  img: "",
  price: 5,
  element: "twig",
  attack: 3,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const TwineFeline: ElementalWarriorCard = {
  name: "TwineFeline",
  img: "",
  price: 5,
  element: "twig",
  attack: 3,
  health: 5,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: true,
};

export const OakLumbertron: ElementalWarriorCard = {
  name: "Oak Lumbertron",
  img: "",
  price: 9,
  element: "twig",
  attack: 6,
  health: 6,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

// *** Pebbles ***
export const GeoWeasel: ElementalWarriorStarterCard = {
  name: "Geo Weasel",
  img: "",
  price: 1,
  element: "pebble",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const GraniteRampart: ElementalWarriorStarterCard = {
  name: "Granite Rampart",
  img: "",
  price: 1,
  element: "pebble",
  attack: 2,
  health: 3,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

export const OnyxBearer: ElementalWarriorStarterCard = {
  name: "Onyx Bearer",
  img: "",
  price: 1,
  element: "pebble",
  attack: 3,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: true,
};

export const CackleRipclaw: ElementalWarriorCard = {
  name: "Cackle Ripclaw",
  img: "",
  price: 4,
  element: "pebble",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const Redstone: ElementalWarriorCard = {
  name: "Redstone",
  img: "",
  price: 4,
  element: "pebble",
  attack: 3,
  health: 3,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

export const RubyGuardian: ElementalWarriorCard = {
  name: "Ruby Guardian",
  img: "",
  price: 3,
  element: "pebble",
  attack: 2,
  health: 3,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

export const RunePuma: ElementalWarriorCard = {
  name: "Rune Puma",
  img: "",
  price: 5,
  element: "pebble",
  attack: 3,
  health: 3,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const StoneDefender: ElementalWarriorCard = {
  name: "Stone Defender",
  img: "",
  price: 8,
  element: "pebble",
  attack: 7,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: true,
};

export const TerrainTumbler: ElementalWarriorCard = {
  name: "Terrain Tumbler",
  img: "",
  price: 5,
  element: "pebble",
  attack: 2,
  health: 6,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

// *** Leafs ***
export const BotanicFangs: ElementalWarriorStarterCard = {
  name: "Botanic Fangs",
  img: "",
  price: 1,
  element: "leaf",
  attack: 3,
  health: 4,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: false,
};

export const PetalMage: ElementalWarriorStarterCard = {
  name: "Petal Mage",
  img: "",
  price: 1,
  element: "leaf",
  attack: 2,
  health: 3,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const ThornFencer: ElementalWarriorStarterCard = {
  name: "Thorn Fencer",
  img: "",
  price: 1,
  element: "leaf",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: true,
};

export const BambooBerserker: ElementalWarriorCard = {
  name: "Bamboo Berserker",
  img: "",
  price: 9,
  element: "leaf",
  attack: 6,
  health: 6,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

export const ForageThumper: ElementalWarriorCard = {
  name: "Forage Thumper",
  img: "",
  price: 5,
  element: "leaf",
  attack: 2,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: true,
};

export const HummingHerald: ElementalWarriorCard = {
  name: "Humming Herald",
  img: "",
  price: 5,
  element: "leaf",
  attack: 4,
  health: 3,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const IguanaGuard: ElementalWarriorCard = {
  name: "Iguana Guard",
  img: "",
  price: 5,
  element: "leaf",
  attack: 3,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const MossViper: ElementalWarriorCard = {
  name: "Moss Viper",
  img: "",
  price: 5,
  element: "leaf",
  attack: 4,
  health: 2,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: false,
};

export const ShrubBeetle: ElementalWarriorCard = {
  name: "Shrub Beetle",
  img: "",
  price: 3,
  element: "leaf",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

// *** Droplets ***
export const CoastalCoyote: ElementalWarriorStarterCard = {
  name: "Coastal Coyote",
  img: "",
  price: 1,
  element: "droplet",
  attack: 3,
  health: 3,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: false,
};

export const RiptideTiger: ElementalWarriorStarterCard = {
  name: "Riptide Tiger",
  img: "",
  price: 1,
  element: "droplet",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const RiverRogue: ElementalWarriorStarterCard = {
  name: "River Rogue",
  img: "",
  price: 1,
  element: "droplet",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: true,
};

export const CurrentConjurer: ElementalWarriorCard = {
  name: "Current Conjurer",
  img: "",
  price: 3,
  element: "droplet",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const RoamingRazor: ElementalWarriorCard = {
  name: "Roaming Razor",
  img: "",
  price: 8,
  element: "droplet",
  attack: 5,
  health: 8,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: false,
};

export const SplashBasilisk: ElementalWarriorCard = {
  name: "Splash Basilisk",
  img: "",
  price: 5,
  element: "droplet",
  attack: 3,
  health: 5,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const SurgesphereMonk: ElementalWarriorCard = {
  name: "Surgesphere Monk",
  img: "",
  price: 3,
  element: "droplet",
  attack: 1,
  health: 4,
  ability: undefined,
  rowRequirement: [2],
  isDayBreak: false,
};

export const TyphoonFist: ElementalWarriorCard = {
  name: "Typhoon Fist",
  img: "",
  price: 4,
  element: "droplet",
  attack: 2,
  health: 4,
  ability: undefined,
  rowRequirement: [1],
  isDayBreak: false,
};

export const WhirlWhipper: ElementalWarriorCard = {
  name: "Whirl Whipper",
  img: "",
  price: 4,
  element: "droplet",
  attack: 3,
  health: 4,
  ability: undefined,
  rowRequirement: [1, 2],
  isDayBreak: true,
};

// ------------ ATTACKS ------------
export const CloseStrike: AttackStarterCard = {
  name: "Close Strike",
  img: "",
  price: 1,
  ability: undefined,
  rowRequirement: [1],
};

export const FarStrike: AttackStarterCard = {
  name: "Far Strike",
  img: "",
  price: 1,
  ability: undefined,
  rowRequirement: [1, 2],
};

export const DistantDoubleStrike: AttackCard = {
  name: "Distant Double Strike",
  img: "",
  price: 3,
  ability: undefined,
  rowRequirement: [1, 2],
};

export const FarsightFrenzy: AttackCard = {
  name: "Farsight Frenzy",
  img: "",
  price: 3,
  ability: undefined,
  rowRequirement: [1, 2, 3],
};

export const FocusedFury: AttackCard = {
  name: "Focused Fury",
  img: "",
  price: 2,
  ability: undefined,
  rowRequirement: [1],
};

export const MagicEtherStrike: AttackCard = {
  name: "Magic Ether Strike",
  img: "",
  price: 5,
  ability: undefined,
  rowRequirement: [1],
};

export const NaturesWrath: AttackCard = {
  name: "Nature's Wrath",
  img: "",
  price: 2,
  ability: undefined,
  rowRequirement: [1],
};

export const PrimitiveStrike: AttackCard = {
  name: "Primitive Strike",
  img: "",
  price: 3,
  ability: undefined,
  rowRequirement: [1, 2],
};

export const ProjectileBlast: AttackCard = {
  name: "Projectile Blast",
  img: "",
  price: 2,
  ability: undefined,
  rowRequirement: [1, 2],
};

export const ReinforcedImpact: AttackCard = {
  name: "Reinforced Impact",
  img: "",
  price: 2,
  ability: undefined,
  rowRequirement: [1],
};

// ------------ INSTANTS ------------
export const DropletCharm: InstantStarterCard = {
  name: "Droplet Charm",
  img: "",
  price: 1,
  ability: undefined,
};

export const LeafCharm: InstantStarterCard = {
  name: "Leaf Charm",
  img: "",
  price: 1,
  ability: undefined,
};

export const PebbleCharm: InstantStarterCard = {
  name: "Pebble Charm",
  img: "",
  price: 1,
  ability: undefined,
};

export const TwigCharm: InstantStarterCard = {
  name: "Twig Charm",
  img: "",
  price: 1,
  ability: undefined,
};

export const NaturalRestoration: InstantStarterCard = {
  name: "Natural Restoration",
  img: "",
  price: 1,
  ability: undefined,
};

export const MeleeShield: InstantCard = {
  name: "Melee Shield",
  img: "",
  price: 3,
  ability: undefined,
};

export const NaturalDefense: InstantCard = {
  name: "Natural Defense",
  img: "",
  price: 3,
  ability: undefined,
};

export const RangedBarrier: InstantCard = {
  name: "Ranged Barrier",
  img: "",
  price: 3,
  ability: undefined,
};

// ------------ UTILITIES ------------
export const ElementalIncantation: UtilityCard = {
  name: "Elemental Incantation",
  img: "",
  price: 5,
  ability: undefined,
};

export const ElementalSwap: UtilityCard = {
  name: "Elemental Swap",
  img: "",
  price: 2,
  ability: undefined,
};

export const ExchangeOfNature: UtilityCard = {
  name: "Exchange of Nature",
  img: "",
  price: 2,
  ability: undefined,
};

export const Obliterate: UtilityCard = {
  name: "Obliterate",
  img: "",
  price: 5,
  ability: undefined,
};
