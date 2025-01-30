import Client, { Socket } from "socket.io-client";
import { server } from "./server";
import { PORT } from "./utils/config";
import { gameStateManager } from "./services/GameStateManager";
import { ConGame, Player } from "./models";
import { CustomError } from "./services/CustomError/BaseError";


let clientSocket: Socket;
let mockGame: ConGame;
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
  server.close(); 
  clientSocket.close(); 
});

beforeEach(() => {
    mockGame = new ConGame(testGameId, numPlayers)
})

afterEach(() => {
  gameStateManager.resetGameStateManager();
  clientSocket.removeAllListeners();
});

describe("Server.ts", () => {
    test("should establish a socket connection", () => {
        expect(clientSocket.connected).toBe(true);
    });

    describe("join-game event", () => {

        test("should create a new game", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(undefined);
            gameStateManager.addGame = jest.fn().mockReturnValue(mockGame);
            mockGame.addPlayer = jest.fn()
      
            clientSocket.emit("join-game", testGameId, numPlayers)

            clientSocket.once("join-game--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(gameStateManager.addGame).toHaveBeenCalledWith(expect.any(ConGame))
                expect(mockGame.addPlayer).toHaveBeenCalledWith(
                    expect.objectContaining({
                      id: expect.any(String),
                      isGameHost: true, 
                    })
                );               
                done();
            });
        })

        test("should join an existing game", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame);
            mockGame.addPlayer = jest.fn()
            
            clientSocket.emit("join-game", testGameId, numPlayers)

            clientSocket.once("join-game--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.addPlayer).toHaveBeenCalledWith(
                    expect.objectContaining({
                      id: expect.any(String),
                      isGameHost: false, 
                    })
                );               
                done();
            });
        })

        test("should throw an error if one of the parameters are missing", (done) => {
            clientSocket.emit("join-game", testGameId)

            clientSocket.once("join-game--error", () => {
                done()
            })
        })

        test("should throw an error if both of the parameters are missing", (done) => {
            clientSocket.emit("join-game")

            clientSocket.once("join-game--error", () => {
                done()
            })
        })
    })

    describe("select-sage event", () => {
        test("should set the sage that is passed", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.setPlayerSage = jest.fn()

            clientSocket.emit("select-sage", testGameId, "Cedar")
            
            clientSocket.once("select-sage--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.setPlayerSage).toHaveBeenCalledWith(expect.any(String), "Cedar")
                done()
            })
        })
    })

    describe("toggle-ready-status", () => {
        test("should toggle the player status to ready", (done) => {

            clientSocket.emit("toggle-ready-status", )
        })
    })
})