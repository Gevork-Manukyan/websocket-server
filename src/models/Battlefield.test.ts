import { ValidationError } from "../services/CustomError/BaseError";
import { NullSpaceError } from "../services/CustomError/GameError";
import { AcornSquire, Timber } from "../utils";
import { Battlefield, BattlefieldSpace } from "./Battlefield";

describe("Battlefield class", () => {
    describe("constructor", () => {
        test("should initialize a one-player battlefield correctly", () => {
            const battlefield = new Battlefield(1);
            expect(battlefield.getCard(1)).toBe(null);
            expect(battlefield.getCard(2)).toBe(null);
            expect(battlefield.getCard(3)).toBe(null);
            expect(battlefield.getCard(4)).toBe(null);
            expect(battlefield.getCard(5)).toBe(null);
            expect(battlefield.getCard(6)).toBe(null);
            expect(() => battlefield.getCard(7)).toThrow(ValidationError);
        });
    
        test("should initialize a two-player battlefield correctly", () => {
            const battlefield = new Battlefield(2);
            expect(battlefield.getCard(1)).toBe(null);
            expect(battlefield.getCard(2)).toBe(null);
            expect(battlefield.getCard(3)).toBe(null);
            expect(battlefield.getCard(4)).toBe(null);
            expect(battlefield.getCard(5)).toBe(null);
            expect(battlefield.getCard(6)).toBe(null);
            expect(battlefield.getCard(7)).toBe(null);
            expect(battlefield.getCard(8)).toBe(null);
            expect(battlefield.getCard(9)).toBe(null);
            expect(battlefield.getCard(10)).toBe(null);
            expect(battlefield.getCard(11)).toBe(null);
            expect(battlefield.getCard(12)).toBe(null);
        });
    })

    describe("addCard method", () => {
        test("should add a card to an empty space", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 1)
            expect(battlefield.getCard(1)).toBe(Timber)
        })

        test("should throw an error when adding a card to a non-empty space", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 1)
            expect(() => battlefield.addCard(Timber, 1)).toThrow(ValidationError)
        })
    })

    describe("removeCard method", () => {
        test("should remove a card from a space", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 1)
            const removedCard = battlefield.removeCard(1)
            expect(battlefield.getCard(1)).toBe(null)
            expect(removedCard).toBe(Timber)
        })

        test("should throw an error if removing card from empty space", () => {
            const battlefield = new Battlefield(1)
            expect(() => battlefield.removeCard(1)).toThrow(NullSpaceError)
        })
    })

    describe("swapCards method", () => {
        test("should swap two cards between spaces", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 1)
            battlefield.addCard(AcornSquire, 6)
            battlefield.swapCards(1, 6)
            expect(battlefield.getCard(1)).toBe(AcornSquire)
            expect(battlefield.getCard(6)).toBe(Timber)
        })

        test("should throw an error if either space is empty", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 3)

            expect(() => battlefield.swapCards(3, 6)).toThrow(NullSpaceError)
            expect(() => battlefield.swapCards(1, 3)).toThrow(NullSpaceError)
            expect(() => battlefield.swapCards(1, 6)).toThrow(NullSpaceError)
        })

        test("should throw an error if swapping a space with itself", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 3)
            expect(() => battlefield.swapCards(1, 1)).toThrow(ValidationError)
        })
    })
})

describe("BattlefieldSpace class", () => {
    test("should initialize correctly", () => {
        const space = new BattlefieldSpace(1, null);
        expect(space.spaceNumber).toBe(1);
        expect(space.value).toBe(null);
    });

    test("should set and get value correctly", () => {
        const space = new BattlefieldSpace(1, null);
        space.setValue(Timber);
        expect(space.value).toBe(Timber);
    });

    test("should retrieve connections correctly", () => {
        const space1 = new BattlefieldSpace(1, null);
        const space2 = new BattlefieldSpace(2, null, { L: space1 });
        expect(space2.getDirection("L")).toBe(space1);
        expect(space2.getDirection("R")).toBe(null);
    });
})