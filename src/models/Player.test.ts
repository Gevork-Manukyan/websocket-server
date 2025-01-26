import { ValidationError } from "../services/CustomError/BaseError";
import { Player } from "./Player";

const testPlayerId = "testId123"

describe("constructor", () => {
    test("should call constructor and create default player", (done) => {
        const player = new Player(testPlayerId)
        const { id, isReady, isGameHost, team, sage, decklist, gold, level, hand, deck, discardPile } = player
    
        expect(id).toBe(testPlayerId)
        expect(isReady).toBe(false)
        expect(isGameHost).toBe(false)
        expect(team).toBe(null)
        expect(sage).toBe(null)
        expect(decklist).toBe(null)
        expect(gold).toBe(0)
        expect(level).toBe(1)
        expect(hand).toEqual([])
        expect(deck).toEqual([])
        expect(discardPile).toEqual([])
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

    test("should throw error if sage is not set when trying to toggle ready", (done) => {
        const player = new Player(testPlayerId)
        expect(() => player.toggleReady()).toThrow(ValidationError)
        done()
    })
})