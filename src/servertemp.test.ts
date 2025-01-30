import Client, { Socket } from "socket.io-client";
import { server } from "./server";
import { PORT } from "./utils/config";
import { gameStateManager } from "./services/GameStateManager";
import { ConGame, Player } from "./models";
import { CustomError } from "./services/CustomError/BaseError";
import { ClearTeamsData, JoinGameData, JoinTeamData, SelectSageData, ToggleReadyStatusData } from "./types/server-types";


let clientSocket: Socket;
let mockGame: ConGame;
let mockPlayer: Player;
const testGameId = "test-game";
const numPlayers = 2;
const testPlayerId = "test-player"

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
    mockPlayer = new Player(testPlayerId)
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
      
            clientSocket.emit("join-game", { gameId: testGameId, numPlayers } as JoinGameData)

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
            
            clientSocket.emit("join-game", { gameId: testGameId, numPlayers })

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
            clientSocket.emit("join-game", {gameId: testGameId} as JoinGameData)

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

            clientSocket.emit("select-sage", {gameId: testGameId, sage: "Cedar"} as SelectSageData)
            
            clientSocket.once("select-sage--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.setPlayerSage).toHaveBeenCalledWith(expect.any(String), "Cedar")
                done()
            })
        })
    })

    describe("toggle-ready-status", () => {
        beforeEach(() => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.toggleReady = jest.fn()
        })

        test("should toggle the player status to ready", (done) => {
            mockPlayer.isReady = true
            mockGame.incrementPlayersReady = jest.fn()

            clientSocket.emit("toggle-ready-status", { gameId: testGameId } as ToggleReadyStatusData)

            clientSocket.once("ready-status--ready", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.toggleReady).toHaveBeenCalled()
                expect(mockGame.incrementPlayersReady).toHaveBeenCalled()
                done()
            })
        })

        test("should toggle the player status to not ready", (done) => {
            mockPlayer.isReady = false
            mockGame.decrementPlayersReady = jest.fn()

            clientSocket.emit("toggle-ready-status", { gameId: testGameId } as ToggleReadyStatusData)

            clientSocket.once("ready-status--not-ready", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.toggleReady).toHaveBeenCalled()
                expect(mockGame.decrementPlayersReady).toHaveBeenCalled()
                done()
            })
        })
    })

    describe("join-team event", () => {
        test("should successfully join a team", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.joinTeam = jest.fn()

            clientSocket.emit("join-team", { gameId: testGameId, team: 1 } as JoinTeamData)

            clientSocket.once("join-team--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.joinTeam).toHaveBeenCalledWith(expect.any(String), 1)
                done()
            })
        })
    })

    describe("clear-teams event", () => {
        test("should clear all teams of players", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(new Player(testPlayerId, true))
            mockGame.clearTeams = jest.fn()

            clientSocket.emit("clear-teams", { gameId: testGameId } as ClearTeamsData)

            clientSocket.once("clear-teams--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.clearTeams).toHaveBeenCalled()
                done()
            })
        })
    })
})