// Command of Nature (C.O.N)

import { NotFoundError, ValidationError } from "../../services";
import { 
  NotEnoughGoldError, PlayersNotReadyError, 
  SageUnavailableError, ShopFullError 
} from "../../services";
import { Sage, ElementalCard, gameId, ItemCard, SpaceOption, TeamOrder } from "../../types";
import { drawCardFromDeck } from "../../lib";
import { Player } from "../Player/Player";
import { Team } from "../Team/Team";
import { ALL_CARDS, processAbility } from "../../constants";
import { IConGame } from './db-model';

const { BambooBerserker, Bruce, CackleRipclaw, CamouChameleon, CurrentConjurer, Dewy, DistantDoubleStrike, ElementalIncantation, ElementalSwap, ExchangeOfNature, FarsightFrenzy, Flint, FocusedFury, ForageThumper, Herbert, HummingHerald, IguanaGuard, LumberClaw, MagicEtherStrike, MeleeShield, MossViper, Mush, NaturalDefense, NaturesWrath, OakLumbertron, Obliterate, PineSnapper, PrimitiveStrike, ProjectileBlast, RangedBarrier, Redstone, ReinforcedImpact, RoamingRazor, Rocco, RubyGuardian, RunePuma, ShrubBeetle, SplashBasilisk, SplinterStinger, StoneDefender, SurgesphereMonk, TerrainTumbler, TwineFeline, TyphoonFist, Wade, WhirlWhipper, Willow } = ALL_CARDS;

type ShopIndex = 0 | 1 | 2;

// Plain interfaces for data structure
type ConGameData = {
  id: string;
  isStarted: boolean;
  hasFinishedSetup: boolean;
  numPlayersTotal: 2 | 4;
  numPlayersReady: number;
  numPlayersFinishedSetup: number;
  players: Player[];
  team1: Team;
  team2: Team;
  teamOrder: TeamOrder;
  creatureShop: ElementalCard[];
  itemShop: ItemCard[];
  currentCreatureShopCards: ElementalCard[];
  currentItemShopCards: ItemCard[];
}

