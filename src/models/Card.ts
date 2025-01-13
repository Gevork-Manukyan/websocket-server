import { ElementalCard, ElementalSage } from "../types";
import { ElementalChampion, ElementalWarriorCard, StarterCard } from "../types/card-types";


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
}

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
}

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
}

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
}

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
    levelRequirement: 4
}

export const HornedHollow: ElementalChampion = {
    name: "Horned Hollow",
    price: 1,
    img: "",
    element: "twig",
    attack: 6,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
}

export const CalamityLeopard: ElementalChampion = {
    name: "Calamity Leopard",
    price: 1,
    img: "",
    element: "twig",
    attack: 3,
    health: 8,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
}

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
    levelRequirement: 4
}

export const BoulderhideBrute: ElementalChampion = {
    name: "Boulderhide Brute",
    price: 1,
    img: "",
    element: "pebble",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
}

export const OxenAvenger: ElementalChampion = {
    name: "Oxen Avenger",
    price: 1,
    img: "",
    element: "pebble",
    attack: 8,
    health: 7,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
}

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
    levelRequirement: 4
}

export const BobBlight: ElementalChampion = {
    name: "Bob Blight",
    price: 1,
    img: "",
    element: "leaf",
    attack: 4,
    health: 5,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 6
}

export const KomodoKin: ElementalChampion = {
    name: "Komodo Kin",
    price: 1,
    img: "",
    element: "leaf",
    attack: 8,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
}

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
    levelRequirement: 4
}

export const KingCrustacean: ElementalChampion = {
    name: "King Crustacean",
    price: 1,
    img: "",
    element: "droplet",
    attack: 3,
    health: 7,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
}

export const FrostfallEmperor: ElementalChampion = {
    name: "Frostfall Emperor",
    price: 1,
    img: "",
    element: "droplet",
    attack: 2,
    health: 12,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 8
}


// ------------ BASICS ------------
// *** Twigs ***
export const Timber: ElementalCard & StarterCard = {
    name: "Timber",
    price: 1,
    element: "twig",
    img: "",
    attack: 2,
    health: 2,
}

export const Bruce: ElementalCard = {
    name: "Bruce",
    price: 2,
    element: "twig",
    img: "",
    attack: 3,
    health: 3,
}

export const Willow: ElementalCard = {
    name: "Willow",
    price: 1,
    element: "twig",
    img: "",
    attack: 1,
    health: 3,
}

// *** Pebbles ***
export const Cobble: ElementalCard & StarterCard = {
    name: "Cobble",
    price: 1,
    element: "pebble",
    img: "",
    attack: 2,
    health: 2,
}

export const Flint: ElementalCard = {
    name: "Flint",
    price: 1,
    element: "pebble",
    img: "",
    attack: 1,
    health: 3,
}

export const Rocco: ElementalCard = {
    name: "Rocco",
    price: 2,
    element: "pebble",
    img: "",
    attack: 3,
    health: 3,
}

// *** Leafs ***
export const Sprout: ElementalCard & StarterCard = {
    name: "Sprout",
    price: 1,
    element: "leaf",
    img: "",
    attack: 2,
    health: 2,
}

export const Herbert: ElementalCard = {
    name: "Herbert",
    price: 2,
    element: "leaf",
    img: "",
    attack: 3,
    health: 3,
}

export const Mush: ElementalCard = {
    name: "Mush",
    price: 1,
    element: "leaf",
    img: "",
    attack: 1,
    health: 3,
}

// *** Droplets ***
export const Dribble: ElementalCard & StarterCard = {
    name: "Dribble",
    price: 1,
    element: "droplet",
    img: "",
    attack: 2,
    health: 2,
}

export const Dewy: ElementalCard = {
    name: "Dewy",
    price: 2,
    element: "droplet",
    img: "",
    attack: 3,
    health: 3,
}

export const Wade: ElementalCard = {
    name: "Wade",
    img: "",
    price: 1,
    element: "droplet",
    attack: 1,
    health: 3,
}

