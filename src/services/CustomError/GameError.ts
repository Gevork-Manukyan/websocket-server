import { gameId, Sage } from "../../types";
import { ConflictError, CustomError } from "./BaseError";

/**
 * When the game with the given ID does not exist
 */
export class GameConflictError extends ConflictError {
    constructor(gameId: gameId) {
        super(`Game with ID ${gameId} does not exist`);
    }
}

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

export class InvalidSageError extends CustomError {
    sage; 

    constructor(sage: Sage) {
      super(`Unknown sage class: ${sage}`, "INVALID_SAGE", 400);
      this.sage = sage;
    }
  }
  

/**
 * Only the host can {action}
 */
export class HostOnlyActionError extends CustomError {
    constructor(action = "perform this action") {
        super(`Only the host can ${action}`, "HOST_ONLY_ACTION", 403);
    }
}

export class PlayersNotReadyError extends ConflictError {
    readyCount; 
    totalCount;

    constructor(readyCount: number, totalCount: number) {
        super("Not all players are ready to start the game");
        this.readyCount = readyCount;
        this.totalCount = totalCount;
    }
}

export class NullSpaceError extends CustomError {
  spaceNumber; 

  constructor(spaceNumber: number, message = `Cannot interact with null space: ${spaceNumber}`) {
    super(message, "NULL_SPACE");
    this.spaceNumber = spaceNumber;
  }
}
  
export class GameStateError extends CustomError {
    constructor(message = "Invalid game state") {
        super(message, "GAME_STATE_ERROR");
    }
}