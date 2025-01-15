import { ElementalCard } from "../types";

type TwoPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6;
const TWO_PLAYER_SPACE_MAX = 6;
type FourPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const FOUR_PLAYER_SPACE_MAX = 12;
type SpaceOptions = TwoPlayerSpaceOptions | FourPlayerSpaceOptions

export class Battlefield {
    rootSpace: BattlefieldSpace;
    private fieldArray: (BattlefieldSpace)[]
    private numPlayers: 2 | 4;

    constructor(fieldArray: ElementalCard[]) {
        if (fieldArray.length === TWO_PLAYER_SPACE_MAX) {
            this.numPlayers = 2;
            this.initTwoPlayerBattlefield(fieldArray)
        }
        else if (fieldArray.length === FOUR_PLAYER_SPACE_MAX) {
            this.numPlayers = 4;
             this.initFourPlayerBattlefield(fieldArray)
        }

        throw new Error("Invalid Field Size");
    }

    // Formulas
    // Left: row + value
    // Right: row + value + 1
    private initTwoPlayerBattlefield(fieldArray: ElementalCard[]) {
        if (fieldArray.length !== TWO_PLAYER_SPACE_MAX) throw new Error("Invalid amount of cards for 2-Player Game")

        const row_3_3 = new BattlefieldSpace(6, fieldArray[5], null, null);
        const row_3_2 = new BattlefieldSpace(5, fieldArray[4], null, null);
        const row_3_1 = new BattlefieldSpace(4, fieldArray[3], null, null);

        const row_2_2 = new BattlefieldSpace(3, fieldArray[2], row_3_2, row_3_3);
        const row_2_1 = new BattlefieldSpace(2, fieldArray[1], row_3_1, row_3_2);

        const row_1_1 = new BattlefieldSpace(1, fieldArray[0], row_2_1, row_2_2);

        this.rootSpace = row_1_1;
        this.fieldArray = [row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3];
    }

    // Formulas (wrong)
    // Left: row + value + 1
    // Right: row + value + 2
    private initFourPlayerBattlefield(fieldArray: ElementalCard[]) {
        if (fieldArray.length !== FOUR_PLAYER_SPACE_MAX) throw new Error("Invalid amount of cards for 4-Player Game")

        const row_3_4 = new BattlefieldSpace(9, fieldArray[8], null, null);
        const row_3_3 = new BattlefieldSpace(8, fieldArray[7], null, null);
        const row_3_2 = new BattlefieldSpace(7, fieldArray[6], null, null);
        const row_3_1 = new BattlefieldSpace(6, fieldArray[5], null, null);

        const row_2_4 = new BattlefieldSpace(5, fieldArray[5], row_3_3, row_3_4);
        const row_2_3 = new BattlefieldSpace(5, fieldArray[4], row_3_3, row_3_4);
        const row_2_2 = new BattlefieldSpace(4, fieldArray[3], row_3_2, row_3_3);
        const row_2_1 = new BattlefieldSpace(3, fieldArray[2], row_3_1, row_3_2);

        const row_1_2 = new BattlefieldSpace(2, fieldArray[1], row_2_2, row_2_3);
        const row_1_1 = new BattlefieldSpace(1, fieldArray[0], row_2_1, row_2_2);

        const root = new BattlefieldSpace(1, null, row_1_1, row_1_2);

        this.rootSpace = root;
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

    swapCards(space1Number: SpaceOptions, space2Number: SpaceOptions) {
        const space1 = this.getBattlefieldSpace(space1Number)
        const space2 = this.getBattlefieldSpace(space2Number)

        if (space1 === null || space2 === null) throw new Error(`Cannot swap null battlefield space(s): ${space1Number} $ ${space2Number}`)
    }

    private validateSpaceNumber(spaceNumber: SpaceOptions): asserts spaceNumber is TwoPlayerSpaceOptions | FourPlayerSpaceOptions {
        const maxSpaceNumber = this.numPlayers === 2 ? TWO_PLAYER_SPACE_MAX : FOUR_PLAYER_SPACE_MAX;
    
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new Error(`Invalid space for ${this.numPlayers}-player battlefield: ${spaceNumber}`);
        }
    }

    private updateBattlefield() {
        //TODO: implement
    }
}

type Direction = "TL" | "T" | "TR" | "L" | "R" | "BL" | "B" | "BR"
export class BattlefieldSpace {
    spaceNumber: SpaceOptions;
    value: ElementalCard | null;
    connections: {
        TL: BattlefieldSpace | null; 
        T: BattlefieldSpace | null;
        TR: BattlefieldSpace | null;
        L: BattlefieldSpace | null;
        R: BattlefieldSpace | null;
        BL: BattlefieldSpace | null;
        B: BattlefieldSpace | null;
        BR: BattlefieldSpace | null;
    }

    constructor(spaceNumber: SpaceOptions, value: BattlefieldSpace['value'], connections?: BattlefieldSpace['connections']) {
        this.spaceNumber = spaceNumber;
        this.value = value;
        this.connections =  {
            TL: null,
            T: null,
            TR: null,
            L: null,
            R: null,
            BL: null,
            B: null,
            BR: null,
            ...connections
        };
    }

    setValue(value: BattlefieldSpace['value']) {
        this.value = value;
    }

    getDirection(direction: Direction) {
        return this.connections[direction];
    }
}