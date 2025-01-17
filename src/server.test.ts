import { io as Client, Socket } from "socket.io-client";
import { server, io } from "./server";
import { AddressInfo } from "net";

let clientSocket: Socket;

beforeAll((done) => {
  // Start the server
  const address = server.listen().address() as AddressInfo;
  const port = address.port;

  // Connect a client to the server
  clientSocket = Client(`http://localhost:${port}/gameplay`, {
    transports: ["websocket"],
  });

  clientSocket.on("connect", done); // Wait for connection
});

afterAll(() => {
  io.close(); // Close Socket.IO server
  server.close(); // Close HTTP server
  clientSocket.close(); // Disconnect the client
});

test("Client can connect to the gameplay namespace", () => {
  expect(clientSocket.connected).toBe(true);
});
