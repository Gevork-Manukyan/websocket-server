"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express")); // Import Express
const http_1 = __importDefault(require("http")); // Import Node.js HTTP module
const socket_io_1 = require("socket.io"); // Import types from Socket.IO
const constants_1 = require("./utils/constants");
const ConGame_1 = require("./models/ConGame");
const Player_1 = require("./models/Player");
const services_1 = require("./services");
const GameStateManager_1 = require("./services/GameStateManager");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(); // Create an HTTP server
exports.server = server;
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Allows for CORS
// const cors = require('cors');
// app.use(cors())
// Initialize the WebSocket server with CORS settings
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins (for development)
        methods: ["GET", "POST"], // Allowed HTTP methods
    },
});
exports.io = io;
const gameEventEmitter = new services_1.GameEventEmitter(io);
// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");
gameNamespace.on("connection", (socket) => {
    console.log("A player connected to the gameplay namespace");
    socket.on("join-game", (gameId, numPlayers) => {
        let gameRoom = GameStateManager_1.gameStateManager.getGame(gameId);
        // Create game if doesn't exist
        if (!gameRoom) {
            gameRoom = new ConGame_1.ConGame(gameId, numPlayers);
            gameRoom.addPlayer(new Player_1.Player(socket.id, true)); // First player to join is the host
        }
        else {
            gameRoom.addPlayer(new Player_1.Player(socket.id));
        }
        socket.join(gameId);
        socket.emit("join-game-success");
        console.log(`Player joined game: ${gameId}`);
    });
    socket.on("toggle-ready-status", (gameId) => {
        const currPlayer = GameStateManager_1.gameStateManager.getGame(gameId).getPlayer(socket.id);
        if (!currPlayer)
            throw new Error(`Player with socket ID ${socket.id} not found in game ${gameId}`);
        currPlayer.toggleReady();
        if (currPlayer.isReady)
            socket.emit("ready-status__ready");
        else
            socket.emit("ready-status__not-ready");
    });
    socket.on("select-sage", (gameId, sage) => {
        const isSageChosen = GameStateManager_1.gameStateManager.getGame(gameId).setPlayerSage(socket.id, sage);
    });
    socket.on("join-team", (gameId, team) => {
        GameStateManager_1.gameStateManager.getGame(gameId).joinTeam(socket.id, team);
    });
    socket.on("start-game", (gameId) => {
        const gameRoom = GameStateManager_1.gameStateManager.getGame(gameId);
        gameRoom.startGame(socket.id);
        gameEventEmitter.emitPickWarriors(gameRoom.players);
        // TODO: coin flip for who is first. Players decide play order if 4 players
        gameRoom.setStarted(true);
        console.log(`Game ${gameId} started!`);
    });
    socket.on("chose-warriors", (gameId, choices) => {
        GameStateManager_1.gameStateManager.getGame(gameId).chooseWarriors(socket.id, choices);
        // TODO: Emit to player to choose battlefield layout
    });
    socket.on("finished-setup", (gameId) => {
        const gameRoom = GameStateManager_1.gameStateManager.getGame(gameId);
        gameRoom.numPlayersFinishedSetup++;
        if (gameRoom.numPlayersFinishedSetup === gameRoom.players.length)
            // TODO: Go to choosing who is first and emit to players who is first
            return;
    });
    socket.on("leave-game", (gameId) => {
        const currPlayerId = socket.id;
        GameStateManager_1.gameStateManager.getGame(gameId).removePlayer(currPlayerId);
        socket.leave(gameId);
        console.log(`Player ${currPlayerId} left game ${gameId}`);
    });
    socket.on("disconnect", () => {
        console.log(`Player disconnected from gameplay namespace`);
    });
});
// Start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
    server.listen(constants_1.PORT, () => {
        console.log(`WebSocket server running on http://localhost:${constants_1.PORT}`);
    });
}
