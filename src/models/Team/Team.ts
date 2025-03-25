import { ConflictError, NotFoundError, ValidationError } from "../../services";
import { Card, Decklist, ElementalWarriorStarterCard, SpaceOption } from "../../types";
import { Battlefield } from "../Battlefield/Battlefield";
import { Player } from "../Player/Player";
import { ITeam } from './db-model';

export class Team {
    players: Player[];
    private battlefield: Battlefield;
    private teamNumber: 1 | 2;
    private teamSize: 1 | 2;
    private gold: number = 0;
    private maxGold: 12 | 20;
    private removedCards: Card[] = [];

  
    constructor(teamSize: Team['teamSize'], teamNumber: Team['teamNumber']) {
        this.players = [];
        this.battlefield = new Battlefield(teamSize);
        this.teamNumber = teamNumber;
        this.teamSize = teamSize;
        this.maxGold = teamSize === 1 ? 12 : 20;
    }

    /**
     * @returns The state of the team
     */
    getTeamState() {
        return {
            gold: this.gold,
            battlefield: this.battlefield.getBattlefieldState()
        }
    }

    /**
     * Resets the team by removing all players and resetting the battlefield
     */
    resetTeam() {
        this.players = []
        this.battlefield = new Battlefield(this.teamSize)
    }

    /**
     * @returns The battlefield of the team
     */
    getBattlefield() {
        return this.battlefield;
    }

    /**
     * @returns The players on the team
     */
    getTeamNumber() {
        return this.teamNumber;
    }

    /**
     * @returns The number of players on the team
     */
    getTeamSize() {
        return this.teamSize;
    }

    /**
     * @returns The gold the team has
     */
    getGold() {
        return this.gold;
    }
    
    /**
     * Sets the gold the team has
     * @param amount The amount of gold to set
     */
    private setGold(amount: number) {
        if (amount > this.maxGold) throw new ValidationError(`Team cannot have more than ${this.maxGold} gold`, "gold");
        this.gold = amount;
    }

    /**
     * Adds gold to the team
     * @param amount The amount of gold to add to the team
     */
    addGold(amount: number) {
        let newGoldAmount = this.gold + amount;
        if (newGoldAmount > this.maxGold) newGoldAmount = this.maxGold;
        this.setGold(newGoldAmount)
    }

    /**
     * Removes gold from the team
     * @param amount The amount of gold to remove from the team
     */
    removeGold(amount: number) {
        let newGoldAmount = this.gold - amount;
        if (newGoldAmount < 0) newGoldAmount = 0;
        this.setGold(newGoldAmount)
    }

    /**
     * @param playerId The socket ID of the player to check if they are on the team
     * @returns Whether the player is on the team
     */
    isPlayerOnTeam(playerId: Player["socketId"]) {
        return this.players.some(player => player.socketId === playerId)
    }

    /**
     * Adds a player to the team
     * @param player The player to add to the team
     */
    addPlayerToTeam(player: Player) {
        if (this.players.length === (this.teamSize)) throw new ConflictError(`Team ${this.teamNumber} is full`);
        this.players.push(player)
    }

    /**
     * Removes a player from the team
     * @param player The player to remove from the team
     */
    removePlayerFromTeam(player: Player) {
        this.players = Player.filterOutPlayerById(this.players, player.socketId);
    }

    /**
     * @returns The players on the team
     */
    getAllPlayerDecklists() {
        return this.players.map(player => {
            const decklist = player.getDecklist();
            if (decklist === null) throw new NotFoundError("Decklist", `Player ${player.socketId}'s decklist is not set`);
            return decklist;    
        });
    }

    /**
     * Returns the cards that have been removed from the battlefield
     * @returns The cards that have been removed from the battlefield
     */
    getRemovedCards() {
        return this.removedCards;
    }

    /**
     * Adds a card to the removedCards array
     * @param card The card to add to the removedCards array
     */
    addRemovedCard(card: Card) {
        this.removedCards.push(card);
    }
  
    /**
     * Initializes the battlefield with the decklists of the players on the team
     * @param decklists The decklists of the players on the team
     */
    initBattlefield(decklists: Decklist[]) {
        const [decklist1, decklist2] = decklists;

        // 2 Players (1 team member)
        if (this.teamSize === 1) {
            const basicStarter = decklist1.basic;
            this.battlefield.addCard(basicStarter, 1)
            this.battlefield.addCard(basicStarter, 2)
            this.battlefield.addCard(basicStarter, 3)
            this.battlefield.addCard(decklist1.sage, 5)
        }
        // 4 Players (2 team members)
        else if (decklist2 !== undefined && this.teamSize === 2) {
            const basicStarter1 = decklist1.basic
            const basicStarter2 = decklist2.basic

            this.battlefield.addCard(basicStarter1, 1)
            this.battlefield.addCard(basicStarter2, 2)
            
            this.battlefield.addCard(basicStarter1, 3)
            this.battlefield.addCard(basicStarter1, 4)
            this.battlefield.addCard(basicStarter2, 5)
            this.battlefield.addCard(basicStarter2, 6)

            this.battlefield.addCard(decklist1.sage, 8)
            this.battlefield.addCard(decklist2.sage, 11)
        }
    }

