import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { LeafDeck, TwigDeck } from "../utils/constants";
import { ConGame } from "./ConGame";
import { Player } from "./Player";
import { Team } from "./Team";

describe("ConGame", () => {
    let mockGame: ConGame;
  
    beforeEach(() => {
      mockGame = new ConGame("game-1", 4);
    });
  
    describe("constructor", () => {
      test("initializes the game with the correct properties", () => {
        expect(mockGame.id).toBe("game-1");
        expect(mockGame.isStarted).toBe(false);
        expect(mockGame.hasFinishedSetup).toBe(false);
        expect(mockGame.numPlayersTotal).toBe(4);
        expect(mockGame.numPlayersReady).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
        expect(mockGame.players).toEqual([]);
        expect(mockGame.team1).toBeInstanceOf(Team);
        expect(mockGame.team2).toBeInstanceOf(Team);
        expect(mockGame.getTeamOrder()).toEqual({
          first: expect.any(Team),
          second: expect.any(Team),
        });
        expect(mockGame.getPlayerOrder()).toEqual([null, null, null, null]);
        expect(mockGame.creatureShop).toEqual([]);
        expect(mockGame.itemShop).toEqual([]);
      });
    });
  
    describe("setStarted", () => {
      test("sets the game start status", () => {
        mockGame.setStarted(true);
        expect(mockGame.isStarted).toBe(true);
      });
    });
  
    describe("addPlayer", () => {
      test("adds a player to the game", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        expect(mockGame.players).toContain(player);
      });
    });
  
    describe("removePlayer", () => {
      test("removes a player from the game by ID", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        mockGame.removePlayer("player-1");
        expect(mockGame.players).not.toContainEqual(player);
      });
    });
  
    describe("getPlayer", () => {
      test("returns the correct player by ID", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        expect(mockGame.getPlayer("player-1")).toBe(player);
      });
  
      test("throws NotFoundError if player ID is not found", () => {
        expect(() => mockGame.getPlayer("non-existent-id")).toThrow(NotFoundError);
      });
    });
  
    describe("setPlayerSage", () => {
      test("sets the sage for a player if available", () => {
        const player = new Player("player-1");
        player.setSage = jest.fn()
        mockGame.addPlayer(player);
        mockGame.setPlayerSage("player-1", "Cedar");
        expect(player.setSage).toHaveBeenCalledWith("Cedar");
      });
  
      test("throws SageUnavailableError if the sage is already chosen", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        player1.setSage("Cedar");
  
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
  
        expect(() => mockGame.setPlayerSage("player-2", "Cedar")).toThrow(SageUnavailableError);
      });
    });

    describe("getTeamOrder", () => {
      test("should return the correct team order", () => {
        expect(mockGame.getTeamOrder()).toEqual({
          first: expect.any(Team),
          second: expect.any(Team),
        })
      });
    });

    describe("getTeamGoingFirst", () => {
      test("should return the team that is going first", () => {
        const firstTeam = mockGame.getTeamOrder().first;
        expect(mockGame.getTeamGoingFirst()).toEqual(firstTeam);
      });
    });

    describe("getTeamGoingSecond", () => {
      test("should return the team that is going second", () => {
        const secondTeam = mockGame.getTeamOrder().second;
        expect(mockGame.getTeamGoingSecond()).toEqual(secondTeam);
      });
    });

    describe("getPlayerOrder", () => {
      test("should return the correct player order (2-players)", () => {
        const newMockGame = new ConGame("game-2", 2);
        const player1 = new Player("player-1")
        const player2 = new Player("player-2")
        newMockGame.setPlayerOrder(player1, 1);
        newMockGame.setPlayerOrder(player2, 2);

        expect(newMockGame.getPlayerOrder()).toEqual([player1, player2]);
      });

      test("should return the correct player order (4-players)", () => {
        mockGame = new ConGame("game-2", 4);
        const player1 = new Player("player-1")
        const player2 = new Player("player-2")
        const player3 = new Player("player-3")
        const player4 = new Player("player-4")
        mockGame.setPlayerOrder(player1, 1);
        mockGame.setPlayerOrder(player2, 2);
        mockGame.setPlayerOrder(player3, 3);
        mockGame.setPlayerOrder(player4, 4);

        expect(mockGame.getPlayerOrder()).toEqual([player1, player2, player3, player4])
      });
    });

    describe("setPlayerOrder", () => {
      test("should correctly set the player order", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        mockGame.setPlayerOrder(player, 1);
        expect(mockGame.getPlayerOrder()[0]).toBe(player);
      });
      
      test("should throw NotFoundError for invalid player order", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        expect(() => mockGame.setPlayerOrder(player, 5  as unknown as 1 | 2 | 3 | 4)).toThrow(NotFoundError);
        expect(() => mockGame.setPlayerOrder(player, 0 as unknown as 1 | 2 | 3 | 4)).toThrow(NotFoundError);
      });

      test("should throw NotFoundError for invalid player order for 2 player game", () => {
        const newMockGame = new ConGame("game-2", 2);
        const player = new Player("player-1");
        newMockGame.addPlayer(player);
        expect(() => newMockGame.setPlayerOrder(player, 3)).toThrow(NotFoundError);
      });
      
      test("should throw ValidationError if player is already in the position", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        mockGame.setPlayerOrder(player, 1);
        expect(() => mockGame.setPlayerOrder(player, 1)).toThrow(ValidationError);
      });
    });

    describe("setPlayerOrderForTeam", () => {
      test("should correctly set player order for team 1", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
        mockGame.joinTeam(player1.id, 1);
        mockGame.joinTeam(player2.id, 1);

        mockGame.getTeamGoingFirst = jest.fn().mockReturnValue(mockGame.team1)
        mockGame.setPlayerOrder = jest.fn()

        mockGame.setPlayerOrderForTeam([player1, player2]);

        expect(mockGame.getTeamGoingFirst).toHaveBeenCalled()
        expect(mockGame.setPlayerOrder).toHaveBeenCalledWith(player1, 1)
        expect(mockGame.setPlayerOrder).toHaveBeenCalledWith(player2, 3)
      });

      test("should correctly set player order for team 2", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
        mockGame.joinTeam(player1.id, 2);
        mockGame.joinTeam(player2.id, 2);

        mockGame.getTeamGoingSecond = jest.fn().mockReturnValue(mockGame.team2)
        mockGame.setPlayerOrder = jest.fn()

        mockGame.setPlayerOrderForTeam([player1, player2]);

        expect(mockGame.getTeamGoingSecond).toHaveBeenCalled()
        expect(mockGame.setPlayerOrder).toHaveBeenCalledWith(player1, 2)
        expect(mockGame.setPlayerOrder).toHaveBeenCalledWith(player2, 4)
      });
      
      test("should throw ValidationError if game is 2 players", () => {
        const newMockGame = new ConGame("game-2", 2);
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        expect(() => newMockGame.setPlayerOrderForTeam([player1, player2])).toThrow(ValidationError);
      });
    });
  
    describe("joinTeam", () => {
      test("adds a player to the selected team", () => {
        const player = new Player("player-1");
        mockGame.addPlayer(player);
        mockGame.team1.addPlayerToTeam = jest.fn()
        player.setTeam= jest.fn()
        
        mockGame.joinTeam("player-1", 1);
        expect(mockGame.team1.addPlayerToTeam).toHaveBeenCalledWith(player);
        expect(player.setTeam).toHaveBeenCalledWith(mockGame.team1)
      });
  
      test("removes the player from the current team before joining a new one", () => {
        const player = new Player("player-1");
        
        mockGame.addPlayer(player);
        mockGame.joinTeam("player-1", 1)
        
        mockGame.team1.removePlayerFromTeam = jest.fn()
        mockGame.team2.addPlayerToTeam = jest.fn()
        player.setTeam = jest.fn()

        mockGame.joinTeam("player-1", 2);

        expect(mockGame.team1.removePlayerFromTeam).toHaveBeenCalledWith(player);
        expect(mockGame.team2.addPlayerToTeam).toHaveBeenCalledWith(player)
        expect(player.setTeam).toHaveBeenCalledWith(mockGame.team2)
      });
    });

    describe("incrementPlayersReady", () => {
      test("increments the number of players ready", () => {
        expect(mockGame.incrementPlayersReady()).toBe(1);
        expect(mockGame.numPlayersReady).toBe(1);
      });

      test("incrementing past the total number of players does not change the count", () => {
        mockGame.numPlayersReady = 4;
        expect(mockGame.incrementPlayersReady()).toBe(4);
        expect(mockGame.numPlayersReady).toBe(4);
      })
    });
  
    describe("decrementPlayersReady", () => {
      test("decrements the number of players ready", () => {
        mockGame.numPlayersReady = 1;
        expect(mockGame.decrementPlayersReady()).toBe(0);
        expect(mockGame.numPlayersReady).toBe(0);
      });

      test("decrementing below zero does not change the count", () => {
        expect(mockGame.decrementPlayersReady()).toBe(0);
        expect(mockGame.numPlayersReady).toBe(0);
      })
    });

    describe("incrementPlayersFinishedSetup", () => {
      test("increments the number of players finished setup", () => {
        expect(mockGame.incrementPlayersFinishedSetup()).toBe(1);
        expect(mockGame.numPlayersFinishedSetup).toBe(1);
      });

      test("incrementing past the total number of players does not change the count", () => {
        mockGame.numPlayersFinishedSetup = 4;
        expect(mockGame.incrementPlayersFinishedSetup()).toBe(4);
        expect(mockGame.numPlayersFinishedSetup).toBe(4);
      })
    });

    describe("decrementPlayersFinishedSetup", () => {
      test("decrements the number of players finished setup", () => {
        mockGame.numPlayersFinishedSetup = 1;
        expect(mockGame.decrementPlayersFinishedSetup()).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
      });

      test("decrementing below zero does not change the count", () => {
        expect(mockGame.decrementPlayersFinishedSetup()).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
      })
    });

    describe("clearTeams", () => {
      test("should reset all teams and set ready/set up players to zero", () => {
        mockGame.team1.resetTeam = jest.fn()
        mockGame.team2.resetTeam = jest.fn()

        mockGame.clearTeams()
        
        expect(mockGame.team1.resetTeam).toHaveBeenCalled()
        expect(mockGame.team2.resetTeam).toHaveBeenCalled()
        expect(mockGame.numPlayersReady).toBe(0)
        expect(mockGame.numPlayersFinishedSetup).toBe(0)
        mockGame.players.forEach(player => {
          expect(player.isReady).toBe(false)
        })
      })
    })
  
    describe("startGame", () => {
      test("starts the game if all players are ready and host initiates", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 4;
  
        mockGame.initPlayerDecks = jest.fn()
        mockGame.initPlayerFields = jest.fn()

        mockGame.startGame();
  
        expect(mockGame.isStarted).toBe(true);
        expect(mockGame.initPlayerDecks).toHaveBeenCalled();
        expect(mockGame.initPlayerFields).toHaveBeenCalled();
      });
  
      test("throws PlayersNotReadyError if not all players are ready", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 3;
  
        expect(() => mockGame.startGame()).toThrow(PlayersNotReadyError);
      });
    });

    describe("initPlayerDecks", () => {
      test("should initialize the deck for each player", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
  
        player1.initDeck = jest.fn()
        player2.initDeck = jest.fn()
  
        mockGame.initPlayerDecks();
  
        expect(player1.initDeck).toHaveBeenCalled();
        expect(player2.initDeck).toHaveBeenCalled();
      });
    })

    describe("initPlayerFields", () => {
      test("should initialize the player field for each player", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
        mockGame.team1.addPlayerToTeam(player1);
        mockGame.team2.addPlayerToTeam(player2);

        const decklist1 = [TwigDeck]
        const decklist2 = [LeafDeck]
        mockGame.team1.getAllPlayerDecklists = jest.fn().mockReturnValue(decklist1)
        mockGame.team2.getAllPlayerDecklists = jest.fn().mockReturnValue(decklist2)
        mockGame.team1.initBattlefield = jest.fn()
        mockGame.team2.initBattlefield = jest.fn()

        mockGame.initPlayerFields();

        expect(mockGame.team1.getAllPlayerDecklists).toHaveBeenCalled()
        expect(mockGame.team2.getAllPlayerDecklists).toHaveBeenCalled()
        expect(mockGame.team1.initBattlefield).toHaveBeenCalledWith(decklist1)
        expect(mockGame.team2.initBattlefield).toHaveBeenCalledWith(decklist2)
      })
    })
});
  