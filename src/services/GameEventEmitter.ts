import { Server, Socket, Namespace } from "socket.io";
import { Server as HttpServer } from "http";
import { gameId, Sage, SpaceOption, ElementalCard } from "../types";
import { Player, Team } from "../models";
import { GameStateManager } from "./GameStateManager";

export class GameEventEmitter {
  private static instance: GameEventEmitter;
  private io: Server | Namespace;
  private gameStateManager: GameStateManager;

  private constructor(io: Server | Namespace) {
    this.io = io;
    this.gameStateManager = GameStateManager.getInstance();
  }

  static getInstance(io: Server | Namespace): GameEventEmitter {
    if (!GameEventEmitter.instance) {
      GameEventEmitter.instance = new GameEventEmitter(io);
    }
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
      this.emitToPlayer(player.socketId, eventName, data);
    });
  }

  emitPickWarriors(players: Player[]) {
    players.forEach(player => {
      this.emitToPlayer(player.socketId, "pick-warriors", player.getDecklist());
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

  emitDayBreakCards(activeTeam: Team, dayBreakCards: SpaceOption[]) {
    this.emitToTeam(activeTeam, "day-break-cards", dayBreakCards);
  }
}