import { Card, ElementalWarriorCard, Sage } from "../types";
import { Decklist } from "../types/types";
import { getSageDecklist } from "../utils/utilities";
import { Team } from "./Team";

export class Player {
  id: string;
  isReady: boolean = false;
  isGameHost: boolean;
  team: Team | null = null;
  sage: Sage | null = null;
  decklist: Decklist | null = null;
  gold: number = 0;
  level: number = 1;
  hand: Card[] = [];
  deck: Card[] = [];
  discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
  }

  setTeam(team: Team) {
    this.team = team;
  }

  setSage(sage: Sage) {
    this.sage = sage;
  }

  setDecklist(decklist: Decklist) {
    this.decklist = decklist;
  }

  getDecklist() {
    return this.decklist
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

  initDeck() {
    if (!this.sage) throw new Error("Cannot initialize the deck. The sage has not been set.")
    this.setDecklist(getSageDecklist(this.sage))

    const decklist = this.decklist!
    const basicStarter = decklist.basic
    this.addCardsToDeck([basicStarter, ...decklist.items])
  }

  chooseWarriors([choice1, choice2]: [ElementalWarriorCard, ElementalWarriorCard]) {
    // Add the non-chosen card to the deck
    this.decklist?.warriors.forEach(card => {
      if ((card.name !== choice1.name) || (card.name !== choice2.name))
        this.addCardToDeck(card);
    })

    // this.battlefield.addCard(choice1, 4)
    // this.battlefield.addCard(choice2, 6)
  }
}
