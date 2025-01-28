import { ValidationError } from "../services/CustomError/BaseError";
import { Timber } from "../utils";
import { Battlefield } from "./Battlefield";

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

        test("shoshould throw an error when adding a card to a non-empty space", () => {
            const battlefield = new Battlefield(1)
            battlefield.addCard(Timber, 1)
            expect(() => battlefield.addCard(Timber, 1)).toThrow(ValidationError)
        })
    })
})