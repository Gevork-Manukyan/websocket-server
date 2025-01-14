import { ElementalCard } from "../types";

type TwoPlayerPositionOptions = 1 | 2 | 3 | 4 | 5 | 6;
type FourPlayerPositionOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type PositionOptions = TwoPlayerPositionOptions | FourPlayerPositionOptions

export class Battlefield {
    private fieldGraph: BattlefieldSpace;
    private fieldArray: BattlefieldSpace[]
    private numPlayers: 2 | 4;

    constructor(fieldArray: ElementalCard[]) {
        if (fieldArray.length === 6) {
            this.numPlayers = 2;
            this.initTwoPlayerBattlefield(fieldArray)
        }
        else if (fieldArray.length === 9) {
            this.numPlayers = 4;
             this.initFourPlayerBattlefield(fieldArray)
        }

        throw new Error("Invalid Field Size");
    }

    private initTwoPlayerBattlefield(fieldArray: ElementalCard[]) {
        if (fieldArray.length !== 6) throw new Error("Invalid amount of cards for 2-Player Game")

        const row_3_3 = new BattlefieldSpace(6, fieldArray[5], null, null);
        const row_3_2 = new BattlefieldSpace(5, fieldArray[4], null, null);
        const row_3_1 = new BattlefieldSpace(4, fieldArray[3], null, null);

        const row_2_2 = new BattlefieldSpace(3, fieldArray[2], row_3_2, row_3_3);
        const row_2_1 = new BattlefieldSpace(2, fieldArray[1], row_3_1, row_3_2);

        const row_1_1 = new BattlefieldSpace(1, fieldArray[0], row_2_1, row_2_2);

        this.fieldGraph = row_1_1;
        this.fieldArray = [row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3];
    }

    private initFourPlayerBattlefield(fieldArray: ElementalCard[]) {
        if (fieldArray.length !== 9) throw new Error("Invalid amount of cards for 4-Player Game")

        const row_3_4 = new BattlefieldSpace(9, fieldArray[8], null, null);
        const row_3_3 = new BattlefieldSpace(8, fieldArray[7], null, null);
        const row_3_2 = new BattlefieldSpace(7, fieldArray[6], null, null);
        const row_3_1 = new BattlefieldSpace(6, fieldArray[5], null, null);

        const row_2_3 = new BattlefieldSpace(5, fieldArray[4], row_3_3, row_3_4);
        const row_2_2 = new BattlefieldSpace(4, fieldArray[3], row_3_2, row_3_3);
        const row_2_1 = new BattlefieldSpace(3, fieldArray[2], row_3_1, row_3_2);

        const row_1_2 = new BattlefieldSpace(2, fieldArray[1], row_2_2, row_2_3);
        const row_1_1 = new BattlefieldSpace(1, fieldArray[0], row_2_1, row_2_2);

        const row_0 = new BattlefieldSpace(1, null, row_1_1, row_1_2);

        this.fieldGraph = row_0;
        this.fieldArray = [row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_3_1, row_3_2, row_3_3, row_3_4];
    }

    getCardAtPosition<T extends PositionOptions>(position: T) {
        if (this.numPlayers === 2 && position > 6) {
            throw new Error(`Invalid position ${position} for a 2-player game`);
        }
        if (this.numPlayers === 4 && position > 9) {
            throw new Error(`Invalid position ${position} for a 4-player game`);
        }
    
        return this.fieldArray[position - 1];
    }

    addCard(card: ElementalCard, position: PositionOptions) {
        const maxPosition = this.numPlayers === 2 ? 6 : 9;
        if (position < 1 || position > maxPosition) {
            throw new Error(`Invalid position for ${this.numPlayers}-player battlefield: ${position}`);
        }
        
        this.numPlayers === 2
        ? this.addCardTwoPlayer(card, position as TwoPlayerPositionOptions)
        : this.addCardFourPlayer(card, position)
    }

    private addCardTwoPlayer(card: ElementalCard, position: TwoPlayerPositionOptions) {
        
    }

    private addCardFourPlayer(card: ElementalCard, position: FourPlayerPositionOptions) {
        
    }

    removeCard(card: ElementalCard, position: 1 | 2 | 3 | 4 | 5 | 6) {
        this.numPlayers === 2 ? this.removeCardTwoPlayer() : this.removeCardFourPlayer();
        this.updateBattlefield()
    }

    private removeCardTwoPlayer() {

    }

    private removeCardFourPlayer() {
        
    }

    private updateBattlefield() {

    }
}

export class BattlefieldSpace {
    position: PositionOptions;
    value: ElementalCard | null;
    left: BattlefieldSpace | null;
    right: BattlefieldSpace | null;

    constructor(position: PositionOptions, value: BattlefieldSpace['value'], left: BattlefieldSpace['left'], right: BattlefieldSpace['right']) {
        this.position = position;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}