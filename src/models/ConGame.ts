// Command of Nature (C.O.N)

import { Character, ElementalCard, gameId, ItemCard } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "../utils/constants";
import { getCharacterDecklist } from "../utils/utilities";
import { Player } from "./Player";

export class ConGame {
  id: gameId;
  isStarted: boolean = false;
  players: Player[] = [];
  team1: Player[] = [];
  team2: Player[] = [];
  creatureShop: ElementalCard[] = [];
  itemShop: ItemCard[] = [];

  constructor(gameId: gameId) {
    this.id = gameId;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  removePlayer(playerId: Player["id"]) {
    this.players = this.players.filter((item) => item.id !== playerId);
  }

  getPlayer(playerId: Player["id"]): Player {
    const player = this.players.find((item) => item.id === playerId);
    if (!player)
      throw new Error(
        `Player with socket ID ${playerId} not found in game ${this.id}`
      );
    return player;
  }

  setPlayerCharacter(playerId: Player["id"], character: Character): Boolean {
    const isCharacterAvailable = this.players.every(player => player.characterClass !== character)
    if (!isCharacterAvailable) return false;

    this.getPlayer(playerId).characterClass = character
    return true;
  }

  startGame(playerId: Player["id"]): boolean {
    // Only host can start game
    if (!this.getPlayer(playerId).isGameHost) return false;

    // All players must be ready
    if (!this.players.every((player) => player.isReady)) return false;

    // TODO: initlize game

    this.createTeams();
    this.initPlayerDecks();

    this.isStarted = true;
    return true;
  }

  createTeams() {
    this.team1.push(this.players[0]);
    this.team2.push(this.players[1]);
  } 

  /**
   * Adds basic and item cards to all players' decks
   */
  initPlayerDecks() {
    this.players.forEach(player => {
      if (!player.characterClass) throw new Error(`Player ${player.id} requires a character selection.`)
        
      const playerClassDecklist = getCharacterDecklist(player.characterClass)
      player.addCardsToDeck([...playerClassDecklist.basics, ...playerClassDecklist.items])
    })
  }

  chooseWarriors() {

  }
}
