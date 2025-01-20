"use strict";
// Command of Nature (C.O.N)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConGame = void 0;
const Team_1 = require("./Team");
class ConGame {
    constructor(gameId, numPlayers) {
        this.isStarted = false;
        this.numPlayersReady = 0;
        this.numPlayersFinishedSetup = 0;
        this.players = [];
        this.creatureShop = [];
        this.itemShop = [];
        this.id = gameId;
        this.numPlayersTotal = numPlayers;
        const teamSize = numPlayers / 2;
        this.team1 = new Team_1.Team(teamSize, 1);
        this.team2 = new Team_1.Team(teamSize, 2);
    }
    setStarted(value) {
        this.isStarted = value;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    removePlayer(playerId) {
        this.players = this.players.filter((item) => item.id !== playerId);
    }
    getPlayer(playerId) {
        const player = this.players.find((item) => item.id === playerId);
        if (!player)
            throw new Error(`Player with socket ID ${playerId} not found in game ${this.id}`);
        return player;
    }
    setPlayerSage(playerId, sage) {
        const isSageAvailable = this.players.every(player => player.sage !== sage);
        if (!isSageAvailable)
            throw new Error("Selected Sage is unavailable");
        this.getPlayer(playerId).setSage(sage);
    }
    joinTeam(playerId, teamNumber) {
        const teamSelected = teamNumber === 1 ? this.team1 : this.team2;
        const player = this.getPlayer(playerId);
        teamSelected.addPlayerToTeam(player);
        player.setTeam(teamSelected);
    }
    startGame(playerId) {
        // Only host can start game
        if (!this.getPlayer(playerId).isGameHost)
            throw new Error(`Only the host can start the game`);
        // All players must be ready
        if (!this.players.every((player) => player.isReady))
            throw new Error(`All players must be ready before starting game`);
        // TODO: initlize game
        this.initPlayerDecks();
        this.initPlayerFields();
    }
    initPlayerDecks() {
        this.players.forEach(player => player.initDeck());
    }
    initPlayerFields() {
        const team1Decklists = this.team1.getAllPlayerDecklists();
        const team2Decklists = this.team2.getAllPlayerDecklists();
        this.team1.initBattlefield(team1Decklists);
        this.team2.initBattlefield(team2Decklists);
    }
    chooseWarriors(playerId, choices) {
        const player = this.getPlayer(playerId);
        const decklist = player.getDecklist();
        const [choice1, choice2] = choices;
        if (choice1.element !== decklist.sage.element ||
            choice2.element !== decklist.sage.element)
            throw new Error("Invalid cards passed for chosen deck");
        player.team.initWarriors(choices);
        // Add the non-chosen card to the player's deck
        decklist.warriors.forEach(card => {
            if ((card.name !== choice1.name) || (card.name !== choice2.name))
                player.addCardToDeck(card);
        });
    }
}
exports.ConGame = ConGame;