    /**
     * Chooses the warriors for a player
     * @param player The player to choose the warriors for
     * @param choices The choices of ElementalWarriorStarterCards to choose from
     */
    chooseWarriors(player: Player, choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
        // If player is not on team
        if (!this.isPlayerOnTeam(player.socketId))
            throw new ValidationError("Player is not on team", "INVALID_INPUT")
        
        // If player has already chosen warriors
        if (player.getHasChosenWarriors())
            throw new ValidationError("Player has already chosen warriors", "INVALID_INPUT")
        
        const decklist = player.getDecklist();
        if (decklist === null) throw new NotFoundError("Decklist", `Player ${player.socketId}'s decklist is not set`);
        const decklistWariors = decklist.warriors
        const [choice1, choice2] = choices
        
        // If chosen cards are the same
        if (choice1 === choice2)
            throw new ValidationError("Cannot choose the same warrior twice", "INVALID_INPUT")
        
        // If chosen cards are not of the correct deck
        if (!decklistWariors.includes(choice1) || !decklistWariors.includes(choice2)) 
            throw new ValidationError("Invalid warrior(s) passed for chosen deck", "INVALID_INPUT")
        
        this.initWarriors(choices)
        player.setHasChosenWarriors(true)

        // Add the non-chosen card to the player's deck
        decklist.warriors.forEach(card => {
            if ((card.name !== choice1.name) || (card.name !== choice2.name))
                player.addCardToDeck(card);
        })
    }

    /**
     * Initializes the battlefield with the ElementalWarriorStarterCards given
     * @param choices The choices of ElementalWarriorStarterCards to initialize the battlefield with
     */
    initWarriors(choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
        const [choice1, choice2] = choices;

        if (this.teamSize === 1) {
            this.battlefield.addCard(choice1, 4)
            this.battlefield.addCard(choice2, 6)
        } else {
            this.initWarriors2Decks(choices)
        }
    }

    /**
     * Initializes the battlefield with the ElementalWarriorStarterCards given for 2 players
     * @param choices The choices of ElementalWarriorStarterCards to initialize the battlefield with
     */
    private initWarriors2Decks(choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
        const [choice1, choice2] = choices;
        
        // If cards given are same class as left sage then place on left side
        if (choice1.element === this.battlefield.getCard(8)?.element) {
            this.battlefield.addCard(choice1, 7)
            this.battlefield.addCard(choice2, 9)
        }
        else if (choice1.element === this.battlefield.getCard(11)?.element) {
            this.battlefield.addCard(choice1, 10)
            this.battlefield.addCard(choice2, 12)
        }
    }

    /**
     * Swaps the warriors of the player on the team
     * @param player The player to swap the warriors of
     */
    swapWarriors(player: Player) {
        // If player is not on team
        if (!this.isPlayerOnTeam(player.socketId))
            throw new ValidationError("Player is not on team", "INVALID_INPUT")
        
        // One player on Team
        if (this.getTeamSize() === 1) {
            this.battlefield.swapCards(4, 6)
            return;
        }

        // Two players on Team
        if (player.getElement() === this.battlefield.getCard(8)?.element) {
            this.battlefield.swapCards(7, 9)
        }
        else if (player.getElement() === this.battlefield.getCard(11)?.element) {
            this.battlefield.swapCards(10, 12)
        } 
        else {
            throw new ValidationError("Player can only swap their own warriors", "element")
        }
    }


    /* ----- GAMEPLAY ----- */

    /**
     * @returns The cards on the battlefield that have a daybreak ability
     */
    getDayBreakCards(): SpaceOption[] {
        return this.battlefield.getDayBreakCards();
    }

    /**
     * Activates the daybreak ability of a card at a given position on the battlefield
     * @param spaceOption The position of the card to activate the daybreak ability of
     */
    activateDayBreak(spaceOption: SpaceOption) {
        return this.battlefield.activateDayBreak(spaceOption)
    }

    /**
     * Deals damage to a card at a given position on the battlefield and removes the card if it is dead
     * @param position The position of the card to deal damage to
     * @param amount The amount of damage to deal
     * @returns Whether the card is dead
     */
    damageCardAtPosition(position: SpaceOption, amount: number) {
        const isDead = this.battlefield.damageCardAtPosition(position, amount)
        if (isDead) {
            const removedCard = this.battlefield.removeCard(position);
            this.addRemovedCard(removedCard);
        }
        return isDead;
    }

    // Convert from Mongoose document to runtime instance
    static fromMongoose(doc: ITeam | Omit<ITeam, '_id'>): Team {
        const team = new Team(doc.teamSize, doc.teamNumber);

        team.players = doc.players.map(p => Player.fromMongoose(p));
        team.battlefield = Battlefield.fromMongoose(doc.battlefield);
        team.gold = doc.gold;
        team.maxGold = doc.maxGold;
        team.removedCards = doc.removedCards;

        return team;
    }

    // Convert runtime instance to plain object for Mongoose
    toMongoose(): Omit<ITeam, '_id'> {
        return {
            players: this.players.map(p => p.toMongoose()),
            battlefield: this.battlefield.toMongoose(),
            teamNumber: this.teamNumber,
            teamSize: this.teamSize,
            gold: this.gold,
            maxGold: this.maxGold,
            removedCards: this.removedCards
        } as Omit<ITeam, '_id'>;
    }
}