import { ConGame } from "../models/ConGame";
import { Player } from "../models/Player";
import { CurrentGames } from "../types/types";

export function getPlayer(
  currentGames: CurrentGames,
  gameId: ConGame["id"],
  playerId: Player["id"]
) {
  return currentGames[gameId].players.find((player) => player.id === playerId);
}
