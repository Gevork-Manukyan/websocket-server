import { ConflictError, NotFoundError } from "../services/CustomError/BaseError"
import { AcornSquire, Cedar, Porella, QuillThornback, Sprout, Timber } from "../utils"
import { LeafDeck, TwigDeck } from "../utils/constants"
import { Battlefield } from "./Battlefield"
import { Player } from "./Player"
import { Team } from "./Team"

jest.mock("./Battlefield", () => {
    return {
        Battlefield: jest.fn().mockImplementation(() => {
            return {
                addCard: jest.fn(),
                getCard: jest.fn().mockReturnValue(null)
            }
        })
    }
})

describe("Team", () => {
    let mockTeam: Team;

    beforeEach(() => {
        mockTeam = new Team(1, 1)
    })

    test("should create a default Team object", (done) => {
        const { players, battlefield } = mockTeam

        expect(players).toEqual([])
        expect(battlefield).toBeDefined();
        expect(mockTeam.getTeamNumber()).toBe(1)
        expect(mockTeam.getTeamSize()).toBe(1)
        done()
    })

    describe("resetTeam method", () => {
        test("should remove all players and create new battlefield", () => {
            const initialBattlefield = mockTeam.battlefield;
            mockTeam.resetTeam()
            expect(mockTeam.players).toEqual([])
            expect(mockTeam.battlefield).not.toBe(initialBattlefield); 
            expect(Battlefield).toHaveBeenCalledWith(mockTeam.getTeamSize()); 
        })
    })

    describe("addPlayerToTeam method", () => {
        test("should add player to team", () => {
            mockTeam.addPlayerToTeam(new Player("testPlayerId_1"))
            expect(mockTeam.players[0].id).toBe("testPlayerId_1")
        })

        test("should throw error if team is full", () => {
            mockTeam.addPlayerToTeam(new Player("testPlayerId_1"))
            expect(() => mockTeam.addPlayerToTeam(new Player("testPlayerId_2"))).toThrow(ConflictError)
        })
    })

    describe("removePlayerFromTeam method", () => {
        test("should remove player from the team", () => {
            const playerId = "testPlayerId_1"
            const player = new Player(playerId)
            mockTeam.addPlayerToTeam(player)
            expect(mockTeam.players[0].id).toBe(playerId)
            mockTeam.removePlayerFromTeam(player)
            expect(mockTeam.players.length).toBe(0)
        })

        test("should return unchanged team if player doesn't exist on team", () => {
            const player = new Player("testPlayerId_1")
            mockTeam.addPlayerToTeam(player)
            expect(mockTeam.players[0].id).toBe("testPlayerId_1")
            mockTeam.removePlayerFromTeam(new Player("testPlayerId_2"))
            expect(mockTeam.players.length).toBe(1)
            expect(mockTeam.players[0].id).toBe("testPlayerId_1")
        })
    })

    describe("getAllPlayerDecklists method", () => {
        test("should return all player decklists", () => {
            const player = new Player("testPlayerId_1");
            player.getDecklist = jest.fn().mockReturnValue({ id: "decklist_1" });
            mockTeam.addPlayerToTeam(player);
            const decklists = mockTeam.getAllPlayerDecklists();
            expect(decklists).toEqual([{ id: "decklist_1" }]);
        });
    
        test("should throw error if a player has no decklist", () => {
            const player = new Player("testPlayerId_1");
            player.getDecklist = jest.fn().mockReturnValue(null);
            mockTeam.addPlayerToTeam(player);
            expect(() => mockTeam.getAllPlayerDecklists()).toThrow(NotFoundError);
        });
    })

    describe("initBattlefield method", () => {
        test("should initialize battlefield for a single-player team", () => {
            const decklist = TwigDeck;
            const basicCard = Timber;
            const sage = Cedar;
            mockTeam.initBattlefield([decklist]);
    
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard, 1);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard, 2);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard, 3);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(sage, 5);
        });

        test("should initialize battlefield for a two-player team", () => {
            mockTeam = new Team(2, 1);

            const decklist_1 = TwigDeck;
            const basicCard_1 = Timber;
            const sage_1 = Cedar;

            const decklist_2 = LeafDeck;
            const basicCard_2 = Sprout;
            const sage_2 = Porella;

            mockTeam.initBattlefield([decklist_1, decklist_2]);

            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 1);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 2);

            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 3);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 4);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 5);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 6);

            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(sage_1, 8);
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(sage_2, 11);
        })
    })

    describe("initWarriors method", () => {
        test("should initialize warriors for one-player team", () => {
            mockTeam.initWarriors([AcornSquire, QuillThornback])

            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(AcornSquire, 4)
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(QuillThornback, 6)
        })

        test("should initialize warriors for two-player team (left side)", () => {
            mockTeam = new Team(2, 1);

            mockTeam.battlefield.getCard = jest
            .fn()
            .mockImplementation((position) => (position === 8 ? Cedar : null));

            mockTeam.initWarriors([AcornSquire, QuillThornback])
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(AcornSquire, 7)
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(QuillThornback, 9)
        })

        test("should initialize warriors for two-player team (right side)", () => {
            mockTeam = new Team(2, 1);

            mockTeam.battlefield.getCard = jest
            .fn()
            .mockImplementation((position) => (position === 11 ? Cedar : null));

            mockTeam.initWarriors([AcornSquire, QuillThornback])
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(AcornSquire, 10)
            expect(mockTeam.battlefield.addCard).toHaveBeenCalledWith(QuillThornback, 12)
        })
    })

    describe("swapWarriors method", () => {
        test("should swap warriors in a single-player team", () => {
            // TODO: Implement test logic
        });
    
        test("should swap warriors for the left-side player in a two-player team", () => {
            // TODO: Implement test logic
        });
    
        test("should swap warriors for the right-side player in a two-player team", () => {
            // TODO: Implement test logic
        });
    
        test("should throw an error if the element does not match any sage", () => {
            // TODO: Implement test logic
        });
    });
})
