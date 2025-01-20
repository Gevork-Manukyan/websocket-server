import { Sage } from "../../types";
import { ConflictError, CustomError } from "./BaseError";

/**
 * When the selected sage is already selected by another player
 */
export class SageUnavailableError extends ConflictError {
    sage; 

    constructor(sage: Sage) {
      super(`Sage ${sage} is unavailable`);
      this.sage = sage;
    }
}
