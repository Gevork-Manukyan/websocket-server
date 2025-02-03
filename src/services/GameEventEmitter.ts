import { Server, Socket } from "socket.io";
import { Player } from "../models";
import { Team } from "../models/Team";
import { gameId, Sage } from "../types";

export class GameEventEmitter {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  emitToPlayer(playerId: string, eventName: string, data: any) {
    this.io.to(playerId).emit(eventName, data);
  }

  emitToRoom(roomId: gameId, eventName: string, data: any) {
    this.io.to(roomId).emit(eventName, data);
  }

  emitPickWarriors(players: Player[]) {
    players.forEach(player => {
      this.emitToPlayer(player.id, "pick-warriors", player.decklist);
    })
  }

  emitSageSelected(socket: Socket, roomId: gameId, sage: Sage) {
    socket.to(roomId).emit("sage-selected", sage);
  }

  emitTeamOrder(roomId: gameId) {
    const firstTeam: Team['teamNumber'] = Math.random() > 0.5 ? 1 : 2;
    this.emitToRoom(roomId, "team-order", firstTeam);
  }

  emitChoosePlayerOrder(roomId: gameId) {
    this.emitToRoom(roomId, "choose-player-order", null);
  }
}
  