import { Card, ElementalWarriorCard, Sage } from "../types";
import { Decklist } from "../types/types";
import { getSageDecklist } from "../utils/utilities";
import { Battlefield } from "./Battlefield";

export class Player {
  id: string;
  isReady: boolean = false;
  isGameHost: boolean;
  sage: Sage | null = null;
  battlefield: Battlefield; //TODO: battlefield must exist on ConGame and there should only be two: one for each team
  decklist: Decklist | null = null;
  gold: number = 0;
  level: number = 1;
  hand: Card[] = [];
  deck: Card[] = [];
  discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
    this.battlefield = new Battlefield([])
  }

  setSage(sage: Sage) {
    this.sage = sage;
  }

  setDecklist(decklist: Decklist) {
    this.decklist = decklist;
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

  /**
   * Adds basic and sage to the field; adds item and basic to player's deck
   */
  initDeck() {
    if (!this.sage) throw new Error("Cannot initialize the deck. The sage has not been set.")
    this.setDecklist(getSageDecklist(this.sage))
    
    const decklist = this.decklist!
    const basicStarter = decklist.basic
    this.addCardsToDeck([basicStarter, ...decklist.items])
    this.battlefield.addCard(basicStarter, 1)
    this.battlefield.addCard(basicStarter, 2)
    this.battlefield.addCard(basicStarter, 3)
    this.battlefield.addCard(decklist.sage, 5)
  }

  /**
   * Adds two selected warrior cards to the field and the remaining to the deck
   * @param param0 Array of two warriors to be put on the field; 
   * first element is left warrior
   */
  chooseWarriors([choice1, choice2]: [ElementalWarriorCard, ElementalWarriorCard]) {
    // Add the non-chosen card to the deck
    this.decklist?.warriors.forEach(card => {
      if ((card.name !== choice1.name) || (card.name !== choice2.name))
        this.addCardToDeck(card);
    })

    this.battlefield.addCard(choice1, 4)
    this.battlefield.addCard(choice2, 6)
  }
}
