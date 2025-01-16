// Command of Nature (C.O.N)

import { Sage, ElementalCard, gameId, ItemCard } from "../types";
import { Battlefield } from "./Battlefield";
import { Player } from "./Player";

type Team = {
  players: Player[];
  battlefield: Battlefield;
}

export class ConGame {
  id: gameId;
  isStarted: boolean = false;
  numPlayersTotal: 2 | 4;
  numPlayersReady: number = 0;
  numPlayersFinishedSetup: number = 0;
  players: Player[] = [];
  team1: Team = {
    players: [],
    battlefield: new Battlefield([])
  };
  team2: Team = {
    players: [],
    battlefield: new Battlefield([])
  };
  creatureShop: ElementalCard[] = [];
  itemShop: ItemCard[] = [];

  constructor(gameId: ConGame['id'], numPlayers: ConGame['numPlayersTotal']) {
    this.id = gameId;
    this.numPlayersTotal = numPlayers;
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

  setPlayerSage(playerId: Player["id"], sage: Sage) {
    const isSageAvailable = this.players.every(player => player.sage !== sage)
    if (!isSageAvailable) throw new Error("Selected Sage is unavailable");

    this.getPlayer(playerId).setSage(sage)
  }

  joinTeam(playerId: Player['id'], team: 1 | 2) {
    const teamSelected = team === 1 ? this.team1 : this.team2;

    if (teamSelected.players.length === (this.numPlayersTotal / 2)) throw new Error(`Team ${team} is full`);
    teamSelected.players.push(this.getPlayer(playerId))
  }

  startGame(playerId: Player["id"]): Boolean {
    // Only host can start game
    if (!this.getPlayer(playerId).isGameHost) throw new Error(`Only the host can start the game`);

    // All players must be ready
    if (!this.players.every((player) => player.isReady)) throw new Error(`All players must be ready before starting game`)

    // TODO: initlize game
    this.initPlayerDecks();

    this.isStarted = true;
    return true;
  }

  initPlayerDecks() {
    this.players.forEach(player => player.initDeck())
  }

  chooseWarriors() {
    
  }
}
