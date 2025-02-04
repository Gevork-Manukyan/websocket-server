import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { Card, Sage } from "../types";
import { ElementalWarriorStarterCard } from "../types/card-types";
import { Decklist } from "../types/types";
import { getSageDecklist } from "../utils/utilities";
import { Team } from "./Team";

export class Player {
  id: string;
  isReady: boolean = false;
  isSetup: boolean = false;
  hasChosenWarriors: boolean = false;
  isGameHost: boolean;
  private team: Team | null = null;
  private sage: Sage | null = null;
  private decklist: Decklist | null = null;
  private gold: number = 0;
  private level: number = 1;
  private hand: Card[] = [];
  private deck: Card[] = [];
  private discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
  }

  getTeam() {
    if (!this.team) throw new NotFoundError("Team", "Player does not have a team")
    return this.team;
  }

  setTeam(team: Team) {
    this.team = team;
  }

  getSage() {
    return this.sage;
  }

  setSage(sage: Sage) {
    this.sage = sage;
  }
  
  getDecklist() {
    return this.decklist
  }

  setDecklist(decklist: Decklist) {
    this.decklist = decklist;
  }

  getGold() {
    return this.gold;
  }

  setGold(amount: number) {
    this.gold = amount;
  }

  getLevel() {
    return this.level;
  }

  setLevel(level: number) {
    this.level = level;
  }

  getHand() {
    return this.hand;
  }

  setHand(hand: Card[]) {
    this.hand = hand;
  }

  getDiscardPile() {
    return this.discardPile;
  }

  setDiscardPile(discardPile: Card[]) {
    this.discardPile = discardPile;
  }

  getElement() {
    if (!this.sage) throw new NotFoundError("Sage", "Player does not have an element")
    if (!this.decklist) throw new NotFoundError("Decklist", "Player does not have an element")
    
    return this.decklist.sage.element;
  }

  toggleReady() {
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

  chooseWarriors(choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
    const decklist = this.getDecklist()!
    const decklistWariors = decklist.warriors
    const [choice1, choice2] = choices

    // If chosen cards are not of the correct deck
    if (!decklistWariors.includes(choice1) || !decklistWariors.includes(choice2)) 
      throw new ValidationError("Invalid warrior(s) passed for chosen deck", "INVALID_INPUT")
    
    if (!this.team) throw new NotFoundError("Team", "Player requires a team before choosing warriors")

    this.team.initWarriors(choices)
    this.hasChosenWarriors = true;

    // Add the non-chosen card to the player's deck
    decklist.warriors.forEach(card => {
      if ((card.name !== choice1.name) || (card.name !== choice2.name))
        this.addCardToDeck(card);
    })
  }

  swapWarriors() {
    if (!this.team) throw new NotFoundError("Team", "Player requires a team before swapping warriors")
    this.team.swapWarriors(this.getElement())
  }

  finishPlayerSetup() {
    if (!this.isReady) throw new NotFoundError("Player", "Player is not ready");
    if (!this.hasChosenWarriors) throw new NotFoundError("Warriors", "Player has not chosen warriors");
    this.isSetup = true;
  }

  cancelPlayerSetup() {
    this.isSetup = false;
  }
}
