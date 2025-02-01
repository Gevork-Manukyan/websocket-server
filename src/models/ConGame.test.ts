import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { AcornSquire, QuillThornback, SlumberJack } from "../utils";
import { GeoWeasel, GraniteRampart } from "../utils/cards";
import { TwigDeck } from "../utils/constants";
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
        expect(mockGame.numPlayersTotal).toBe(4);
        expect(mockGame.numPlayersReady).toBe(0);
        expect(mockGame.team1).toBeInstanceOf(Team);
        expect(mockGame.team2).toBeInstanceOf(Team);
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
        player1.sage = "Cedar";
  
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
  
        expect(() => mockGame.setPlayerSage("player-2", "Cedar")).toThrow(SageUnavailableError);
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
  
    describe("clearTeams", () => {
      test("should reset all teams and set ready/set up players to zero", () => {
        mockGame.team1.resetTeam = jest.fn()
        mockGame.team2.resetTeam = jest.fn()

        mockGame.clearTeams()
        
        expect(mockGame.team1.resetTeam).toHaveBeenCalled()
        expect(mockGame.team2.resetTeam).toHaveBeenCalled()
        expect(mockGame.numPlayersReady).toBe(0)
        expect(mockGame.numPlayersFinishedSetup).toBe(0)
      })
    })

    describe("incrementPlayersReady", () => {
      test("increments the number of players ready", () => {
        expect(mockGame.incrementPlayersReady()).toBe(1);
        expect(mockGame.numPlayersReady).toBe(1);
      });
    });
  
    describe("decrementPlayersReady", () => {
      test("decrements the number of players ready", () => {
        mockGame.numPlayersReady = 1;
        expect(mockGame.decrementPlayersReady()).toBe(0);
        expect(mockGame.numPlayersReady).toBe(0);
      });
    });
  
    describe("startGame", () => {
      test("starts the game if all players are ready and host initiates", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 4;
  
        mockGame.initPlayerDecks = jest.fn()
        mockGame.initPlayerFields = jest.fn()

        mockGame.startGame("player-1");
  
        expect(mockGame.isStarted).toBe(true);
        expect(mockGame.initPlayerDecks).toHaveBeenCalled();
        expect(mockGame.initPlayerFields).toHaveBeenCalled();
      });
  
      test("throws PlayersNotReadyError if not all players are ready", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 3;
  
        expect(() => mockGame.startGame("player-1")).toThrow(PlayersNotReadyError);
      });
    });
  
    describe("chooseWarriors", () => {
      test("sets warriors for a player and adds non-chosen cards to their deck", () => {
        const player = new Player("player-1");
        player.getDecklist = jest.fn().mockReturnValue(TwigDeck);
        mockGame.addPlayer(player);
        
        player.addCardToDeck = jest.fn()
        player.team = {
            initWarriors: jest.fn(),
        } as Partial<Team> as Team;
  
        mockGame.chooseWarriors("player-1", [
            AcornSquire,
            QuillThornback,
        ]);
  
        expect(player.team?.initWarriors).toHaveBeenCalledWith([
            AcornSquire,
            QuillThornback,
        ]);
  
        expect(player.addCardToDeck).toHaveBeenCalledWith(SlumberJack);
      });
  
      test("throws ValidationError if the chosen warriors do not match the player's sage element", () => {
        const player = new Player("player-1");
        player.getDecklist = jest.fn().mockReturnValue(TwigDeck);
        mockGame.addPlayer(player);
        player.team = {
            initWarriors: jest.fn(),
        } as Partial<Team> as Team;
  
        expect(() =>
          mockGame.chooseWarriors("player-1", [
            AcornSquire,
            GeoWeasel,
          ])
        ).toThrow(ValidationError);

        expect(() =>
            mockGame.chooseWarriors("player-1", [
                GeoWeasel,
                AcornSquire,
            ])
        ).toThrow(ValidationError);

        expect(() =>
            mockGame.chooseWarriors("player-1", [
                GeoWeasel,
                GraniteRampart,
            ])
        ).toThrow(ValidationError);
      });
    });
  });
  