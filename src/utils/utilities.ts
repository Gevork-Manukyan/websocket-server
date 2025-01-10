import { Game, Player } from "./types";

export function createGame(gameId: Game['id']): Game {
    return {
        id: gameId,
        players: [],
    }
}

export function createPlayer(socketId: Player['id']): Player {
    return {
        id: socketId,
    }
}