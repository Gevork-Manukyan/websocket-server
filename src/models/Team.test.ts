import { ConflictError, NotFoundError } from "../services/CustomError/BaseError"
import { Cedar, Porella, Sprout, Timber } from "../utils"
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

test("should create a default Team object", (done) => {
    const team = new Team(1, 1)
    const { players, battlefield } = team

    expect(players).toEqual([])
    expect(battlefield).toBeInstanceOf(Battlefield)
    expect(team.getTeamNumber()).toBe(1)
    expect(team.getTeamSize()).toBe(1)
    done()
})

describe("addPlayerToTeam method", () => {
    test("should add player to team", () => {
        const team = new Team(1, 1)
        team.addPlayerToTeam(new Player("testPlayerId_1"))
        expect(team.players[0].id).toBe("testPlayerId_1")
    })

    test("should throw error if team is full", () => {
        const team = new Team(1, 1)
        team.addPlayerToTeam(new Player("testPlayerId_1"))
        expect(() => team.addPlayerToTeam(new Player("testPlayerId_2"))).toThrow(ConflictError)
    })
})

describe("removePlayerFromTeam method", () => {
    test("should remove player from the team", () => {
        const team = new Team(1, 1)
        const playerId = "testPlayerId_1"
        const player = new Player(playerId)
        team.addPlayerToTeam(player)
        expect(team.players[0].id).toBe(playerId)
        team.removePlayerFromTeam(player)
        expect(team.players.length).toBe(0)
    })

    test("should return unchanged team if player doesn't exist on team", () => {
        const team = new Team(1, 1)
        const player = new Player("testPlayerId_1")
        team.addPlayerToTeam(player)
        expect(team.players[0].id).toBe("testPlayerId_1")
        team.removePlayerFromTeam(new Player("testPlayerId_2"))
        expect(team.players.length).toBe(1)
        expect(team.players[0].id).toBe("testPlayerId_1")
    })
})

describe("getAllPlayerDecklists method", () => {
    test("should return all player decklists", () => {
        const team = new Team(1, 1);
        const player = new Player("testPlayerId_1");
        player.getDecklist = jest.fn().mockReturnValue({ id: "decklist_1" });
        team.addPlayerToTeam(player);
        const decklists = team.getAllPlayerDecklists();
        expect(decklists).toEqual([{ id: "decklist_1" }]);
      });
  
    test("should throw error if a player has no decklist", () => {
        const team = new Team(1, 1);
        const player = new Player("testPlayerId_1");
        player.getDecklist = jest.fn().mockReturnValue(null);
        team.addPlayerToTeam(player);
        expect(() => team.getAllPlayerDecklists()).toThrow(NotFoundError);
    });
})

describe("initBattlefield method", () => {
    test("should initialize battlefield for a single-player team", () => {
        const team = new Team(1, 1);
        const decklist = TwigDeck;
        const basicCard = Timber;
        const sage = Cedar;
        team.initBattlefield([decklist]);
  
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard, 1);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard, 2);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard, 3);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(sage, 5);
      });

    test("should initialize battlefield for a two-player team", () => {
        const team = new Team(2, 1);

        const decklist_1 = TwigDeck;
        const basicCard_1 = Timber;
        const sage_1 = Cedar;

        const decklist_2 = LeafDeck;
        const basicCard_2 = Sprout;
        const sage_2 = Porella;

        team.initBattlefield([decklist_1, decklist_2]);

        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 1);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 2);

        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 3);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_1, 4);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 5);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(basicCard_2, 6);

        expect(team.battlefield.addCard).toHaveBeenCalledWith(sage_1, 8);
        expect(team.battlefield.addCard).toHaveBeenCalledWith(sage_2, 11);
    })

})

describe("initWarriors method", () => {

})