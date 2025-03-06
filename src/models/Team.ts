import { ConflictError, NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { Card, ElementalWarriorStarterCard } from "../types/card-types";
import { Decklist, SpaceOption } from "../types/types";
import { Battlefield } from "./Battlefield";
import { Player } from "./Player";

export class Team {
    players: Player[];
    battlefield: Battlefield;
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

    resetTeam() {
        this.players = []
        this.battlefield = new Battlefield(this.teamSize)
    }

    getTeamNumber() {
        return this.teamNumber;
    }

    getTeamSize() {
        return this.teamSize;
    }

    getGold() {
        return this.gold;
    }
    
    private setGold(amount: number) {
        if (amount > this.maxGold) throw new ValidationError(`Team cannot have more than ${this.maxGold} gold`, "gold");
        this.gold = amount;
    }

    addGold(amount: number) {
        let newGoldAmount = this.gold + amount;
        if (newGoldAmount > this.maxGold) newGoldAmount = this.maxGold;
        this.setGold(newGoldAmount)
    }

    removeGold(amount: number) {
        let newGoldAmount = this.gold - amount;
        if (newGoldAmount < 0) newGoldAmount = 0;
        this.setGold(newGoldAmount)
    }

    addPlayerToTeam(player: Player) {
        if (this.players.length === (this.teamSize)) throw new ConflictError(`Team ${this.teamNumber} is full`);
        this.players.push(player)
    }

    removePlayerFromTeam(player: Player) {
        this.players = this.players.filter(currPlayer => currPlayer.id !== player.id)
    }

    getAllPlayerDecklists() {
        return this.players.map(player => {
            const decklist = player.getDecklist();
            if (decklist === null) throw new NotFoundError("Decklist", `Player ${player.id}'s decklist is not set`);
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

    initWarriors(choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]) {
        const [choice1, choice2] = choices;

        if (this.teamSize === 1) {
            this.battlefield.addCard(choice1, 4)
            this.battlefield.addCard(choice2, 6)
        } else {
            this.initWarriors2Decks(choices)
        }
    }

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

    swapWarriors(player: Player) {
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

    getTeamState() {
        return {
            gold: this.gold,
            battlefield: this.battlefield.getBattlefieldState()
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
        this.battlefield.activateDayBreak(spaceOption)
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
}