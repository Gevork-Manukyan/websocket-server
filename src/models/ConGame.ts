// Command of Nature (C.O.N)

import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { Sage, ElementalCard, gameId, ItemCard, ElementalWarriorCard } from "../types";
import { PlayerOrderOptions } from "../types/types";
import { Player } from "./Player";
import { Team } from "./Team";

export class ConGame {
  id: gameId;
  isStarted: Boolean = false;
  hasFinishedSetup: Boolean = false;
  numPlayersTotal: 2 | 4;
  numPlayersReady: number = 0;
  numPlayersFinishedSetup: number = 0;
  players: Player[] = [];
  team1: Team;
  team2: Team;
  private teamOrder: [Team, Team];
  private playerOrder: [Player, Player] | [Player, Player, Player, Player] | null = null;
  creatureShop: ElementalCard[] = [];
  itemShop: ItemCard[] = [];

  constructor(gameId: ConGame['id'], numPlayers: ConGame['numPlayersTotal']) {
    this.id = gameId;
    this.numPlayersTotal = numPlayers;
    
    const teamSize = numPlayers / 2;
    this.team1 = new Team(teamSize as Team['teamSize'], 1)
    this.team2 = new Team(teamSize as Team['teamSize'], 2)
    this.teamOrder = [this.team1, this.team2];
  }

  setStarted(value: Boolean) {
    this.isStarted = value;
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
      throw new NotFoundError(
        "Player",
        `Player with socket ID ${playerId} not found in game ${this.id}`
      );
      
    return player;
  }

  setPlayerSage(playerId: Player["id"], sage: Sage) {
    const isSageAvailable = this.players.every(player => player.getSage() !== sage)
    if (!isSageAvailable) throw new SageUnavailableError(sage);

    this.getPlayer(playerId).setSage(sage)
  }

  getTeamOrder() {
    return this.teamOrder;
  }

  setTeamOrder(teamOrder: [Team, Team]) {
    // make sure that the teams that are passed are the same instances that are in the game
    if (
      (teamOrder[0] !== this.team1 && teamOrder[0] !== this.team2) ||
      (teamOrder[0] !== this.team2 && teamOrder[0] !== this.team1)
    ) throw new NotFoundError("Team", "Team(s) not found in game")

    this.teamOrder = teamOrder;
  }

  getPlayerOrder() {
    return this.playerOrder;
  }

  setPlayerOrder(player: Player, playerOrder: PlayerOrderOptions) {
    if (this.playerOrder === null) throw new NotFoundError("Player Order", "Player order not set")
    if (playerOrder < 1 || playerOrder > this.numPlayersTotal) throw new NotFoundError("Player Order", "Invalid player order")
    if (this.numPlayersTotal === 4 && playerOrder > 2) throw new NotFoundError("Player Order", "Invalid player order for 4 player game")

    const playerOrderIndex = playerOrder - 1;

    if (this.playerOrder[playerOrderIndex] === player) throw new ValidationError("Player Order", "Player is already in that position")
    this.playerOrder[playerOrderIndex] = player;
  }

  joinTeam(playerId: Player['id'], teamNumber: Team['teamNumber']) {
    const teamSelected = teamNumber === 1 ? this.team1 : this.team2;
    const player = this.getPlayer(playerId);

    // Check if already on team
    const currTeam = player.getTeam();
    if (currTeam !== null) currTeam.removePlayerFromTeam(player)

    teamSelected.addPlayerToTeam(player);
    player.setTeam(teamSelected);
  }

  incrementPlayersReady() {
    this.numPlayersReady++
    if (this.numPlayersReady > this.numPlayersTotal) this.numPlayersReady = this.numPlayersTotal
    return this.numPlayersReady;
  }

  decrementPlayersReady() {
    this.numPlayersReady--
    if (this.numPlayersReady < 0) this.numPlayersReady = 0
    return this.numPlayersReady;
  }

  incrementPlayersFinishedSetup() {
    this.numPlayersFinishedSetup++
    if (this.numPlayersFinishedSetup > this.numPlayersTotal) this.numPlayersFinishedSetup = this.numPlayersTotal
    return this.numPlayersFinishedSetup;
  }

  decrementPlayersFinishedSetup() {
    this.numPlayersFinishedSetup--
    if (this.numPlayersFinishedSetup < 0) this.numPlayersFinishedSetup = 0
    return this.numPlayersFinishedSetup;
  }

  clearTeams() {
    this.team1.resetTeam()
    this.team2.resetTeam()
    this.numPlayersReady = 0;
    this.numPlayersFinishedSetup = 0
    this.players.forEach(player => player.isReady = false)
  }

  startGame() {
    // All players must be ready
    if (this.numPlayersReady !== this.numPlayersTotal) throw new PlayersNotReadyError(this.numPlayersReady, this.numPlayersTotal)

    this.initPlayerDecks();
    this.initPlayerFields();
    
    this.setStarted(true)
  }

  initPlayerDecks() {
    this.players.forEach(player => player.initDeck())
  }

  initPlayerFields() {
    const team1Decklists = this.team1.getAllPlayerDecklists()
    const team2Decklists = this.team2.getAllPlayerDecklists()

    this.team1.initBattlefield(team1Decklists)
    this.team2.initBattlefield(team2Decklists)
  }
}