import Client, { Socket } from "socket.io-client";
import { PORT } from "./utils/constants"; // Your actual constant file
import { server } from "./server"; // Import your server.ts logic
import { gameStateManager } from "./services/GameStateManager";
import { ConGame } from "./models";

let clientSocket: Socket;

beforeAll((done) => {
  // Start the server (ensure it’s tied to your real server.ts code)
  server.listen(PORT, () => {
    // Connect the client to the same server
    clientSocket = Client(`http://localhost:${PORT}/gameplay`, {
        transports: ['websocket']
    }); // Connect to the "/gameplay" namespace
    clientSocket.on("connect", done); // Wait until the connection is established
  });
});

afterAll(() => {
  server.close(); // Close the server
  clientSocket.close(); // Close the client socket
});

beforeEach(() => {
    gameStateManager.resetGameStateManager();
})

afterEach(() => {
    clientSocket.
})

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
})

describe("toggle-ready-status event", () => {
    test("should make player ready if they are not ready", (done) => {
        const testGameId = "test-game"
        const numPlayers = 2

        // Step 1: Join a game to set up initial state
        clientSocket.emit("join-game", testGameId, numPlayers);

        // Step 2: Wait for the "join-game-success" event to ensure player joined
        clientSocket.on("join-game-success", () => {

            // Step 2.5: Select a Sage
            clientSocket.emit("select-sage", testGameId, "Cedar")

            clientSocket.on("select-sage-success", () => {

                // Step 3: Emit the "toggle-ready-status" event
                clientSocket.emit("toggle-ready-status", testGameId)
    
                // Step 4: Listen for the "ready-status__ready" event
                clientSocket.on("ready-status__ready", () => {
                    console.log("Player is now ready!");
                    done();
                })
            })
        })
    })

    test("should make player not ready if they are ready", (done) => {
        const testGameId = "test-game"
        const numPlayers = 2

        // Step 1: Join a game to set up initial state
        clientSocket.emit("join-game", testGameId, numPlayers);

        // Step 2: Wait for the "join-game-success" event to ensure player joined
        clientSocket.on("join-game-success", () => {

            // Step 2.5: Select a Sage
            clientSocket.emit("select-sage", testGameId, "Gravel")

            clientSocket.on("select-sage-success", () => {

                // Step 3: Emit the "toggle-ready-status" event
                clientSocket.emit("toggle-ready-status", testGameId)

                // Step 4: Listen for the "ready-status__ready" event
                clientSocket.on("ready-status__ready", () => {
                    console.log("Player is now ready!");
                    
                    // Step 5: Emit "toggle-ready-status" again to toggle back
                    clientSocket.emit("toggle-ready-status", testGameId)

                    // Step 6: Listen for the "ready-status__not-ready" event
                    clientSocket.on("ready-status__not-ready", () => {
                        console.log("Player is now not ready!");
                        done();
                    })
                })
            })
        })
    })
})

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
  