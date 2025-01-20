"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BambooBerserker = exports.ThornFencer = exports.PetalMage = exports.BotanicFangs = exports.TerrainTumbler = exports.StoneDefender = exports.RunePuma = exports.RubyGuardian = exports.Redstone = exports.CackleRipclaw = exports.OnyxBearer = exports.GraniteRampart = exports.GeoWeasel = exports.OakLumbertron = exports.TwineFeline = exports.SplinterStinger = exports.PineSnapper = exports.LumberClaw = exports.CamouChameleon = exports.SlumberJack = exports.QuillThornback = exports.AcornSquire = exports.Wade = exports.Dewy = exports.Dribble = exports.Mush = exports.Herbert = exports.Sprout = exports.Rocco = exports.Flint = exports.Cobble = exports.Willow = exports.Bruce = exports.Timber = exports.FrostfallEmperor = exports.KingCrustacean = exports.TideTurner = exports.KomodoKin = exports.BobBlight = exports.AgileAssailant = exports.OxenAvenger = exports.BoulderhideBrute = exports.JadeTitan = exports.CalamityLeopard = exports.HornedHollow = exports.VixVanguard = exports.Torrent = exports.Porella = exports.Gravel = exports.Cedar = void 0;
exports.Obliterate = exports.ExchangeOfNature = exports.ElementalSwap = exports.ElementalIncantation = exports.RangedBarrier = exports.NaturalDefense = exports.MeleeShield = exports.NaturalRestoration = exports.TwigCharm = exports.PebbleCharm = exports.LeafCharm = exports.DropletCharm = exports.ReinforcedImpact = exports.ProjectileBlast = exports.PrimitiveStrike = exports.NaturesWrath = exports.MagicEtherStrike = exports.FocusedFury = exports.FarsightFrenzy = exports.DistantDoubleStrike = exports.FarStrike = exports.CloseStrike = exports.WhirlWhipper = exports.TyphoonFist = exports.SurgesphereMonk = exports.SplashBasilisk = exports.RoamingRazor = exports.CurrentConjurer = exports.RiverRogue = exports.RiptideTiger = exports.CoastalCoyote = exports.ShrubBeetle = exports.MossViper = exports.IguanaGuard = exports.HummingHerald = exports.ForageThumper = void 0;
// ------------ SAGES ------------
exports.Cedar = {
    name: "Cedar",
    sage: "Cedar",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 12,
    ability: undefined,
    rowRequirement: [1, 2, 3],
};
exports.Gravel = {
    name: "Gravel",
    sage: "Gravel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 3,
    health: 12,
    ability: undefined,
    rowRequirement: [1, 2, 3],
};
exports.Porella = {
    name: "Porella",
    sage: "Porella",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 12,
    ability: undefined,
    rowRequirement: [1, 2, 3],
};
exports.Torrent = {
    name: "Torrent",
    sage: "Torrent",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 12,
    ability: undefined,
    rowRequirement: [1, 2, 3],
};
// ------------ CHAMPIONS ------------
// *** Twigs ***
exports.VixVanguard = {
    name: "Vix Vanguard",
    price: 1,
    img: "",
    element: "twig",
    attack: 3,
    health: 6,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 4
};
exports.HornedHollow = {
    name: "Horned Hollow",
    price: 1,
    img: "",
    element: "twig",
    attack: 6,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
};
exports.CalamityLeopard = {
    name: "Calamity Leopard",
    price: 1,
    img: "",
    element: "twig",
    attack: 3,
    health: 8,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
};
// *** Pebbles ***
exports.JadeTitan = {
    name: "Jade Titan",
    price: 1,
    img: "",
    element: "pebble",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 4
};
exports.BoulderhideBrute = {
    name: "Boulderhide Brute",
    price: 1,
    img: "",
    element: "pebble",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
};
exports.OxenAvenger = {
    name: "Oxen Avenger",
    price: 1,
    img: "",
    element: "pebble",
    attack: 8,
    health: 7,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
};
// *** Leafs ***
exports.AgileAssailant = {
    name: "Agile Assailant",
    price: 1,
    img: "",
    element: "leaf",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [2],
    levelRequirement: 4
};
exports.BobBlight = {
    name: "Bob Blight",
    price: 1,
    img: "",
    element: "leaf",
    attack: 4,
    health: 5,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 6
};
exports.KomodoKin = {
    name: "Komodo Kin",
    price: 1,
    img: "",
    element: "leaf",
    attack: 8,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 8
};
// *** Droplets ***
exports.TideTurner = {
    name: "Tide Turner",
    price: 1,
    img: "",
    element: "droplet",
    attack: 4,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 4
};
exports.KingCrustacean = {
    name: "King Crustacean",
    price: 1,
    img: "",
    element: "droplet",
    attack: 3,
    health: 7,
    ability: undefined,
    rowRequirement: [1, 2],
    levelRequirement: 6
};
exports.FrostfallEmperor = {
    name: "Frostfall Emperor",
    price: 1,
    img: "",
    element: "droplet",
    attack: 2,
    health: 12,
    ability: undefined,
    rowRequirement: [1],
    levelRequirement: 8
};
// ------------ BASICS ------------
// *** Twigs ***
exports.Timber = {
    name: "Timber",
    price: 1,
    element: "twig",
    img: "",
    attack: 2,
    health: 2,
};
exports.Bruce = {
    name: "Bruce",
    price: 2,
    element: "twig",
    img: "",
    attack: 3,
    health: 3,
};
exports.Willow = {
    name: "Willow",
    price: 1,
    element: "twig",
    img: "",
    attack: 1,
    health: 3,
};
// *** Pebbles ***
exports.Cobble = {
    name: "Cobble",
    price: 1,
    element: "pebble",
    img: "",
    attack: 2,
    health: 2,
};
exports.Flint = {
    name: "Flint",
    price: 1,
    element: "pebble",
    img: "",
    attack: 1,
    health: 3,
};
exports.Rocco = {
    name: "Rocco",
    price: 2,
    element: "pebble",
    img: "",
    attack: 3,
    health: 3,
};
// *** Leafs ***
exports.Sprout = {
    name: "Sprout",
    price: 1,
    element: "leaf",
    img: "",
    attack: 2,
    health: 2,
};
exports.Herbert = {
    name: "Herbert",
    price: 2,
    element: "leaf",
    img: "",
    attack: 3,
    health: 3,
};
exports.Mush = {
    name: "Mush",
    price: 1,
    element: "leaf",
    img: "",
    attack: 1,
    health: 3,
};
// *** Droplets ***
exports.Dribble = {
    name: "Dribble",
    price: 1,
    element: "droplet",
    img: "",
    attack: 2,
    health: 2,
};
exports.Dewy = {
    name: "Dewy",
    price: 2,
    element: "droplet",
    img: "",
    attack: 3,
    health: 3,
};
exports.Wade = {
    name: "Wade",
    img: "",
    price: 1,
    element: "droplet",
    attack: 1,
    health: 3,
};
// ------------ WARRIORS ------------
// *** Twigs ***
exports.AcornSquire = {
    name: "Acorn Squire",
    img: "",
    price: 1,
    element: "twig",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.QuillThornback = {
    name: "Quill Thornback",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.SlumberJack = {
    name: "Slumber Jack",
    img: "",
    price: 1,
    element: "twig",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.CamouChameleon = {
    name: "Camou Chameleon",
    img: "",
    price: 7,
    element: "twig",
    attack: 4,
    health: 5,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.LumberClaw = {
    name: "Lumber Claw",
    img: "",
    price: 4,
    element: "twig",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.PineSnapper = {
    name: "Pine Snapper",
    img: "",
    price: 3,
    element: "twig",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.SplinterStinger = {
    name: "Splinter Stinger",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
};
exports.TwineFeline = {
    name: "TwineFeline",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [2]
};
exports.OakLumbertron = {
    name: "Oak Lumbertron",
    img: "",
    price: 9,
    element: "twig",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2]
};
// *** Pebbles ***
exports.GeoWeasel = {
    name: "Geo Weasel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.GraniteRampart = {
    name: "Granite Rampart",
    img: "",
    price: 1,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.OnyxBearer = {
    name: "Onyx Bearer",
    img: "",
    price: 1,
    element: "pebble",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.CackleRipclaw = {
    name: "Cackle Ripclaw",
    img: "",
    price: 4,
    element: "pebble",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.Redstone = {
    name: "Redstone",
    img: "",
    price: 4,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.RubyGuardian = {
    name: "Ruby Guardian",
    img: "",
    price: 3,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.RunePuma = {
    name: "Rune Puma",
    img: "",
    price: 5,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
};
exports.StoneDefender = {
    name: "Stone Defender",
    img: "",
    price: 8,
    element: "pebble",
    attack: 7,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
};
exports.TerrainTumbler = {
    name: "Terrain Tumbler",
    img: "",
    price: 5,
    element: "pebble",
    attack: 2,
    health: 6,
    ability: undefined,
    rowRequirement: [2]
};
// *** Leafs ***
exports.BotanicFangs = {
    name: "Botanic Fangs",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.PetalMage = {
    name: "Petal Mage",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
};
exports.ThornFencer = {
    name: "Thorn Fencer",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.BambooBerserker = {
    name: "Bamboo Berserker",
    img: "",
    price: 9,
    element: "leaf",
    attack: 6,
    health: 6,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.ForageThumper = {
    name: "Forage Thumper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 2,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
};
exports.HummingHerald = {
    name: "Humming Herald",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 3,
    ability: undefined,
    rowRequirement: [2]
};
exports.IguanaGuard = {
    name: "Iguana Guard",
    img: "",
    price: 5,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.MossViper = {
    name: "Moss Viper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 2,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.ShrubBeetle = {
    name: "Shrub Beetle",
    img: "",
    price: 3,
    element: "leaf",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
// *** Droplets ***
exports.CoastalCoyote = {
    name: "Coastal Coyote",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.RiptideTiger = {
    name: "Riptide Tiger",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.RiverRogue = {
    name: "River Rogue",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.CurrentConjurer = {
    name: "Current Conjurer",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.RoamingRazor = {
    name: "Roaming Razor",
    img: "",
    price: 8,
    element: "droplet",
    attack: 5,
    health: 8,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.SplashBasilisk = {
    name: "Splash Basilisk",
    img: "",
    price: 5,
    element: "droplet",
    attack: 3,
    health: 5,
    ability: undefined,
    rowRequirement: [1]
};
exports.SurgesphereMonk = {
    name: "Surgesphere Monk",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: undefined,
    rowRequirement: [2]
};
exports.TyphoonFist = {
    name: "Typhoon Fist",
    img: "",
    price: 4,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: undefined,
    rowRequirement: [1]
};
exports.WhirlWhipper = {
    name: "Whirl Whipper",
    img: "",
    price: 4,
    element: "droplet",
    attack: 3,
    health: 4,
    ability: undefined,
    rowRequirement: [1, 2]
};
// ------------ ATTACKS ------------
exports.CloseStrike = {
    name: "Close Strike",
    img: "",
    price: 1,
    ability: undefined,
    rowRequirement: [1]
};
exports.FarStrike = {
    name: "Far Strike",
    img: "",
    price: 1,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.DistantDoubleStrike = {
    name: "Distant Double Strike",
    img: "",
    price: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.FarsightFrenzy = {
    name: "Farsight Frenzy",
    img: "",
    price: 3,
    ability: undefined,
    rowRequirement: [1, 2, 3]
};
exports.FocusedFury = {
    name: "Focused Fury",
    img: "",
    price: 2,
    ability: undefined,
    rowRequirement: [1]
};
exports.MagicEtherStrike = {
    name: "Magic Ether Strike",
    img: "",
    price: 5,
    ability: undefined,
    rowRequirement: [1]
};
exports.NaturesWrath = {
    name: "Nature's Wrath",
    img: "",
    price: 2,
    ability: undefined,
    rowRequirement: [1]
};
exports.PrimitiveStrike = {
    name: "Primitive Strike",
    img: "",
    price: 3,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.ProjectileBlast = {
    name: "Projectile Blast",
    img: "",
    price: 2,
    ability: undefined,
    rowRequirement: [1, 2]
};
exports.ReinforcedImpact = {
    name: "Reinforced Impact",
    img: "",
    price: 2,
    ability: undefined,
    rowRequirement: [1]
};
// ------------ INSTANTS ------------
exports.DropletCharm = {
    name: "Droplet Charm",
    img: "",
    price: 1,
    ability: undefined,
};
exports.LeafCharm = {
    name: "Leaf Charm",
    img: "",
    price: 1,
    ability: undefined,
};
exports.PebbleCharm = {
    name: "Pebble Charm",
    img: "",
    price: 1,
    ability: undefined,
};
exports.TwigCharm = {
    name: "Twig Charm",
    img: "",
    price: 1,
    ability: undefined,
};
exports.NaturalRestoration = {
    name: "Natural Restoration",
    img: "",
    price: 1,
    ability: undefined,
};
exports.MeleeShield = {
    name: "Melee Shield",
    img: "",
    price: 3,
    ability: undefined,
};
exports.NaturalDefense = {
    name: "Natural Defense",
    img: "",
    price: 3,
    ability: undefined,
};
exports.RangedBarrier = {
    name: "Ranged Barrier",
    img: "",
    price: 3,
    ability: undefined,
};
// ------------ UTILITIES ------------
exports.ElementalIncantation = {
    name: "Elemental Incantation",
    img: "",
    price: 5,
    ability: undefined,
};
exports.ElementalSwap = {
    name: "Elemental Swap",
    img: "",
    price: 2,
    ability: undefined,
};
exports.ExchangeOfNature = {
    name: "Exchange of Nature",
    img: "",
    price: 2,
    ability: undefined,
};
exports.Obliterate = {
    name: "Obliterate",
    img: "",
    price: 5,
    ability: undefined,
};
