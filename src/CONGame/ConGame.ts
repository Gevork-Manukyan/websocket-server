// Command of Nature (C.O.N)

import { gameId, Player } from "../utils/types";

export class ConGame {
    id: gameId;
    players: Player[] = [];

    constructor(gameId: gameId) {
        this.id = gameId;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(playerId: Player["id"]) {
        this.players = this.players.filter((item) => item.id !== playerId);
    }
}