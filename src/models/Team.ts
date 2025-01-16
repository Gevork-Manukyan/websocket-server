import { Decklist } from "../types/types";
import { Battlefield } from "./Battlefield";
import { Player } from "./Player";

export class Team {
    private static instanceCount = 0;
    teamNumber: 1 | 2;
    teamSize: 1 | 2;
    players: Player[];
    battlefield: Battlefield;
  
    constructor(teamSize: Team['teamSize']) {
        if (Team.instanceCount >= 2) 
            throw new Error("Only two instances of Team are allowed")
        Team.instanceCount++;
        this.teamNumber = Team.instanceCount as Team['teamNumber'];
        this.players = [];
        this.battlefield = new Battlefield([]);
        this.teamSize = teamSize;
    }

    // Method to reset the instance count if necessary
    static resetInstanceCount() {
        Team.instanceCount = 0;
    }

    addPlayerToTeam(player: Player) {
        if (this.players.length === (this.teamSize)) throw new Error(`Team ${this.teamNumber} is full`);
        this.players.push(player)
    }

    getAllPlayerDecklists() {
        return this.players.map(player => {
            const decklist = player.getDecklist();
            if (decklist === null) throw Error(`Player ${player.id} decklist not set`)
            return decklist;    
        });
    }
  
    initBattlefield(decklists: Decklist[]) {
        const [decklist1, decklist2] = decklists;

        // 4 Players (2 team members)
        if (decklist2 !== undefined) {
            const basicStarter1 = decklist1.basic
            const basicStarter2 = decklist2.basic

            this.battlefield.addCard(basicStarter1, 1)
            this.battlefield.addCard(basicStarter2, 2)
            
            this.battlefield.addCard(basicStarter1, 3)
            this.battlefield.addCard(basicStarter1, 4)
            this.battlefield.addCard(basicStarter2, 5)
            this.battlefield.addCard(basicStarter2, 6)

            this.battlefield.addCard(decklist1.sage, 8)
            this.battlefield.addCard(decklist2.sage, 9)
        }
        // 2 Players (1 team member)
        else {
            const basicStarter = decklist1.basic;
            this.battlefield.addCard(basicStarter, 1)
            this.battlefield.addCard(basicStarter, 2)
            this.battlefield.addCard(basicStarter, 3)
            this.battlefield.addCard(decklist1.sage, 5)
        }
    }
  }