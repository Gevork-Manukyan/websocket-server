import { ConflictError } from "../services/CustomError/BaseError"
import { Battlefield } from "./Battlefield"
import { Player } from "./Player"
import { Team } from "./Team"

test("should create a default Team object", (done) => {
    const team = new Team(1, 1)
    const { players, battlefield } = team

    expect(players).toEqual([])
    expect(battlefield).toStrictEqual(new Battlefield(1))
    expect(team.getTeamNumber()).toBe(1)
    expect(team.getTeamSize()).toBe(1)
    done()
})

describe("addPlayerToTeam method", () => {
    test("should add player to team", (done) => {
        const team = new Team(1, 1)
        team.addPlayerToTeam(new Player("testPlayerId_1"))
        expect(team.players[0].id).toBe("testPlayerId_1")
        done()
    })

    test("should throw error if team is full", (done) => {
        const team = new Team(1, 1)
        team.addPlayerToTeam(new Player("testPlayerId_1"))
        expect(() => team.addPlayerToTeam(new Player("testPlayerId_2"))).toThrow(ConflictError)
        done()
    })
})

describe("removePlayerFromTeam method", () => {

})

describe("getAllPlayerDecklists method", () => {

})

describe("initBattlefield method", () => {

})

describe("initWarriors method", () => {

})