import { ElementalCard } from "../types";

type TwoPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6;
type FourPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SpaceOptions = TwoPlayerSpaceOptions | FourPlayerSpaceOptions

export class Battlefield {
    private fieldGraph: BattlefieldSpace;
    private fieldArray: (BattlefieldSpace)[]
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

    // Formulas
    // Left: row + value
    // Right: row + value + 1
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

    // Formulas
    // Left: row + value + 1
    // Right: row + value + 2
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

    getCardAtSpace<T extends SpaceOptions>(space: T) {
        if (this.numPlayers === 2 && space > 6) {
            throw new Error(`Invalid space ${space} for a 2-player game`);
        }
        if (this.numPlayers === 4 && space > 9) {
            throw new Error(`Invalid space ${space} for a 4-player game`);
        }
    
        return this.fieldArray[space - 1];
    }

    addCard(card: ElementalCard, spaceNumber: SpaceOptions) {
        const maxSpaceNumber = this.numPlayers === 2 ? 6 : 9;
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new Error(`Invalid space for ${this.numPlayers}-player battlefield: ${spaceNumber}`);
        }
        
        const targetSpace = this.getCardAtSpace(spaceNumber)
        if (targetSpace !== null) throw new Error("Cannot add a card to a space with an existing card")

        this.numPlayers === 2
        ? this.addCardTwoPlayer(card, targetSpace)
        : this.addCardFourPlayer(card, targetSpace)
    }

    private addCardTwoPlayer(card: ElementalCard, battlefieldSpace: BattlefieldSpace) {
        let left;
        let right;
        const spaceNumber = battlefieldSpace.spaceNumber

        switch (spaceNumber) {
            case 1: 
                left = this.fieldArray[1];
                right = this.fieldArray[2];
                break;
            case 2:
                left = this.fieldArray[3];
                right = this.fieldArray[4];
                break;
            case 3: 
                left = this.fieldArray[4];
                right = this.fieldArray[5];
                break;
            default: 
                left = null;
                right = null;
        }

        const targetSpace = this.fieldArray[spaceNumber - 1];
        
    }

    private addCardFourPlayer(card: ElementalCard, spaceNumber: FourPlayerSpaceOptions) {
        let left; 
        let right;

        switch (spaceNumber) {
            case 1: 
                left = this.fieldArray[1];
                right = this.fieldArray[2];
                break;
            case 2:
                left = this.fieldArray[3];
                right = this.fieldArray[4];
                break;
            case 3: 
                left = this.fieldArray[4];
                right = this.fieldArray[5];
                break;
            default: 
                left = null;
                right = null;
        }

        this.fieldArray[spaceNumber - 1] = new BattlefieldSpace(spaceNumber, card, left, right);
    }

    removeCard(card: ElementalCard, spaceNumber) {
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
    spaceNumber: SpaceOptions;
    value: ElementalCard | null;
    left: BattlefieldSpace | null;
    right: BattlefieldSpace | null;

    constructor(spaceNumber: SpaceOptions, value: BattlefieldSpace['value'], left: BattlefieldSpace['left'], right: BattlefieldSpace['right']) {
        this.spaceNumber = spaceNumber;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}