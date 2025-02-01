// Command of Nature (C.O.N)

import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { Sage, ElementalCard, gameId, ItemCard, ElementalWarriorCard } from "../types";
import { ElementalWarriorStarterCard } from "../types/card-types";
import { Player } from "./Player";
import { Team } from "./Team";

export class ConGame {
  id: gameId;
  isStarted: Boolean = false;
  numPlayersTotal: 2 | 4;
  numPlayersReady: number = 0;
  numPlayersFinishedSetup: number = 0; // TODO: never incremended/decremented
  players: Player[] = [];
  team1: Team;
  team2: Team;
  creatureShop: ElementalCard[] = [];
  itemShop: ItemCard[] = [];

  constructor(gameId: ConGame['id'], numPlayers: ConGame['numPlayersTotal']) {
    this.id = gameId;
    this.numPlayersTotal = numPlayers;
    
    const teamSize = numPlayers / 2;
    this.team1 = new Team(teamSize as Team['teamSize'], 1)
    this.team2 = new Team(teamSize as Team['teamSize'], 2)
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
    const isSageAvailable = this.players.every(player => player.sage !== sage)
    if (!isSageAvailable) throw new SageUnavailableError(sage);

    this.getPlayer(playerId).setSage(sage)
  }

  joinTeam(playerId: Player['id'], teamNumber: Team['teamNumber']) {
    const teamSelected = teamNumber === 1 ? this.team1 : this.team2;
    const player = this.getPlayer(playerId);

    // Check if already on team
    const currTeam = player.team;
    if (currTeam !== null) currTeam.removePlayerFromTeam(player)

    teamSelected.addPlayerToTeam(player);
    player.setTeam(teamSelected);
  }

  incrementPlayersReady() {
    this.numPlayersReady++
    return this.numPlayersReady;
  }

  decrementPlayersReady() {
    this.numPlayersReady--
    return this.numPlayersReady;
  }

  incrementPlayersFinishedSetup() {
    this.numPlayersFinishedSetup++
    return this.numPlayersFinishedSetup;
  }

  decrementPlayersFinishedSetup() {
    this.numPlayersFinishedSetup--
    return this.numPlayersFinishedSetup;
  }

  clearTeams() {
    this.team1.resetTeam()
    this.team2.resetTeam()
    this.numPlayersReady = 0;
    this.numPlayersFinishedSetup = 0
    this.players.forEach(player => player.isReady = false)
  }

  startGame(playerId: Player["id"]) {
    // All players must be ready
    if (this.numPlayersReady !== this.numPlayersTotal) throw new PlayersNotReadyError(this.numPlayersReady, this.numPlayersTotal)

    // TODO: initlize game
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

  chooseWarriors(playerId: Player["id"], choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
    const player = this.getPlayer(playerId)
    const decklist = player.getDecklist()!
    const decklistWariors = decklist.warriors
    const [choice1, choice2] = choices

    // If chosen cards are not of the correct deck
    if (!decklistWariors.includes(choice1) || !decklistWariors.includes(choice2)) 
      throw new ValidationError("Invalid warrior(s) passed for chosen deck", "INVALID_INPUT")
    
    player.team!.initWarriors(choices)

    // Add the non-chosen card to the player's deck
    decklist.warriors.forEach(card => {
      if ((card.name !== choice1.name) || (card.name !== choice2.name))
        player.addCardToDeck(card);
    })
  }

  swapWarriors(playerId: Player["id"]) {
    const player = this.getPlayer(playerId)
    const team = player.team

    if (!team) throw new NotFoundError("Team", "Player requires a team before swapping warriors")
    
    team.swapWarriors(player.getElement())
  }
}