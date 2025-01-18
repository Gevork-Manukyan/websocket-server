import { createServer } from "http";
import { Server } from "socket.io";
import Client, { Socket } from "socket.io-client";
import { PORT } from "./utils/constants"; // Your actual constant file
import { app, server, io } from "./server"; // Import your server.ts logic

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

test("should establish a socket connection", () => {
  expect(clientSocket.connected).toBe(true);
});

test("should handle a 'join-game' event", (done) => {
  const testGameId = "123";
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
  