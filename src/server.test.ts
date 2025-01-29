import Client, { Socket } from "socket.io-client";
import { server } from "./server";
import { PORT } from "./utils/config";
import { gameStateManager } from "./services/GameStateManager";
import { ConGame, Player } from "./models";
import { CustomError } from "./services/CustomError/BaseError";

// TODO: Rewrite all tests to use mock classes

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
  server.close(); 
  clientSocket.close(); 
});

afterEach(() => {
  gameStateManager.resetGameStateManager();
  clientSocket.removeAllListeners();
});

describe("Server.ts", () => {

  test("should establish a socket connection", () => {
    expect(clientSocket.connected).toBe(true);
  });

  describe("join-game event", () => {
    test("should handle a 'join-game' event for 2 players", (done) => {
      clientSocket.emit("join-game", testGameId, numPlayers);

      clientSocket.once("connect", () => {
        console.log("Client connected");
      });

      clientSocket.once("join-game--success", () => {
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

      clientSocket.once("join-game--success", () => {
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
      clientSocket.once("join-game--success", () => {
        clientSocket.emit("select-sage", testGameId, "Cedar")
        clientSocket.once("select-sage--success", () => {
          expect(gameStateManager.getGame(testGameId).players[0].sage).toBe("Cedar")
          done();
        })
      })
    });

    test("should Error if selected sage is already picked", (done) => {
      clientSocket.once("join-game--success", () => {
        const player2 = new Player("player2")
        const game = gameStateManager.getGame(testGameId)
        game.addPlayer(player2)
        game.setPlayerSage(player2.id, "Cedar")
      })


      clientSocket.once("join-game--success", () => {
        clientSocket.emit("select-sage", testGameId, "Cedar")
        clientSocket.once("select-sage--error", (error: CustomError) => {
          console.log(error.message)
          done();
        })
      })
    });
  });

  describe("toggle-ready-status event", () => {
    beforeEach(() => {
      clientSocket.emit("join-game", testGameId, numPlayers);
      clientSocket.on("join-game--success", () => {
        clientSocket.emit("select-sage", testGameId, "Cedar");
      });
    });

    test("should make player ready if they are not ready", (done) => {
        clientSocket.once("select-sage--success", () => {
          
        clientSocket.emit("toggle-ready-status", testGameId);

        clientSocket.once("ready-status--ready", () => {
          console.log("Player is now ready!");
          done();
        });
      });
    });

    test("should make player not ready if they are ready", (done) => {
      clientSocket.once("select-sage--success", () => {
        clientSocket.emit("toggle-ready-status", testGameId);

        clientSocket.once("ready-status--ready", () => {
          console.log("Player is now ready!");

          clientSocket.emit("toggle-ready-status", testGameId);

          clientSocket.once("ready-status--not-ready", () => {
            console.log("Player is now not ready!");
            done();
          });
        });
      });
    });
  });

  describe("join-team event", () => {
      beforeEach(() => {
          clientSocket.emit("join-game", testGameId, numPlayers);
          clientSocket.on("join-game--success", () => {
            clientSocket.emit("select-sage", testGameId, "Cedar");
            clientSocket.once("select-sage--success", () => {
                  clientSocket.emit("toggle-ready-status", testGameId);                    
            })
          });
      });

      test("should make player join team 1", (done) => {
          const expectedTeamNumber = 1;
          clientSocket.once("ready-status--ready", () => {
              clientSocket.emit("join-team", testGameId, expectedTeamNumber)
              clientSocket.once("join-team--success", () => {
                  expect(gameStateManager.getGame(testGameId).players[0].team?.getTeamNumber()).toBe(expectedTeamNumber)
                  console.log("Player joined team 1");
                  done();
              })
          });
      })

      test("should make player join team 2", (done) => {
          const expectedTeamNumber = 2;
          clientSocket.once("ready-status--ready", () => {
              clientSocket.emit("join-team", testGameId, expectedTeamNumber)
              clientSocket.once("join-team--success", () => {
                  expect(gameStateManager.getGame(testGameId).players[0].team?.getTeamNumber()).toBe(expectedTeamNumber)
                  console.log("Player joined team 2");
                  done();
              })
          });
      })

      test("should throw error if joining a full team", (done) => {
          const expectedTeamNumber = 1;
          const addPlayer2 = () => {
              const player2 = new Player("player2")
              const game = gameStateManager.getGame(testGameId)
              game.addPlayer(player2)
              game.joinTeam(player2.id, expectedTeamNumber)
          }

          clientSocket.once("ready-status--ready", () => {
              addPlayer2()
              clientSocket.emit("join-team", testGameId, expectedTeamNumber)
              clientSocket.once("join-team--error", () => {
                  done();
              })        
          });
      })

      test("should make player switch from team 1 to team 2", (done) => {
          const expectedTeamNumberFirst = 1;
          const expectedTeamNumberSecond = 2;
          clientSocket.once("ready-status--ready", () => {
              clientSocket.emit("join-team", testGameId, expectedTeamNumberFirst)
              clientSocket.once("join-team--success", () => {
                  expect(gameStateManager.getGame(testGameId).players[0].team?.getTeamNumber()).toBe(expectedTeamNumberFirst)
                  
                  clientSocket.emit("join-team", testGameId, expectedTeamNumberSecond)
                  clientSocket.once("join-team--success", () => {
                      expect(gameStateManager.getGame(testGameId).players[0].team?.getTeamNumber()).toBe(expectedTeamNumberSecond)
                      done()
                  })
              })
          });
      })
  })

  describe("clear-teams event", () => {
    let game: ConGame

    beforeEach(() => {
      game = new ConGame(testGameId, 2)
      gameStateManager.addGame(game)
    });

    test("should throw an error if non-host clears teams", () => {
      const hostPlayerId = "hostPlayer"
      game.addPlayer(new Player(hostPlayerId, true))
      game.joinTeam(hostPlayerId, 1)
      
      clientSocket.emit("join-game", testGameId, numPlayers);
      clientSocket.on("join-game--success", () => {
        clientSocket.emit("clear-teams")
        clientSocket.on("clear-teams--error", (done) => {
          done()
        })
      });
    })
  })
})
