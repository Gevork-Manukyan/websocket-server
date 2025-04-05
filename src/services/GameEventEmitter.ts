import { Server, Socket, Namespace } from "socket.io";
import { gameId, Sage, SpaceOption } from "../types";
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

  emitToPlayers(players: Player[], eventName: string, data: any = null) {
    players.forEach(player => {
      this.emitToPlayer(player.socketId, eventName, data);
    });
  }

  emitToRoom(roomId: gameId, eventName: string, data: any = null) {
    this.io.in(roomId).emit(eventName, data);
  }

  emitPickWarriors(gameId: gameId) {
    const game = this.gameStateManager.getGame(gameId);
    game.players.forEach(player => {
      this.emitToPlayer(player.socketId, "pick-warriors", player.getDecklist());
    })
  }

  emitSageSelected(socket: Socket, roomId: gameId, sage: Sage) {
    socket.to(roomId).emit("sage-selected", sage);
  }

  emitAllSagesSelected(roomId: gameId) {
    this.emitToRoom(roomId, "all-sages-selected");
  }

  emitAllTeamsJoined(roomId: gameId) {
    this.emitToRoom(roomId, "all-teams-joined");
  }

  emitTeamJoined(roomId: gameId, team: Team['teamNumber']) {
    this.emitToRoom(roomId, "team-joined", team);
  }
  
  emitStartTurn(activePlayers: Player[], waitingPlayers: Player[]) {
    this.emitToPlayers(activePlayers, "start-turn");
    this.emitToPlayers(waitingPlayers, "waiting-turn");
  }

  emitDayBreakCards(activePlayers: Player[], dayBreakCards: SpaceOption[]) {
    this.emitToPlayers(activePlayers, "day-break-cards", dayBreakCards);
  }
}