type ActiveConGameData = ConGameData & {
  activeTeam: 'first' | 'second';
  currentPhase: 'phase1' | 'phase2' | 'phase3' | 'phase4';
  actionPoints: number;
  maxActionPoints: 3 | 6;
}

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
    this.players = Player.filterOutPlayerById(this.players, playerId);
  }

  getPlayer(playerId: Player["id"]): Player {
    const player = this.players.find((item) => item.id === playerId);
    if (!player)
      throw new NotFoundError(
        "Player",
        `Player with ID ${playerId} not found in game ${this.id}`
      );
      
    return player;
  }

  setPlayerSage(playerId: Player["id"], sage: Sage) {
    const isSageAvailable = this.players.every(player => player.getSage() !== sage)
    if (!isSageAvailable) throw new SageUnavailableError(sage);

    this.getPlayer(playerId).setSage(sage)
  }

  /**
   * @param playerId The id of the player to get the team of
   * @returns The team the player is on
   */
  getPlayerTeam(playerId: Player["id"]) {
    const playerTeam = 
      this.team1.isPlayerOnTeam(playerId) ? this.team1 : 
      this.team2.isPlayerOnTeam(playerId) ? this.team2 : null;

    if (!playerTeam) throw new NotFoundError("Team", "Player does not have a team")
    return playerTeam;
  }

  /**
   * @param playerId The id of the player to get the teammate of
   * @returns The teammate of the player
   */
  getPlayerTeammate(playerId: Player["id"]) {
    const playerTeam = this.getPlayerTeam(playerId);
    if (playerTeam.players.length === 1) throw new ValidationError("Player has no teammates", "playerTeammate")
    const teammate = Player.findOtherPlayerById(playerTeam.players, playerId);
    if (!teammate) throw new NotFoundError("Player", "Could not find teammate");
    return teammate;
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

  getOpposingTeam(team: Team) {
    return team === this.team1 ? this.team2 : this.team1;
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
    const currTeam = this.getPlayerTeam(playerId);
    if (currTeam !== null) currTeam.removePlayerFromTeam(player)

    teamSelected.addPlayerToTeam(player);
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

  // Protected helper for Mongoose conversion
  protected static getBaseDataFromMongoose(doc: IConGame): ConGameData {
    return {
      id: doc._id.toString(),
      isStarted: doc.isStarted,
      hasFinishedSetup: doc.hasFinishedSetup,
      numPlayersTotal: doc.numPlayersTotal,
      numPlayersReady: doc.numPlayersReady,
      numPlayersFinishedSetup: doc.numPlayersFinishedSetup,
      players: doc.players.map(p => Player.fromMongoose(p)),
      team1: Team.fromMongoose(doc.team1),
      team2: Team.fromMongoose(doc.team2),
      teamOrder: doc.teamOrder,
      creatureShop: doc.creatureShop,
      itemShop: doc.itemShop,
      currentCreatureShopCards: doc.currentCreatureShopCards,
      currentItemShopCards: doc.currentItemShopCards
    };
  }

  // Convert from Mongoose document to runtime instance
  static fromMongoose(doc: IConGame): ConGame {
    return ConGame.fromData(ConGame.getBaseDataFromMongoose(doc));
  }

  // Create instance from plain data
  static fromData(data: ConGameData): ConGame {
    const game = new ConGame(data.id, data.numPlayersTotal);
    
    // Copy all properties
    Object.assign(game, {
      isStarted: data.isStarted,
      hasFinishedSetup: data.hasFinishedSetup,
      numPlayersReady: data.numPlayersReady,
      numPlayersFinishedSetup: data.numPlayersFinishedSetup,
      players: data.players,
      team1: data.team1,
      team2: data.team2,
      teamOrder: data.teamOrder,
      creatureShop: data.creatureShop,
      itemShop: data.itemShop,
      currentCreatureShopCards: data.currentCreatureShopCards,
      currentItemShopCards: data.currentItemShopCards
    });

    return game;
  }

  // Convert runtime instance to plain object for Mongoose
  toMongoose(): Omit<IConGame, '_id'> {
    return {
      isStarted: this.isStarted,
      hasFinishedSetup: this.hasFinishedSetup,
      numPlayersTotal: this.numPlayersTotal,
      numPlayersReady: this.numPlayersReady,
      numPlayersFinishedSetup: this.numPlayersFinishedSetup,
      players: this.players.map(p => p.toMongoose()),
      team1: this.team1.toMongoose(),
      team2: this.team2.toMongoose(),
      teamOrder: this.teamOrder,
      creatureShop: this.creatureShop,
      itemShop: this.itemShop,
      currentCreatureShopCards: this.currentCreatureShopCards,
      currentItemShopCards: this.currentItemShopCards,
      isActive: false
    } as Omit<IConGame, '_id'>;
  }
}


/* ------------ Active ConGame ------------ */
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
    const teammate = this.getPlayerTeammate(playerId);
    const team = this.getPlayerTeam(playerId);

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
    return this.getPlayerTeam(playerId).getDayBreakCards();
  }

  /**
   * Activates the daybreak ability the player chooses
   * @param playerId
   * @param spaceOption 
   */
  activateDayBreak(playerId: Player['id'], spaceOption: SpaceOption) {
    const abilityResult = this.getPlayerTeam(playerId).activateDayBreak(spaceOption);
    processAbility(this, abilityResult)
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
    const playerTeam = this.getPlayerTeam(playerId);
    const card = currentShopCards[shopIndex];
    const cost = card.price;
    if (playerTeam.getGold() < cost) throw new NotEnoughGoldError();

    player.addCardToDeck(card);
    playerTeam.removeGold(cost);
    currentShopCards.splice(shopIndex, 1);
    if (shop === this.creatureShop) this.addCardToCreatureShop();
    else this.addCardToItemShop();
  }

  // Convert from Mongoose document to runtime instance
  static fromMongoose(doc: IConGame): ActiveConGame {
    if (!doc.isActive) {
      throw new Error('Document is not an active game');
    }

    const data: ActiveConGameData = {
      ...ConGame.getBaseDataFromMongoose(doc),
      activeTeam: doc.activeTeam!,
      currentPhase: doc.currentPhase!,
      actionPoints: doc.actionPoints!,
      maxActionPoints: doc.maxActionPoints!
    };

    return ActiveConGame.fromData(data);
  }

  // Create instance from plain data
  static fromData(data: ActiveConGameData): ActiveConGame {
    const game = new ActiveConGame(ConGame.fromData(data));
    
    // Copy active game properties
    Object.assign(game, {
      activeTeam: data.activeTeam,
      currentPhase: data.currentPhase,
      actionPoints: data.actionPoints,
      maxActionPoints: data.maxActionPoints
    });

    return game;
  }

  // Convert runtime instance to plain object for Mongoose
  toMongoose(): Omit<IConGame, '_id'> {
    return {
      ...super.toMongoose(),
      isActive: true,
      activeTeam: this.activeTeam,
      currentPhase: this.currentPhase,
      actionPoints: this.actionPoints,
      maxActionPoints: this.maxActionPoints
    };
  }
}