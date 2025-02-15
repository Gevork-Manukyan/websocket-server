"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const Battlefield_1 = require("./Battlefield");
class Team {
    constructor(teamSize, teamNumber) {
        this.players = [];
        this.battlefield = new Battlefield_1.Battlefield(teamSize);
        this.teamNumber = teamNumber;
        this.teamSize = teamSize;
    }
    addPlayerToTeam(player) {
        if (this.players.length === (this.teamSize))
            throw new Error(`Team ${this.teamNumber} is full`);
        this.players.push(player);
    }
    getAllPlayerDecklists() {
        return this.players.map(player => {
            const decklist = player.getDecklist();
            if (decklist === null)
                throw Error(`Player ${player.id} decklist not set`);
            return decklist;
        });
    }
    initBattlefield(decklists) {
        const [decklist1, decklist2] = decklists;
        // 2 Players (1 team member)
        if (this.teamSize === 1) {
            const basicStarter = decklist1.basic;
            this.battlefield.addCard(basicStarter, 1);
            this.battlefield.addCard(basicStarter, 2);
            this.battlefield.addCard(basicStarter, 3);
            this.battlefield.addCard(decklist1.sage, 5);
        }
        // 4 Players (2 team members)
        else if (decklist2 !== undefined && this.teamNumber === 2) {
            const basicStarter1 = decklist1.basic;
            const basicStarter2 = decklist2.basic;
            this.battlefield.addCard(basicStarter1, 1);
            this.battlefield.addCard(basicStarter2, 2);
            this.battlefield.addCard(basicStarter1, 3);
            this.battlefield.addCard(basicStarter1, 4);
            this.battlefield.addCard(basicStarter2, 5);
            this.battlefield.addCard(basicStarter2, 6);
            this.battlefield.addCard(decklist1.sage, 8);
            this.battlefield.addCard(decklist2.sage, 11);
        }
    }
    initWarriors(choices) {
        if (this.teamNumber === 1) {
            this.battlefield.addCard(choices[0], 4);
            this.battlefield.addCard(choices[0], 6);
        }
        else {
            this.initWarriors2Decks(choices);
        }
    }
    initWarriors2Decks(choices) {
        const [choice1, choice2] = choices;
        // If cards given are same class as left sage then place on left side
        if (choice1.element === this.battlefield.getCard(8)?.element) {
            this.battlefield.addCard(choice1, 7);
            this.battlefield.addCard(choice2, 9);
        }
        else if (choice1.element === this.battlefield.getCard(9)?.element) {
            this.battlefield.addCard(choice1, 10);
            this.battlefield.addCard(choice2, 12);
        }
    }
}
exports.Team = Team;
