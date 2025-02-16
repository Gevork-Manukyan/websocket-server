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

  emitToTeam(team: Team, eventName: string, data: any = null) {
    team.players.forEach(player => {
      this.emitToPlayer(player.id, eventName, data);
    });
  }

  emitPickWarriors(players: Player[]) {
    players.forEach(player => {
      this.emitToPlayer(player.id, "pick-warriors", player.getDecklist());
    })
  }

  emitSageSelected(socket: Socket, roomId: gameId, sage: Sage) {
    socket.to(roomId).emit("sage-selected", sage);
  }

  emitAllSagesSelected(roomId: gameId) {
    this.emitToRoom(roomId, "all-sages-selected");
  }

  emitTeamJoined(roomId: gameId, team: Team['teamNumber']) {
    this.emitToRoom(roomId, "team-joined", team);
  }
  
  emitStartTurn(activeTeam: Team, waitingTeam: Team) {
    this.emitToTeam(activeTeam, "start-turn");
    this.emitToTeam(waitingTeam, "waiting-turn");
  }
}
 
export const gameEventEmitter = GameEventEmitter.getInstance();