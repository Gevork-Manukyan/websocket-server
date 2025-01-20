"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const utilities_1 = require("../utils/utilities");
class Player {
    constructor(socketId, isGameHost = false) {
        this.isReady = false;
        this.team = null;
        this.sage = null;
        this.decklist = null;
        this.gold = 0;
        this.level = 1;
        this.hand = [];
        this.deck = [];
        this.discardPile = [];
        this.id = socketId;
        this.isGameHost = isGameHost;
    }
    setTeam(team) {
        this.team = team;
    }
    setSage(sage) {
        this.sage = sage;
    }
    setDecklist(decklist) {
        this.decklist = decklist;
    }
    getDecklist() {
        return this.decklist;
    }
    toggleReady() {
        if (!this.sage)
            return;
        this.isReady = !this.isReady;
    }
    addCardToDeck(card) {
        this.deck.push(card);
    }
    addCardsToDeck(cards) {
        this.deck = this.deck.concat(cards);
    }
    initDeck() {
        if (!this.sage)
            throw new Error("Cannot initialize the deck. The sage has not been set.");
        this.setDecklist((0, utilities_1.getSageDecklist)(this.sage));
        const decklist = this.decklist;
        const basicStarter = decklist.basic;
        this.addCardsToDeck([basicStarter, ...decklist.items]);
    }
}
exports.Player = Player;
