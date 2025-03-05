// Command of Nature (C.O.N)

import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { NotEnoughGoldError, PlayersNotReadyError, SageUnavailableError, ShopFullError } from "../services/CustomError/GameError";
import { Sage, ElementalCard, gameId, ItemCard } from "../types";
import { Decklist, SpaceOption } from "../types/types";
import { BambooBerserker, Bruce, CackleRipclaw, CamouChameleon, CurrentConjurer, Dewy, DistantDoubleStrike, ElementalIncantation, ElementalSwap, ExchangeOfNature, FarsightFrenzy, Flint, FocusedFury, ForageThumper, Herbert, HummingHerald, IguanaGuard, LumberClaw, MagicEtherStrike, MeleeShield, MossViper, Mush, NaturalDefense, NaturesWrath, OakLumbertron, Obliterate, PineSnapper, PrimitiveStrike, ProjectileBlast, RangedBarrier, Redstone, ReinforcedImpact, RoamingRazor, Rocco, RubyGuardian, RunePuma, ShrubBeetle, SplashBasilisk, SplinterStinger, StoneDefender, SurgesphereMonk, TerrainTumbler, TwineFeline, TyphoonFist, Wade, WhirlWhipper, Willow } from "../constants/cards";
import { drawCardFromDeck } from "../lib/utilities";
import { Player } from "./Player";
import { Team } from "./Team";

type TeamOrder = {
  first: Team;
  second: Team;
}

type ShopIndex = 0 | 1 | 2;

export class ConGame {
  id: gameId;
  isStarted: boolean = false;
  protected hasFinishedSetup: boolean = false;
  numPlayersTotal: 2 | 4;
  numPlayersReady: number = 0;
  numPlayersFinishedSetup: number = 0;
  players: Player[] = [];
  team1: Team;
  team2: Team;
  protected teamOrder: TeamOrder;
  protected creatureShop: ElementalCard[] = [];
  protected currentCreatureShopCards: ElementalCard[] = [];
  protected itemShop: ItemCard[] = [];
  protected currentItemShopCards: ItemCard[] = [];

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

  setStarted(value: boolean) {
    this.isStarted = value;
  }

