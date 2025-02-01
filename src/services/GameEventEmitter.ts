import { Server } from "socket.io";
import { Player } from "../models";

export class GameEventEmitter {
    private io: Server;
  
    constructor(io: Server) {
      this.io = io;
    }
  
    emitToPlayer(playerId: string, eventName: string, data: any) {
      this.io.to(playerId).emit(eventName, data);
    }
  
    emitToRoom(roomId: string, eventName: string, data: any) {
      this.io.to(roomId).emit(eventName, data);
    }
  
    emitPickWarriors(players: Player[]) {
      players.forEach(player => {
        this.emitToPlayer(player.id, "pick-warriors", player.decklist);
      })
    }

    
  }
  