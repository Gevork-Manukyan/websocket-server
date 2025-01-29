import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { PlayersNotReadyError, SageUnavailableError } from "../services/CustomError/GameError";
import { AcornSquire, QuillThornback, SlumberJack } from "../utils";
import { GeoWeasel, GraniteRampart } from "../utils/cards";
import { TwigDeck } from "../utils/constants";
import { ConGame } from "./ConGame";
import { Player } from "./Player";
import { Team } from "./Team";

describe("ConGame", () => {
    let game: ConGame;
  
    beforeEach(() => {
      game = new ConGame("game-1", 4);
    });
  
    describe("constructor", () => {
      test("initializes the game with the correct properties", () => {
        expect(game.id).toBe("game-1");
        expect(game.isStarted).toBe(false);
        expect(game.numPlayersTotal).toBe(4);
        expect(game.numPlayersReady).toBe(0);
        expect(game.team1).toBeInstanceOf(Team);
        expect(game.team2).toBeInstanceOf(Team);
      });
    });
  
    describe("setStarted", () => {
      test("sets the game start status", () => {
        game.setStarted(true);
        expect(game.isStarted).toBe(true);
      });
    });
  
    describe("addPlayer", () => {
      test("adds a player to the game", () => {
        const player = new Player("player-1");
        game.addPlayer(player);
        expect(game.players).toContain(player);
      });
    });
  
    describe("removePlayer", () => {
      test("removes a player from the game by ID", () => {
        const player = new Player("player-1");
        game.addPlayer(player);
        game.removePlayer("player-1");
        expect(game.players).not.toContainEqual(player);
      });
    });
  
    describe("getPlayer", () => {
      test("returns the correct player by ID", () => {
        const player = new Player("player-1");
        game.addPlayer(player);
        expect(game.getPlayer("player-1")).toBe(player);
      });
  
      test("throws NotFoundError if player ID is not found", () => {
        expect(() => game.getPlayer("non-existent-id")).toThrow(NotFoundError);
      });
    });
  
    describe("setPlayerSage", () => {
      test("sets the sage for a player if available", () => {
        const player = new Player("player-1");
        player.setSage = jest.fn()
        game.addPlayer(player);
        game.setPlayerSage("player-1", "Cedar");
        expect(player.setSage).toHaveBeenCalledWith("Cedar");
      });
  
      test("throws SageUnavailableError if the sage is already chosen", () => {
        const player1 = new Player("player-1");
        const player2 = new Player("player-2");
        player1.sage = "Cedar";
  
        game.addPlayer(player1);
        game.addPlayer(player2);
  
        expect(() => game.setPlayerSage("player-2", "Cedar")).toThrow(SageUnavailableError);
      });
    });
  
    describe("joinTeam", () => {
      test("adds a player to the selected team", () => {
        const player = new Player("player-1");
        game.addPlayer(player);
        game.team1.addPlayerToTeam = jest.fn()
        player.setTeam= jest.fn()
        
        game.joinTeam("player-1", 1);
        expect(game.team1.addPlayerToTeam).toHaveBeenCalledWith(player);
        expect(player.setTeam).toHaveBeenCalledWith(game.team1)
      });
  
      test("removes the player from the current team before joining a new one", () => {
        const player = new Player("player-1");
        
        game.addPlayer(player);
        game.joinTeam("player-1", 1)
        
        game.team1.removePlayerFromTeam = jest.fn()
        game.team2.addPlayerToTeam = jest.fn()
        player.setTeam = jest.fn()

        game.joinTeam("player-1", 2);

        expect(game.team1.removePlayerFromTeam).toHaveBeenCalledWith(player);
        expect(game.team2.addPlayerToTeam).toHaveBeenCalledWith(player)
        expect(player.setTeam).toHaveBeenCalledWith(game.team2)
      });
    });
  
    describe("incrementPlayersReady", () => {
      test("increments the number of players ready", () => {
        expect(game.incrementPlayersReady()).toBe(1);
        expect(game.numPlayersReady).toBe(1);
      });
    });
  
    describe("decrementPlayersReady", () => {
      test("decrements the number of players ready", () => {
        game.numPlayersReady = 1;
        expect(game.decrementPlayersReady()).toBe(0);
        expect(game.numPlayersReady).toBe(0);
      });
    });
  
    describe("startGame", () => {
      test("starts the game if all players are ready and host initiates", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        game.addPlayer(hostPlayer);
        game.numPlayersReady = 4;
  
        game.initPlayerDecks = jest.fn()
        game.initPlayerFields = jest.fn()

        game.startGame("player-1");
  
        expect(game.isStarted).toBe(true);
        expect(game.initPlayerDecks).toHaveBeenCalled();
        expect(game.initPlayerFields).toHaveBeenCalled();
      });
  
      test("throws PlayersNotReadyError if not all players are ready", () => {
        const hostPlayer = new Player("player-1");
        hostPlayer.isGameHost = true;
        game.addPlayer(hostPlayer);
        game.numPlayersReady = 3;
  
        expect(() => game.startGame("player-1")).toThrow(PlayersNotReadyError);
      });
    });
  
    describe("chooseWarriors", () => {
      test("sets warriors for a player and adds non-chosen cards to their deck", () => {
        const player = new Player("player-1");
        player.getDecklist = jest.fn().mockReturnValue(TwigDeck);
        game.addPlayer(player);
        
        player.addCardToDeck = jest.fn()
        player.team = {
            initWarriors: jest.fn(),
        } as Partial<Team> as Team;
  
        game.chooseWarriors("player-1", [
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
        game.addPlayer(player);
        player.team = {
            initWarriors: jest.fn(),
        } as Partial<Team> as Team;
  
        expect(() =>
          game.chooseWarriors("player-1", [
            AcornSquire,
            GeoWeasel,
          ])
        ).toThrow(ValidationError);

        expect(() =>
            game.chooseWarriors("player-1", [
                GeoWeasel,
                AcornSquire,
            ])
        ).toThrow(ValidationError);

        expect(() =>
            game.chooseWarriors("player-1", [
                GeoWeasel,
                GraniteRampart,
            ])
        ).toThrow(ValidationError);
      });
    });
  });
  