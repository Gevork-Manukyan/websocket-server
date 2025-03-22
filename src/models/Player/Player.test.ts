import { NotFoundError, ValidationError } from "../../services";
import { Player, Team } from "../../models";
import { ALL_CARDS, TwigDeck } from "../../constants";
const { Cedar, Gravel, Timber, AcornSquire, CloseStrike, FarStrike, GeoWeasel, GraniteRampart, NaturalRestoration, QuillThornback, SlumberJack, TwigCharm } = ALL_CARDS;

const testPlayerId = "testId123"

describe("constructor", () => {
    test("should call constructor and create default player", (done) => {
        const player = new Player(testPlayerId)
    
        expect(player.id).toBe(testPlayerId)
        expect(player.getIsReady()).toBe(false)
        expect(player.getIsGameHost()).toBe(false)
        expect(player.getTeam()).toBe(null)
        expect(player.getSage()).toBe(null)
        expect(player.getDecklist()).toBe(null)
        expect(player.getLevel()).toBe(1)
        expect(player.getHand()).toEqual([])
        expect(player.getDeck()).toEqual([])
        expect(player.getDiscardPile()).toEqual([])
        done()
    })
    
    test("should call constructor and create host player", (done) => {
        const player = new Player(testPlayerId, true)
    
        expect(player.getIsGameHost()).toBe(true)
        done()
    })
})

describe("team getter and setters", () => {
    test("should set the player's team", () => {
        const player = new Player(testPlayerId);
        const team = new Team(1, 1);
        player.setTeam(team);
        expect(player.getTeam()).toBe(team);
    })
})

describe("level getter and setters", () => {
    test("should correctly set the player's level", () => {
        const player = new Player(testPlayerId);
        player.levelUp();
        player.levelUp();
        expect(player.getLevel()).toBe(2);
    });
});

describe("hand getter and setters", () => {
    test("should correctly set the player's hand", () => {
        const player = new Player(testPlayerId);
        player.addCardToHand(Cedar);
        expect(player.getHand()).toContainEqual(Cedar);
    });
});

describe("deck getter and setters", () => {
    test("should correctly set the player's deck", () => {
        const player = new Player(testPlayerId);
        player.addCardToDeck(Cedar);
        expect(player.getDeck()).toContainEqual(Cedar);
    });
});

describe("discard pile getter and setters", () => {
    test("should correctly set the player's discard pile", () => {
        const player = new Player(testPlayerId);
        player.addCardToDiscardPile(Cedar);
        expect(player.getDiscardPile()).toContainEqual(Cedar);
    });
});

describe("getElement method", () => {
    test("should return the player's element", () => {
        const player = new Player(testPlayerId);
        player.setSage("Cedar");
        player.setDecklist(TwigDeck);
        expect(player.getElement()).toBe("twig");
    });

    test("should throw NotFoundError if sage is not set", () => {
        const player = new Player(testPlayerId);
        player.setDecklist(TwigDeck);
        expect(() => player.getElement()).toThrow(NotFoundError);
    });

    test("should throw NotFoundError if decklist is not set", () => {
        const player = new Player(testPlayerId);
        player.setSage("Cedar");
        expect(() => player.getElement()).toThrow(NotFoundError);
    });
});

describe("toggleReady method", () => {
    test("should toggle player to be ready", (done) => {
        const player = new Player(testPlayerId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.getIsReady()).toBe(true)
        done()
    })

    test("should toggle player to be NOT ready", (done) => {
        const player = new Player(testPlayerId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.getIsReady()).toBe(true)
        player.toggleReady()
        expect(player.getIsReady()).toBe(false)
        done()
    })
})

describe("addCardsToDeck", () => {
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
        expect(player.getHasChosenWarriors()).toBe(true);
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
})

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
        player.setIsReady(true);
        player.setHasChosenWarriors(true);
        player.finishPlayerSetup();
        expect(player.getIsSetup()).toBe(true);
    })

    test("should throw error if player is not ready", () => {
        const player = new Player("player-1");
        player.setHasChosenWarriors(true);
        expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
    })

    test("should throw error if player has not chosen warriors", () => {
        const player = new Player("player-1");
        player.setIsReady(true);
        expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
    })
})

describe("cancelPlayerSetup", () => {
    test("should set the player as not setup", () => {
        const player = new Player("player-1");
        player.setIsSetup(true);
        player.cancelPlayerSetup();
        expect(player.getIsSetup()).toBe(false);
    })
})