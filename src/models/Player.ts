import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { Card, Sage } from "../types";
import { ElementalWarriorStarterCard } from "../types/card-types";
import { Decklist } from "../types/types";
import { drawCardFromDeck, getSageDecklist } from "../lib/utilities";
import { Team } from "./Team";

export class Player {
  id: string;
  private isReady: boolean = false;
  private isSetup: boolean = false;
  private hasChosenWarriors: boolean = false;
  private isGameHost: boolean;
  private team: Team | null = null;
  private sage: Sage | null = null;
  private decklist: Decklist | null = null;
  private level: number = 1;
  private hand: Card[] = [];
  private deck: Card[] = [];
  private discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
  }

  getIsReady() {
    return this.isReady;
  }

  setIsReady(value: boolean) {
    this.isReady = value;
  }

  toggleReady() {
    this.isReady = !this.isReady;
  }

  getIsSetup() {
    return this.isSetup;
  }

  setIsSetup(value: boolean) {
    this.isSetup = value;
  }

  getHasChosenWarriors() {
    return this.hasChosenWarriors;
  }

  setHasChosenWarriors(value: boolean) {
    this.hasChosenWarriors = value;
  }

  getIsGameHost() {
    return this.isGameHost;
  }

  getTeam() {
    return this.team;
  }

  setTeam(team: Player['team']) {
    this.team = team;
  }

  getTeammate() {
    if (!this.team) throw new NotFoundError("Team", "Player does not have a team")
    return this.team.players.find(player => player.id !== this.id)!;
  }

  getSage() {
    return this.sage;
  }

  setSage(sage: Player['sage']) {
    this.sage = sage;
  }
  
  getDecklist() {
    return this.decklist
  }

  setDecklist(decklist: Decklist) {
    this.decklist = decklist;
  }

  getLevel() {
    return this.level;
  }

  levelUp() {
    if (this.level === 8) return;
    this.level += 1;
  }

  getHand() {
    return this.hand;
  }

  addCardToHand(card: Card) {
    this.hand.push(card);
  }

  removeCardFromHand(index: number) {
    if (index < 0 || index >= this.hand.length) throw new ValidationError("Invalid index for hand", "INVALID_INDEX")

    return this.hand.splice(index, 1)[0];
  }

  getDeck() {
    return this.deck;
  }

  addCardToDeck(card: Card) {
    this.deck.push(card)
  }

  addCardsToDeck(cards: Card[]) {
    this.deck = this.deck.concat(cards)
  }

  getDiscardPile() {
    return this.discardPile;
  }

  addCardToDiscardPile(card: Card) {
    this.discardPile.push(card);
  }

  removeCardFromDiscardPile(index: number) {
    if (index < 0 || index >= this.discardPile.length) throw new ValidationError("Invalid index for discard pile", "INVALID_INDEX")

    return this.discardPile.splice(index, 1)[0];
  }

  getElement() {
    if (!this.sage) throw new NotFoundError("Sage", "Player does not have an element")
    if (!this.decklist) throw new NotFoundError("Decklist", "Player does not have an element")
    
    return this.decklist.sage.element;
  }

  initDeck() {
    if (!this.isReady) throw new ValidationError("Cannot initialize the deck. Player is not ready", "isReady")
    this.setDecklist(getSageDecklist(this.sage))

    const decklist = this.decklist!
    const basicStarter = decklist.basic
    this.addCardsToDeck([basicStarter, ...decklist.items])
  }

  initHand() {
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
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
    this.team.swapWarriors(this)
  }

  finishPlayerSetup() {
    if (!this.isReady) throw new NotFoundError("Player", "Player is not ready");
    if (!this.hasChosenWarriors) throw new NotFoundError("Warriors", "Player has not chosen warriors");
    this.isSetup = true;
  }

  cancelPlayerSetup() {
    this.isSetup = false;
  }

  
  /* -------- GAME ACTIONS -------- */

  getPlayerState() {
    return {
      sage: this.sage,
      level: this.level,
      hand: this.hand,
    }
  }

  drawCard() {
    const drawnCard = drawCardFromDeck(this.deck)
    this.addCardToHand(drawnCard)
  }
}
