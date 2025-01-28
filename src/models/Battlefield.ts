import { ValidationError } from "../services/CustomError/BaseError";
import { NullSpaceError } from "../services/CustomError/GameError";
import { ElementalCard } from "../types";

type OnePlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6;
const ONE_PLAYER_SPACE_MAX = 6;
type TwoPlayerSpaceOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const TWO_PLAYER_SPACE_MAX = 12;
type SpaceOptions = OnePlayerSpaceOptions | TwoPlayerSpaceOptions

export class Battlefield {
    private fieldArray: (BattlefieldSpace)[] = [];
    private numPlayersOnTeam: 1 | 2;

    constructor(numPlayersOnTeam: Battlefield['numPlayersOnTeam']) {
        this.numPlayersOnTeam = numPlayersOnTeam;
        numPlayersOnTeam === 1 ? this.initOnePlayerBattlefield() : this.initTwoPlayerBattlefield();
    }

    private initOnePlayerBattlefield() {
        let row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3;

        row_3_3 = new BattlefieldSpace(8, null, {
            TL: row_2_2,
            L: row_3_2,
        });
        row_3_2 = new BattlefieldSpace(7, null, {
            TL: row_2_1,
            TR: row_2_2,
            L: row_3_1,
            R: row_3_3,
        });
        row_3_1 = new BattlefieldSpace(6, null, {
            TR: row_2_1,
            R: row_3_2,
        });

        row_2_2 = new BattlefieldSpace(4, null, {
            TL: row_1_1,
            L: row_2_1,
            BL: row_3_2,
            BR: row_3_3,
        });
        row_2_1 = new BattlefieldSpace(3, null, {
            TR: row_1_1,
            R: row_2_2,
            BL: row_3_1,
            BR: row_3_2,
        });

        row_1_1 = new BattlefieldSpace(1, null, {
            BL: row_2_1,
            BR: row_2_2,
        });

        this.fieldArray = [row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3];
    }

    private initTwoPlayerBattlefield() {
        let row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_2_4, row_3_1, row_3_2, row_3_3, row_3_4, row_3_5, row_3_6;

        row_3_6 = new BattlefieldSpace(9, null, {
            TL: row_2_4,
            L: row_3_5,
        });
        row_3_5 = new BattlefieldSpace(9, null, {
            TL: row_2_3, 
            T: row_2_4,
            L: row_3_4,
            R: row_3_6,
        });
        row_3_4 = new BattlefieldSpace(9, null, {
            TL: row_2_2,
            T: row_2_3,
            TR: row_2_4,
            L: row_3_3,
            R: row_3_5,
        });
        row_3_3 = new BattlefieldSpace(8, null, {
            TL: row_2_1,
            T: row_2_2,
            TR: row_2_3,
            L: row_3_2,
            R: row_3_4,
        });
        row_3_2 = new BattlefieldSpace(7, null, {
            T: row_2_1,
            TR: row_2_2,
            L: row_3_1,
            R: row_3_3,
        });
        row_3_1 = new BattlefieldSpace(6, null, {
            TR: row_2_1,
            R: row_3_2,
        });

        row_2_4 = new BattlefieldSpace(5, null, {
            TR: row_1_2,
            L: row_2_3,
            BL: row_3_4,
            B: row_3_5,
            BR: row_3_6,
        });
        row_2_3 = new BattlefieldSpace(5, null, {
            TL: row_1_1,
            T: row_1_2,
            L: row_2_2,
            R: row_2_4,
            BL: row_3_3,
            B: row_3_4,
            BR: row_3_5,
        });
        row_2_2 = new BattlefieldSpace(4, null, {
            T: row_1_1,
            TR: row_1_2,
            L: row_2_1,
            R: row_2_3,
            BL: row_3_2,
            B: row_3_3,
            BR: row_3_4,
        });
        row_2_1 = new BattlefieldSpace(3, null, {
            TR: row_1_1,
            R: row_2_2,
            BL: row_3_1,
            B: row_3_2,
            BR: row_3_3,
        });

        row_1_2 = new BattlefieldSpace(2, null, {
            L: row_1_1,
            BL: row_2_2,
            B: row_2_3,
            BR: row_2_4,
        });
        row_1_1 = new BattlefieldSpace(1, null, {
            R: row_1_2,
            BL: row_2_1,
            B: row_2_2,
            BR: row_2_3,
        });

        this.fieldArray = [row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_2_4, row_3_1, row_3_2, row_3_3, row_3_4, row_3_5, row_3_6];
    }

    private getBattlefieldSpace<T extends SpaceOptions>(spaceNumber: T) {
        this.validateSpaceNumber(spaceNumber)
        return this.fieldArray[spaceNumber - 1];
    }

    getCard(spaceNumber: SpaceOptions) {
        return this.getBattlefieldSpace(spaceNumber).value;
    }

    addCard(card: ElementalCard, spaceNumber: SpaceOptions) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value !== null) throw new ValidationError("Cannot add a card to a space with an existing card", "INVALID_INPUT")
        targetSpace.value = card;
    }

    removeCard(spaceNumber: SpaceOptions) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value === null) throw new NullSpaceError(spaceNumber, `Cannot remove an empty space: ${spaceNumber}`)
        const targetCard = targetSpace.value
        targetSpace.value = null
        return targetCard;
    }

    swapCards(space1Number: SpaceOptions, space2Number: SpaceOptions) {
        const space1 = this.getBattlefieldSpace(space1Number)
        const space2 = this.getBattlefieldSpace(space2Number)

        if (space1 === null || space2 === null) {
            const nullSpace = space1 === null ? space1Number : space2Number
            throw new NullSpaceError(nullSpace, `Cannot swap null battlefield space: ${nullSpace}`)
        }

        const space1Value = space1.value
        space1.setValue(space2.value)
        space2.setValue(space1Value)
    }

    private validateSpaceNumber(spaceNumber: SpaceOptions): asserts spaceNumber is OnePlayerSpaceOptions | TwoPlayerSpaceOptions {
        const maxSpaceNumber = this.numPlayersOnTeam === 1 ? ONE_PLAYER_SPACE_MAX : TWO_PLAYER_SPACE_MAX;
    
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new ValidationError(`Invalid space for ${this.numPlayersOnTeam}-player battlefield: ${spaceNumber}`, "INVALID_INPUT");
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
        TL?: BattlefieldSpace | null; 
        T?: BattlefieldSpace | null;
        TR?: BattlefieldSpace | null;
        L?: BattlefieldSpace | null;
        R?: BattlefieldSpace | null;
        BL?: BattlefieldSpace | null;
        B?: BattlefieldSpace | null;
        BR?: BattlefieldSpace | null;
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