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

  emitToAllPlayers(gameId: gameId, eventName: string, data: any = null) {
    this.io.in(gameId).emit(eventName, data);
  }

  emitPickWarriors(gameId: gameId) {
    const game = this.gameStateManager.getGame(gameId);
    game.players.forEach(player => {
      this.emitToPlayer(player.socketId, "pick-warriors", player.getDecklist());
    })
  }
  
  emitStartTurn(activePlayers: Player[], waitingPlayers: Player[]) {
    this.emitToPlayers(activePlayers, "start-turn");
    this.emitToPlayers(waitingPlayers, "waiting-turn");
  }
}