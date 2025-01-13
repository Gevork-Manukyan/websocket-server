import { Card, Sage } from "../types";

export class Player {
  id: string;
  isReady: boolean = false;
  isGameHost: boolean;
  sage: Sage | null = null;
  deckList = {}; // TODO: Define Decklist type
  gold: number = 0;
  level: number = 1;
  hand: Card[] = [];
  deck: Card[] = [];
  discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
  }

  toggleReady() {
    if (!this.sage) return;
    this.isReady = !this.isReady;
  }

  addCardToDeck(card: Card) {
    this.deck.push(card)
  }

  addCardsToDeck(cards: Card[]) {
    this.deck = this.deck.concat(cards)
  }
}
