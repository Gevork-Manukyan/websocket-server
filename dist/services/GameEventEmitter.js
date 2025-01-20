"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventEmitter = void 0;
class GameEventEmitter {
    constructor(io) {
        this.io = io;
    }
    emitToPlayer(playerId, eventName, data) {
        this.io.to(playerId).emit(eventName, data);
    }
    emitToRoom(roomId, eventName, data) {
        this.io.to(roomId).emit(eventName, data);
    }
    emitPickWarriors(players) {
        players.forEach(player => {
            this.emitToPlayer(player.id, "pick-warriors", player.decklist);
        });
    }
}
exports.GameEventEmitter = GameEventEmitter;
