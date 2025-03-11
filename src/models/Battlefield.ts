import { isElementalWarriorCard } from "../lib/card-validators";
import { InternalServerError, ValidationError } from "../services/CustomError/BaseError";
import { NullSpaceError } from "../services/CustomError/GameError";
import { ElementalCard } from "../types";
import { ElementalWarriorCard, ElementalWarriorCardSchema } from "../types/card-types";
import { SpaceOption, OnePlayerSpaceOptions, TwoPlayerSpaceOptions } from "../types/types";

const ONE_PLAYER_SPACE_MAX = 6;
const TWO_PLAYER_SPACE_MAX = 12;

export class Battlefield {
    private fieldArray: BattlefieldSpace[] = [];
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

    private getBattlefieldSpace<T extends SpaceOption>(spaceNumber: T) {
        this.validateSpaceNumber(spaceNumber)
        return this.fieldArray[spaceNumber - 1];
    }

    private getCardAtSpace<T extends SpaceOption>(spaceNumber: T) {
        const card = this.getBattlefieldSpace(spaceNumber).value;
        if (!card) throw new NullSpaceError(spaceNumber, `Cannot get card from empty space: ${spaceNumber}`);
        return card;
    }

    private validateSpaceNumber(spaceNumber: SpaceOption): asserts spaceNumber is OnePlayerSpaceOptions | TwoPlayerSpaceOptions {
        const maxSpaceNumber = this.numPlayersOnTeam === 1 ? ONE_PLAYER_SPACE_MAX : TWO_PLAYER_SPACE_MAX;
    
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new ValidationError(`Invalid space for ${this.numPlayersOnTeam}-player battlefield: ${spaceNumber}`, "INVALID_INPUT");
        }
    }

    getCard(spaceNumber: SpaceOption) {
        return this.getBattlefieldSpace(spaceNumber).value;
    }

    /**
     * Adds a card to the battlefield space
     * @param card The card to add
     * @param spaceNumber The space number to add the card to
     */
    addCard(card: ElementalCard, spaceNumber: SpaceOption) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value !== null) throw new ValidationError("Cannot add a card to a space with an existing card", "INVALID_INPUT")
        targetSpace.value = card;
    }

    /**
     * Removes a card from the battlefield space and returns the card
     * @param spaceNumber The space number to remove the card from
     * @returns The card that was removed
     */
    removeCard(spaceNumber: SpaceOption): ElementalCard {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value === null) throw new NullSpaceError(spaceNumber, `Cannot remove an empty space: ${spaceNumber}`)
        const targetCard = targetSpace.value
        targetSpace.value = null
        return targetCard;
    }

    swapCards(space1Number: SpaceOption, space2Number: SpaceOption) {
        if (space1Number === space2Number) throw new ValidationError("Cannot swap a card with itself", "spaceNumber");

        const space1 = this.getBattlefieldSpace(space1Number)
        const space2 = this.getBattlefieldSpace(space2Number)

        if (space1.value === null || space2.value === null) {
            const nullSpace = space1 === null ? space1Number : space2Number
            throw new NullSpaceError(nullSpace, `Cannot swap null battlefield space: ${nullSpace}`)
        }

        const space1Value = space1.value
        space1.setValue(space2.value)
        space2.setValue(space1Value)
    }

    getBattlefieldState() {
        return this.fieldArray.map(space => space.getBattlefieldSpaceState())
    }

    getDayBreakCards(): SpaceOption[] {
        return this.fieldArray.filter(space => {
            if (space.value === null) return false;
            
            // If space has an ability card with Day Break which is true, return true
            return "isDayBreak" in space.value && space.value.isDayBreak
        }).map(space => space.spaceNumber)
    }

    activateDayBreak(spaceOption: SpaceOption) {
        const targetSpace: BattlefieldSpace = this.getBattlefieldSpace(spaceOption);
        targetSpace.validateDayBreakActivation();
        targetSpace.value.ability();
    }

    damageCardAtPosition(position: SpaceOption, amount: number): boolean {
        const card = this.getCardAtSpace(position);

        const newHealth = card.health - amount;
        if (newHealth <= 0) return true;
        
        card.health = newHealth;
        return false;
    }

    clearDamage(position: SpaceOption) {
        const card = this.getCardAtSpace(position);
        card.health = card.max
        // TODO: create damage counter and instead of reducing health increase the counter 
    }

    addShieldToCardAtPosition(position: SpaceOption, amount: number) {
        const card = this.getCardAtSpace(position);
        const newShield = card.shieldCount + amount;
        card.shieldCount = newShield;
    }

    addBoostToCardAtPosition(position: SpaceOption, amount: number) {
        const card = this.getCardAtSpace(position);
        const newBoost = card.boostCount + amount;
        card.boostCount = newBoost;
    }
}

type Direction = "TL" | "T" | "TR" | "L" | "R" | "BL" | "B" | "BR"
export class BattlefieldSpace {
    spaceNumber: SpaceOption;
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

    constructor(spaceNumber: SpaceOption, value: BattlefieldSpace['value'], connections?: BattlefieldSpace['connections']) {
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

    getBattlefieldSpaceState() {
        return {
            spaceNumber: this.spaceNumber,
            value: this.value,
        }
    }

    validateDayBreakActivation(): asserts this is BattlefieldSpace & { value: ElementalWarriorCard } {
        if (this.value === null) {
            throw new NullSpaceError(this.spaceNumber, `Cannot activate Day Break on an empty space: ${this.spaceNumber}`);
        }
        
        if (!isElementalWarriorCard(this.value) || !this.value.isDayBreak) {
            throw new ValidationError("Cannot activate Day Break on a card that does not have the ability", "INVALID_INPUT");
        }
    }
}