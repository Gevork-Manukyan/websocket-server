import { CurrentGames, Game, Player } from "./types";

/* ----- GAME ----- */
export function createGame(gameId: Game["id"]): Game {
  return {
    id: gameId,
    players: [],
    addPlayer(player: Player) {
      this.players.push(player);
    },
    removePlayer(playerId: Player["id"]) {
      this.players = this.players.filter((item) => item.id !== playerId);
    },
  };
}

/* ----- PLAYER ----- */
export function createPlayer(socketId: Player["id"], gameHost = false): Player {
  return {
    id: socketId,
    isReady: false,
    isGameHost: gameHost,
    toggleReady() {
      this.isReady = !this.isReady;
    },
  };
}

export function getPlayer(
  currentGames: CurrentGames,
  gameId: Game["id"],
  playerId: Player["id"]
) {
  return currentGames[gameId].players.find((player) => player.id === playerId);
}
