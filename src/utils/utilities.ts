import { ConGame } from "../CONGame/ConGame";
import { Player } from "../CONGame/Player";
import { CurrentGames } from "./types";


export function getPlayer(
  currentGames: CurrentGames,
  gameId: ConGame["id"],
  playerId: Player["id"]
) {
  return currentGames[gameId].players.find((player) => player.id === playerId);
}
