import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { Card, Sage } from "../types";
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

  getElement() {
    if (!this.sage) throw new NotFoundError("Sage", "Player does not have an element")
    if (!this.decklist) throw new NotFoundError("Decklist", "Player does not have an element")
    
    return this.decklist.sage.element;
  }

  toggleReady() {
    if (!this.sage) throw new ValidationError("Cannot toggle ready. The sage has not been set.", "sage");
    this.isReady = !this.isReady;
  }

  addCardToDeck(card: Card) {
    this.deck.push(card)
  }

  addCardsToDeck(cards: Card[]) {
    this.deck = this.deck.concat(cards)
  }

  initDeck() {
    if (!this.isReady) throw new ValidationError("Cannot initialize the deck. Player is not ready", "isReady")
    this.setDecklist(getSageDecklist(this.sage))

    const decklist = this.decklist!
    const basicStarter = decklist.basic
    this.addCardsToDeck([basicStarter, ...decklist.items])
  }
}
