// Command of Nature (C.O.N)

import { ElementalCard, gameId, ItemCard } from "../utils/types";
import { Player } from "./Player";

export class ConGame {
    id: gameId;
    isStarted: boolean = false;
    players: Player[] = [];
    creatureShop: ElementalCard[] = [];
    itemShop: ItemCard[] = [];

    constructor(gameId: gameId) {
        this.id = gameId;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(playerId: Player["id"]) {
        this.players = this.players.filter((item) => item.id !== playerId);
    }

    startGame(playerId: Player["id"]): boolean {
        // Only host can start game
        if (!this.getPlayer(playerId).isGameHost) return false;
        
        // All players must be ready
        if (!this.players.every(player => player.isReady)) return false;

        // TODO: initlize game


        this.isStarted = true;
        return true;
    }

    getPlayer(playerId: Player["id"]): Player {
        const player = this.players.find(item => item.id === playerId)
        if (!player) throw new Error(`Player with socket ID ${playerId} not found in game ${this.id}`);
        return player;
    }
}