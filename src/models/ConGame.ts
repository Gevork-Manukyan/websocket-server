// Command of Nature (C.O.N)

import { NotFoundError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { Sage, ElementalCard, gameId, ItemCard } from "../types";
import { Player } from "./Player";
import { Team } from "./Team";

type TeamOrder = {
  first: Team;
  second: Team;
}

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
  private teamOrder: TeamOrder;
  private currentTurnTeam: keyof TeamOrder = "first";
  creatureShop: ElementalCard[] = [];
  itemShop: ItemCard[] = [];

  constructor(gameId: ConGame['id'], numPlayers: ConGame['numPlayersTotal']) {
    this.id = gameId;
    this.numPlayersTotal = numPlayers;
    
    const teamSize = (numPlayers / 2) as Team['teamSize'];
    this.team1 = new Team(teamSize, 1)
    this.team2 = new Team(teamSize, 2)

    const teamOrder = Math.random() > 0.5 ? [this.team1, this.team2] : [this.team2, this.team1];
    this.teamOrder = {
      first: teamOrder[0],
      second: teamOrder[1]
    }
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

  getTeamGoingFirst() {
    return this.teamOrder.first;
  }

  getTeamGoingSecond() {
    return this.teamOrder.second;
  }

  getCurrentTurnTeam() {
    return this.teamOrder[this.currentTurnTeam];
  }

  toggleCurrentTurnTeam() {
    this.currentTurnTeam = this.currentTurnTeam === "first" ? "second" : "first";
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
    this.players.forEach(player => player.setIsReady(false))
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