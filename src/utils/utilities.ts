import { ConGame } from "../CONGame/ConGame";
import { CurrentGames, Player } from "./types";

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
  gameId: ConGame["id"],
  playerId: Player["id"]
) {
  return currentGames[gameId].players.find((player) => player.id === playerId);
}