  getHasFinishedSetup() {
    return this.hasFinishedSetup;
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

  getCreatureShop() {
    return this.creatureShop;
  }

  getCurrentCreatureShopCards() {
    return this.currentCreatureShopCards;
  }

  addCardToCreatureShop() {
    this.addCardToShop(this.creatureShop, this.currentCreatureShopCards);
  }

  getItemShop() {
    return this.itemShop;
  }

  getCurrentItemShopCards() {
    return this.currentItemShopCards;
  }

  addCardToItemShop() {
    this.addCardToShop(this.itemShop, this.currentItemShopCards);
  }

  private addCardToShop<T extends ElementalCard | ItemCard>(shop: T[], currentShopCards: T[]) {
    const shopType = shop === this.creatureShop ? "creature" : "item";
    if (shop.length === 3) throw new ShopFullError(shopType);
    
    const card = drawCardFromDeck(shop);
    currentShopCards.push(card);
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

  initGame() {
    // All players must be ready
    if (this.numPlayersReady !== this.numPlayersTotal) throw new PlayersNotReadyError(this.numPlayersReady, this.numPlayersTotal)

    this.initPlayerDecks();
    this.initPlayerHands();
    this.initPlayerFields();
    this.initCreatureShop();
    this.initItemShop();
    
    this.setStarted(true)
  }

  initPlayerDecks() {
    this.players.forEach(player => player.initDeck())
  }

  initPlayerHands() {
    this.players.forEach(player => player.initHand())
  }

  initPlayerFields() {
    const team1Decklists = this.team1.getAllPlayerDecklists()
    const team2Decklists = this.team2.getAllPlayerDecklists()

    this.team1.initBattlefield(team1Decklists)
    this.team2.initBattlefield(team2Decklists)
  }

  initCreatureShop() {
    this.creatureShop = [
      Willow,
      Willow,
      Bruce,
      Bruce,
      OakLumbertron,
      TwineFeline,
      CamouChameleon,
      LumberClaw,
      SplinterStinger,
      PineSnapper,
      Rocco,
      Rocco,
      Flint,
      Flint,
      CackleRipclaw,
      Redstone,
      RunePuma,
      StoneDefender,
      TerrainTumbler,
      RubyGuardian,
      Mush,
      Mush,
      Herbert,
      Herbert,
      MossViper,
      BambooBerserker,
      IguanaGuard,
      HummingHerald,
      ShrubBeetle,
      ForageThumper,
      Dewy,
      Dewy,
      Wade,
      Wade,
      RoamingRazor,
      CurrentConjurer,
      TyphoonFist,
      WhirlWhipper,
      SurgesphereMonk,
      SplashBasilisk
    ]

    this.addCardToCreatureShop();
    this.addCardToCreatureShop();
    this.addCardToCreatureShop();
  }

  initItemShop() {
    this.itemShop = [
      DistantDoubleStrike,
      DistantDoubleStrike,
      FarsightFrenzy,
      FarsightFrenzy,
      FarsightFrenzy,
      FocusedFury,
      FocusedFury,
      FocusedFury,
      MagicEtherStrike,
      MagicEtherStrike,
      NaturesWrath,
      NaturesWrath,
      NaturesWrath,
      PrimitiveStrike,
      PrimitiveStrike,
      ProjectileBlast,
      ProjectileBlast,
      ProjectileBlast,
      ReinforcedImpact,
      ReinforcedImpact,
      ReinforcedImpact,
      ReinforcedImpact,
      ElementalIncantation,
      ElementalIncantation,
      ElementalSwap,
      ElementalSwap,
      ExchangeOfNature,
      ExchangeOfNature,
      Obliterate,
      Obliterate,
      NaturalDefense,
      NaturalDefense,
      NaturalDefense,
      NaturalDefense,
      RangedBarrier,
      RangedBarrier,
      RangedBarrier,
      MeleeShield,
      MeleeShield,
      MeleeShield,
    ]

    this.addCardToItemShop();
    this.addCardToItemShop();
    this.addCardToItemShop();
  }

  finishedSetup(): ActiveConGame {
    this.hasFinishedSetup = true;
    return new ActiveConGame(this);
  }
}

export class ActiveConGame extends ConGame {
  private activeTeam: keyof TeamOrder = "first";
  private currentPhase: "phase1" | "phase2" | "phase3" | "phase4" = "phase1";
  private actionPoints: number;
  private maxActionPoints: 3 | 6;

  constructor(conGame: ConGame) {
    super(conGame.id, conGame.numPlayersTotal);

    this.maxActionPoints = this.numPlayersTotal === 2 ? 3 : 6;
    this.actionPoints = this.maxActionPoints;
  }

  getGameState(playerId: Player['id']) {
    const isFourPlayers = this.numPlayersTotal === 4;

    const player = this.getPlayer(playerId);
    const teammate = player.getTeammate();
    const team = player.getTeam()!;

    const enemyTeam = team === this.team1 ? this.team2 : this.team1;
    const enemyTeamPlayer1 = enemyTeam.players[0];
    const enemyTeamPlayer2 = enemyTeam.players[1];

    const gameState = {
      game: {
        isTurn: this.getActiveTeam() === team,
        currentPhase: this.currentPhase,
        actionPoints: this.actionPoints,
        creatureShop: this.currentCreatureShopCards,
        itemShop: this.currentItemShopCards
      },
      team: team.getTeamState(),
      player: player.getPlayerState(),
      // If 4 players then add teammate info
      ...(isFourPlayers ? { teammate: teammate.getPlayerState() } : {}),
      enemyTeam: {
        team: enemyTeam.getTeamState(),
        player1: enemyTeamPlayer1.getPlayerState(),
        // If 4 players then add enemy player 2 info
        ...(isFourPlayers ? { player2: enemyTeamPlayer2.getPlayerState() } : {})
      }
    }
    
    return gameState;
  }

  getActiveTeam() {
    return this.teamOrder[this.activeTeam];
  }

  getWaitingTeam() {
    return this.teamOrder[this.activeTeam === "first" ? "second" : "first"];
  }

  toggleActiveTeam() {
    this.activeTeam = this.activeTeam === "first" ? "second" : "first";
  }

  getCurrentPhase() {
    return this.currentPhase;
  }

  endPhase1() {
    this.currentPhase = "phase2";
  }

  endPhase2() {
    this.currentPhase = "phase3";
  }

  endPhase3() {
    this.currentPhase = "phase4";
  }

  endPhase4() {
    // TODO: end turn and reset all variables
    this.currentPhase = "phase1";
    this.toggleActiveTeam();
    this.resetActionPoints();
  }

  getActionPoints() {
    return this.actionPoints;
  }

  resetActionPoints() {
    this.actionPoints = this.maxActionPoints;
  }

  decrementActionPoints() {
    if (this.actionPoints === 0) throw new ValidationError("Team has no action points left", "actionPoints");
    this.actionPoints -= 1;
  }

  getDayBreakCards(playerId: Player['id']): SpaceOption[] {
    return this.getPlayer(playerId).getTeam()!.getDayBreakCards();
  }

  activateDayBreak(playerId: Player['id'], spaceOption: SpaceOption) {
    const team = this.getPlayer(playerId).getTeam()!.activateDayBreak(spaceOption);
  }

  buyCreature(playerId: Player['id'], creatureShopIndex: ShopIndex) {
    this.buyCard(playerId, creatureShopIndex, this.creatureShop);
  }

  buyItem(playerId: Player['id'], itemShopIndex: ShopIndex) {
    this.buyCard(playerId, itemShopIndex, this.itemShop);
  }

  private buyCard(playerId: Player['id'], shopIndex: ShopIndex, shop: ElementalCard[] | ItemCard[]) {
    const currentShopCards = shop === this.creatureShop ? this.currentCreatureShopCards : this.currentItemShopCards;
    const player = this.getPlayer(playerId);
    const playerTeam = player.getTeam()!;
    const card = currentShopCards[shopIndex];
    const cost = card.price;
    if (playerTeam.getGold() < cost) throw new NotEnoughGoldError();

    player.addCardToDeck(card);
    playerTeam.removeGold(cost);
    currentShopCards.splice(shopIndex, 1);
    if (shop === this.creatureShop) this.addCardToCreatureShop();
    else this.addCardToItemShop();
  }

  
}