// ------------ WARRIORS ------------
// *** Twigs ***
export const AcornSquire: ElementalWarriorCard & StarterCard = {
    name: "Acorn Squire",
    img: "",
    price: 1,
    element: "twig",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const QuillThornback: ElementalWarriorCard & StarterCard = {
    name: "Quill Thornback",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const SlumberJack: ElementalWarriorCard & StarterCard = {
    name: "Slumber Jack",
    img: "",
    price: 1,
    element: "twig",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const CamouChameleon: ElementalWarriorCard = {
    name: "Camou Chameleon",
    img: "",
    price: 7,
    element: "twig",
    attack: 4,
    health: 5,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const LumberClaw: ElementalWarriorCard = {
    name: "Lumber Claw",
    img: "",
    price: 4,
    element: "twig",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const PineSnapper: ElementalWarriorCard = {
    name: "Pine Snapper",
    img: "",
    price: 3,
    element: "twig",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const SplinterStinger: ElementalWarriorCard = {
    name: "Splinter Stinger",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
}

export const TwineFeline: ElementalWarriorCard = {
    name: "TwineFeline",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [2]
}

export const OakLumbertron: ElementalWarriorCard = {
    name: "Oak Lumbertron",
    img: "",
    price: 9,
    element: "twig",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2]
}

// *** Pebbles ***
export const GeoWeasel: ElementalWarriorCard & StarterCard = {
    name: "Geo Weasel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const GraniteRampart: ElementalWarriorCard & StarterCard = {
    name: "Granite Rampart",
    img: "",
    price: 1,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const OnyxBearer: ElementalWarriorCard & StarterCard = {
    name: "Onyx Bearer",
    img: "",
    price: 1,
    element: "pebble",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const CackleRipclaw: ElementalWarriorCard = {
    name: "Cackle Ripclaw",
    img: "",
    price: 4,
    element: "pebble",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const Redstone: ElementalWarriorCard = {
    name: "Redstone",
    img: "",
    price: 4,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const RubyGuardian: ElementalWarriorCard = {
    name: "Ruby Guardian",
    img: "",
    price: 3,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const RunePuma: ElementalWarriorCard = {
    name: "Rune Puma",
    img: "",
    price: 5,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
}

export const StoneDefender: ElementalWarriorCard = {
    name: "Stone Defender",
    img: "",
    price: 8,
    element: "pebble",
    attack: 7,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
}

export const TerrainTumbler: ElementalWarriorCard = {
    name: "Terrain Tumbler",
    img: "",
    price: 5,
    element: "pebble",
    attack: 2,
    health: 6,
    ability: undefined,
    rowRequirement: [2]
}
  
// *** Leafs ***
export const BotanicFangs: ElementalWarriorCard & StarterCard = {
    name: "Botanic Fangs",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const PetalMage: ElementalWarriorCard & StarterCard = {
    name: "Petal Mage",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
}

export const ThornFencer: ElementalWarriorCard & StarterCard = {
    name: "Thorn Fencer",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const BambooBerserker: ElementalWarriorCard = {
    name: "Bamboo Berserker",
    img: "",
    price: 9,
    element: "leaf",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const ForageThumper: ElementalWarriorCard = {
    name: "Forage Thumper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 2,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
}

export const HummingHerald: ElementalWarriorCard = {
    name: "Humming Herald",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
}

export const IguanaGuard: ElementalWarriorCard = {
    name: "Iguana Guard",
    img: "",
    price: 5,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const MossViper: ElementalWarriorCard = {
    name: "Moss Viper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 2,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const ShrubBeetle: ElementalWarriorCard = {
    name: "Shrub Beetle",
    img: "",
    price: 3,
    element: "leaf",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

// *** Droplets ***
export const CoastalCoyote: ElementalWarriorCard & StarterCard = {
    name: "Coastal Coyote",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const RiptideTiger: ElementalWarriorCard & StarterCard = {
    name: "Riptide Tiger",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const RiverRogue: ElementalWarriorCard & StarterCard = {
    name: "River Rogue",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const CurrentConjurer: ElementalWarriorCard = {
    name: "Current Conjurer",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const RoamingRazor: ElementalWarriorCard = {
    name: "Roaming Razor",
    img: "",
    price: 8,
    element: "droplet",
    attack: 5,
    health: 8,
    ability: undefined,
    rowRequirement: [1, 2]
}

export const SplashBasilisk: ElementalWarriorCard = {
    name: "Splash Basilisk",
    img: "",
    price: 5,
    element: "droplet",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
}

export const SurgesphereMonk: ElementalWarriorCard = {
    name: "Surgesphere Monk",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
}

export const TyphoonFist: ElementalWarriorCard = {
    name: "Typhoon Fist",
    img: "",
    price: 4,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
}

export const WhirlWhipper: ElementalWarriorCard = {
    name: "Whirl Whipper",
    img: "",
    price: 4,
    element: "droplet",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2]
}

// ------------ ATTACKS ------------


// ------------ INSTANTS ------------


// ------------ UTILITIES ------------
