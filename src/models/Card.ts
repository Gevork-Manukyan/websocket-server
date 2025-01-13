import { ElementalCard, ElementalSage } from "../types";
import { StarterCard } from "../types/card-types";


// ------ SAGES ------
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

// ------ CHAMPIONS ------


// ------ BASICS ------
// Twigs
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

// Pebbles
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

// Leafs
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



// Droplets
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
    price: 1,
    element: "droplet",
    img: "",
    attack: 1,
    health: 3,
}

// ------ WARRIORS ------


// ------ ATTACKS ------


// ------ INSTANTS ------


// ------ UTILITIES ------
