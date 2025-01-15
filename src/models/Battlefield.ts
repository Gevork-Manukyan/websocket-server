import { ElementalCard } from "../types";

type TwoPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6;
type FourPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SpaceOptions = TwoPlayerSpaceOptions | FourPlayerSpaceOptions

export class Battlefield {
    rootSpace: BattlefieldSpace;
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

        this.rootSpace = row_1_1;
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

        this.rootSpace = row_0;
        this.fieldArray = [row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_3_1, row_3_2, row_3_3, row_3_4];
    }

    getBattlefieldSpace<T extends SpaceOptions>(spaceNumber: T) {
        this.validateSpaceNumber(spaceNumber)
        return this.fieldArray[spaceNumber - 1];
    }

    addCard(card: ElementalCard, spaceNumber: SpaceOptions) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value !== null) throw new Error("Cannot add a card to a space with an existing card")
        targetSpace.value = card;
    }

    removeCard(spaceNumber: SpaceOptions) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value === null) throw new Error("Cannot remove an empty space")
        const targetCard = targetSpace.value
        targetSpace.value = null

        this.updateBattlefield()
        return targetCard;
    }

    private validateSpaceNumber(spaceNumber: SpaceOptions): asserts spaceNumber is TwoPlayerSpaceOptions | FourPlayerSpaceOptions {
        const maxSpaceNumber = this.numPlayers === 2 ? 6 : 9;
    
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new Error(`Invalid space for ${this.numPlayers}-player battlefield: ${spaceNumber}`);
        }
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

    setBattlefieldSpace(space: BattlefieldSpace) {
        this.value = space.value;
        this.left = space.left;
        this.right = space.right;
    }

    setValue(value: BattlefieldSpace['value']) {
        this.value = value;
    }

    setLeft(left: BattlefieldSpace['left']) {
        this.left = left;
    }

    setRight(right: BattlefieldSpace['right']) {
        this.right = right;
    }
}