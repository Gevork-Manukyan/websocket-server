import { CurrentGames, Game, Player } from "./types";

export function createGame(gameId: Game['id']): Game {
    return {
        id: gameId,
        players: [],
    }
}

export function createPlayer(socketId: Player['id']): Player {
    return {
        id: socketId,
        readyStatus: false,
    }
}

export function getPlayer(currentGames: CurrentGames, gameId: Game['id'], playerId: Player['id']) {
    return currentGames[gameId].players.find(player => player.id === playerId)
}