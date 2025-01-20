import Client, { Socket } from "socket.io-client";
import { server } from "./server"; // Import your server.ts logic
import { PORT } from "./utils/config";
import { gameStateManager } from "./services/GameStateManager";
import { Player } from "./models";

let clientSocket: Socket;
const testGameId = "test-game";
const numPlayers = 2;

beforeAll((done) => {
  // Start the server (ensure it’s tied to your real server.ts code)
  server.listen(PORT, () => {
    // Connect the client to the same server
    clientSocket = Client(`http://localhost:${PORT}/gameplay`, {
      transports: ["websocket"],
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
  clientSocket.removeAllListeners();
});

test("should establish a socket connection", () => {
  expect(clientSocket.connected).toBe(true);
});

describe("join-game event", () => {
  test("should handle a 'join-game' event for 2 players", (done) => {
    clientSocket.emit("join-game", testGameId, numPlayers);

    clientSocket.once("connect", () => {
      console.log("Client connected");
    });

    clientSocket.once("join-game-success", () => {
      console.log("The game was joined successfully!");
      done();
    });
  });

  test("should handle a 'join-game' event for 4 players", (done) => {
    const numPlayers = 4;

    clientSocket.emit("join-game", testGameId, numPlayers);

    clientSocket.once("connect", () => {
      console.log("Client connected");
    });

    clientSocket.once("join-game-success", () => {
      console.log("The game was joined successfully!");
      done();
    });
  });
});

describe("select-sage event", () => {
  beforeEach(() => {
    clientSocket.emit("join-game", testGameId, numPlayers);
  })

  test("should select sage", (done) => {
    clientSocket.once("join-game-success", () => {
      clientSocket.emit("select-sage", testGameId, "Cedar")
      clientSocket.once("select-sage-success", () => {
        done();
      })
    })
  });

  test("should Error if selected sage is already picked", (done) => {
    const player2 = new Player("player2")
    const game = gameStateManager.getGame(testGameId)
    game.addPlayer(player2)
    game.setPlayerSage(player2.id, "Cedar")

    clientSocket.once("join-game-success", () => {
      clientSocket.emit("select-sage", testGameId, "Cedar")
      
    })
  });
});

describe("toggle-ready-status event", () => {
  beforeEach(() => {
    clientSocket.emit("join-game", testGameId, numPlayers);
    clientSocket.on("join-game-success", () => {
      clientSocket.emit("select-sage", testGameId, "Cedar");
    });
  });

  test("should make player ready if they are not ready", (done) => {
    clientSocket.once("select-sage-success", () => {
      clientSocket.emit("toggle-ready-status", testGameId);

      clientSocket.once("ready-status__ready", () => {
        console.log("Player is now ready!");
        done();
      });
    });
  });

  test("should make player not ready if they are ready", (done) => {
    clientSocket.once("select-sage-success", () => {
      // Step 3: Emit the "toggle-ready-status" event
      clientSocket.emit("toggle-ready-status", testGameId);

      // Step 4: Listen for the "ready-status__ready" event
      clientSocket.once("ready-status__ready", () => {
        console.log("Player is now ready!");

        // Step 5: Emit "toggle-ready-status" again to toggle back
        clientSocket.emit("toggle-ready-status", testGameId);

        // Step 6: Listen for the "ready-status__not-ready" event
        clientSocket.once("ready-status__not-ready", () => {
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
    expect(logSpy).toHaveBeenCalledWith(
      "Player disconnected from gameplay namespace"
    );
    logSpy.mockRestore();
    done();
  }, 100); // Small delay to ensure the server processes the disconnect
});
