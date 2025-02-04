import { NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { Cedar, Gravel, Timber } from "../utils";
import { AcornSquire, CloseStrike, FarStrike, GeoWeasel, GraniteRampart, NaturalRestoration, QuillThornback, SlumberJack, TwigCharm } from "../utils/cards";
import { TwigDeck } from "../utils/constants";
import { Player } from "./Player";
import { Team } from "./Team";

const testPlayerId = "testId123"

describe("constructor", () => {
    test("should call constructor and create default player", (done) => {
        const player = new Player(testPlayerId)
        const { id, isReady, isGameHost } = player
    
        expect(id).toBe(testPlayerId)
        expect(isReady).toBe(false)
        expect(isGameHost).toBe(false)
        expect(player.getTeam()).toBe(null)
        expect(player.getSage()).toBe(null)
        expect(player.getDecklist()).toBe(null)
        expect(player.getGold()).toBe(0)
        expect(player.getLevel()).toBe(1)
        expect(player.getHand()).toEqual([])
        expect(player.getDeck()).toEqual([])
        expect(player.getDiscardPile()).toEqual([])
        done()
    })
    
    test("should call constructor and create host player", (done) => {
        const player = new Player(testPlayerId, true)
    
        expect(player.isGameHost).toBe(true)
        done()
    })
})

describe("toggleReady method", () => {
    test("should toggle player to be ready", (done) => {
        const player = new Player(testPlayerId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.isReady).toBe(true)
        done()
    })

    test("should toggle player to be NOT ready", (done) => {
        const player = new Player(testPlayerId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.isReady).toBe(true)
        player.toggleReady()
        expect(player.isReady).toBe(false)
        done()
    })
})

describe("adding cards to deck", () => {
    test("should add a single card (using addCardToDeck)", (done) => {
        const player = new Player(testPlayerId)
        player.addCardToDeck(Cedar)
        expect(player.getDeck()).toStrictEqual([Cedar])
        done()
    })

    test("should add a single card (using addCardsToDeck)", (done) => {
        const player = new Player(testPlayerId)
        player.addCardsToDeck([Cedar])
        expect(player.getDeck()).toContain(Cedar)
        done()
    })

    test("should add a multiple cards", (done) => {
        const player = new Player(testPlayerId)
        player.addCardsToDeck([Cedar, Gravel])
        expect(player.getDeck()).toContainEqual(Cedar)
        expect(player.getDeck()).toContainEqual(Gravel)
        done()
    })
})

describe("initDeck method", () => {
    test("should throw error if player is not ready", (done) => {
        const player = new Player(testPlayerId)
        expect(() => player.initDeck()).toThrow(ValidationError)
        done()
    })

    test("should properly init deck", (done) => {
        const player = new Player(testPlayerId)
        player.setSage("Cedar")
        player.toggleReady()
        player.initDeck()

        expect(player.getDecklist()).toStrictEqual(TwigDeck)
        expect(player.getDeck()).toStrictEqual([Timber, CloseStrike, CloseStrike, FarStrike, NaturalRestoration, TwigCharm])
        done()
    })
})

describe("chooseWarriors", () => {
    test("sets warriors for a player and adds non-chosen cards to their deck", () => {
        const player = new Player("player-1");
        player.getDecklist = jest.fn().mockReturnValue(TwigDeck);
        player.setTeam({
            initWarriors: jest.fn(),
        } as Partial<Team> as Team);
    
        player.chooseWarriors([AcornSquire, SlumberJack]);
    
        expect(player.getTeam()?.initWarriors).toHaveBeenCalledWith([AcornSquire, SlumberJack]);
        expect(player.hasChosenWarriors).toBe(true);
    });

    test("throws ValidationError if the chosen warriors do not match the player's sage element", () => {
        const player = new Player("player-1");
        player.getDecklist = jest.fn().mockReturnValue(TwigDeck);
        player.setTeam({
            initWarriors: jest.fn(),
        } as Partial<Team> as Team);
    
        expect(() =>
            player.chooseWarriors([
              AcornSquire,
              GeoWeasel,
            ])
          ).toThrow(ValidationError);
    
          expect(() =>
              player.chooseWarriors([
                  GeoWeasel,
                  AcornSquire,
              ])
          ).toThrow(ValidationError);
    
          expect(() =>
              player.chooseWarriors([
                  GeoWeasel,
                  GraniteRampart,
              ])
          ).toThrow(ValidationError);
    });

    describe("swapWarriors", () => {
        test("swaps the player's warriors", () => {
            const player = new Player("player-1");
            player.setTeam({
                swapWarriors: jest.fn(),
            } as Partial<Team> as Team);
            player.setSage("Cedar")
            player.setDecklist(TwigDeck);
        
            player.swapWarriors();
        
            expect(player.getTeam()?.swapWarriors).toHaveBeenCalled();
        });

        test("throws NotFoundError if player does not have a team", () => {
            const player = new Player("player-1");
            player.setTeam(null);
        
            expect(() => player.swapWarriors()).toThrow(Error);
        });
    })

    describe("finishedPlayerSetup", () => {
        test("should set the player as finished setup", () => {
            const player = new Player("player-1");
            player.isReady = true;
            player.hasChosenWarriors = true;
            player.finishPlayerSetup();
            expect(player.isSetup).toBe(true);
        })

        test("should throw error if player is not ready", () => {
            const player = new Player("player-1");
            player.hasChosenWarriors = true;
            expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
        })

        test("should throw error if player has not chosen warriors", () => {
            const player = new Player("player-1");
            player.isReady = true;
            expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
        })
    })

    describe("cancelPlayerSetup", () => {
        test("should set the player as not setup", () => {
            const player = new Player("player-1");
            player.isSetup = true;
            player.cancelPlayerSetup();
            expect(player.isSetup).toBe(false);
        })
    })
});