"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const constants_1 = require("./utils/constants"); // Your actual constant file
const server_1 = require("./server"); // Import your server.ts logic
const GameStateManager_1 = require("./services/GameStateManager");
let clientSocket;
beforeAll((done) => {
    // Start the server (ensure it’s tied to your real server.ts code)
    server_1.server.listen(constants_1.PORT, () => {
        // Connect the client to the same server
        clientSocket = (0, socket_io_client_1.default)(`http://localhost:${constants_1.PORT}/gameplay`, {
            transports: ['websocket']
        }); // Connect to the "/gameplay" namespace
        clientSocket.on("connect", done); // Wait until the connection is established
    });
});
afterAll(() => {
    server_1.server.close(); // Close the server
    clientSocket.close(); // Close the client socket
});
beforeEach(() => {
    GameStateManager_1.gameStateManager.resetGameStateManager();
});
test("should establish a socket connection", () => {
    expect(clientSocket.connected).toBe(true);
});
describe("join-game event", () => {
    test("should handle a 'join-game' event for 2 players", (done) => {
        const testGameId = "test-game";
        const numPlayers = 2;
        clientSocket.emit("join-game", testGameId, numPlayers);
        // Since we're using the real server logic, the event should trigger the actual server code
        clientSocket.on("connect", () => {
            console.log("Client connected");
        });
        clientSocket.on("join-game-success", () => {
            console.log("The game was joined successfully!");
            done();
        });
    });
    test("should handle a 'join-game' event for 4 players", (done) => {
        const testGameId = "test-game";
        const numPlayers = 4;
        clientSocket.emit("join-game", testGameId, numPlayers);
        // Since we're using the real server logic, the event should trigger the actual server code
        clientSocket.on("connect", () => {
            console.log("Client connected");
        });
        clientSocket.on("join-game-success", () => {
            console.log("The game was joined successfully!");
            done();
        });
    });
});
describe("toggle-ready-status event", () => {
    test("should make player ready if they are not ready", (done) => {
        const testGameId = "test-game";
        const numPlayers = 2;
        // Step 1: Join a game to set up initial state
        clientSocket.emit("join-game", testGameId, numPlayers);
        // Step 2: Wait for the "join-game-success" event to ensure player joined
        clientSocket.on("join-game-success", () => {
            // Step 3: Emit the "toggle-ready-status" event
            clientSocket.emit("toggle-ready-status", testGameId);
            // Step 4: Listen for the "ready-status__ready" event
            clientSocket.on("ready-status__ready", () => {
                console.log("Player is now ready!");
                done();
            });
        });
    });
    test("should make player not ready if they are ready", (done) => {
        const testGameId = "test-game";
        const numPlayers = 2;
        // Step 1: Join a game to set up initial state
        clientSocket.emit("join-game", testGameId, numPlayers);
        // Step 2: Wait for the "join-game-success" event to ensure player joined
        clientSocket.on("join-game-success", () => {
            // Step 3: Emit the "toggle-ready-status" event
            clientSocket.emit("toggle-ready-status", testGameId);
            // Step 4: Listen for the "ready-status__ready" event
            clientSocket.on("ready-status__ready", () => {
                console.log("Player is now ready!");
                // Step 5: Emit "toggle-ready-status" again to toggle back
                clientSocket.emit("toggle-ready-status", testGameId);
                // Step 6: Listen for the "ready-status__not-ready" event
                clientSocket.on("ready-status__not-ready", () => {
                    console.log("Player is now not ready!");
                    done();
                });
            });
        });
    });
});
test("should log player disconnection when client disconnects", (done) => {
    const logSpy = jest.spyOn(console, "log");
    // Disconnect the client
    clientSocket.disconnect();
    setTimeout(() => {
        expect(logSpy).toHaveBeenCalledWith("Player disconnected from gameplay namespace");
        logSpy.mockRestore();
        done();
    }, 100); // Small delay to ensure the server processes the disconnect
});
