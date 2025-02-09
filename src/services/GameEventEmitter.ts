import { Server, Socket } from "socket.io";
import { Player } from "../models";
import { Team } from "../models/Team";
import { gameId, Sage } from "../types";

class GameEventEmitter {
  private static instance: GameEventEmitter;
  private io!: Server;

  private constructor() {}

  static getInstance() {
    if (!GameEventEmitter.instance) 
      GameEventEmitter.instance = new GameEventEmitter()

    return GameEventEmitter.instance;
  }

  emitToPlayer(playerId: string, eventName: string, data: any = null) {
    this.io.to(playerId).emit(eventName, data);
  }

  emitToRoom(roomId: gameId, eventName: string, data: any = null) {
    this.io.in(roomId).emit(eventName, data);
  }

  emitPickWarriors(players: Player[]) {
    players.forEach(player => {
      this.emitToPlayer(player.id, "pick-warriors", player.getDecklist());
    })
  }

  emitSageSelected(socket: Socket, roomId: gameId, sage: Sage) {
    socket.to(roomId).emit("sage-selected", sage);
  }

  emitTeamOrder(roomId: gameId, firstTeam: Team) {
    // TODO: Emit to all players on team going first. Emit to other team they are waiting.
    // this.emitToRoom(roomId, "team-order", firstTeam);
  }

  emitBeginBattle(roomId: gameId, firstTurnPlayer: Player) {
    const { id, ...cleanPlayer } = firstTurnPlayer
    this.emitToRoom(roomId, "begin-battle", cleanPlayer);
  }
}
 
export const gameEventEmitter = GameEventEmitter.getInstance();