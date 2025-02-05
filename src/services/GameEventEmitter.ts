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

  emitTeamOrder(roomId: gameId, firstTeam: Team['teamNumber']) {
    this.emitToRoom(roomId, "team-order", firstTeam);
  }

  emitChoosePlayerOrder(roomId: gameId) {
    this.emitToRoom(roomId, "choose-player-order");
  }

  emitBeginBattle(roomId: gameId) {
    this.emitToRoom(roomId, "begin-battle");
  }
}
 
export const gameEventEmitter = GameEventEmitter.getInstance();