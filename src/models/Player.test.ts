import { Player } from "./Player";

const testPlayerId = "testId123"

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