import { gameId, Sage } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "./constants";
import { CustomError, ValidationError } from "../services/CustomError/BaseError";
import { HostOnlyActionError, InvalidSageError } from "../services/CustomError/GameError";
import { EventSchemas, SocketEventMap } from "../types/server-types";
import { Socket } from "socket.io";
import { gameStateManager } from "../services/GameStateManager";

export function getSageDecklist(sage: Sage | null) {
  if (!sage) throw new ValidationError(`No chosen sage`, "sage")

      switch (sage) {
        case "Cedar":
          return TwigDeck;
        case "Gravel": 
          return PebbleDeck;
        case "Porella":
          return LeafDeck;
        case "Torrent":
          return DropletDeck;
        default:
          throw new InvalidSageError(sage);
      }
}

export function processEvent<T extends keyof SocketEventMap>(socket: Socket, event: T, rawData: any, next: (err?: Error) => void) {
  // TODO: doesn't catch errors in indivual events. bring back socketCallback? 
  try {
    // Ensure the event is recognized
    if (!(event in EventSchemas)) {
      throw new ValidationError(`Unrecognized event: ${event}`, rawData);
    }

    // Validate data schema
    const result = EventSchemas[event].safeParse(rawData);
    if (!result.success) {
      throw new ValidationError(`Invalid data for event: ${event}`, rawData);
    }

    const data = result.data;

    // Check for host-only actions
    const hostOnlyEvents = ["clear-teams", "start-game"];
    if (hostOnlyEvents.includes(event)) {
      const game = gameStateManager.getGame(data.gameId as gameId);
      const player = game?.getPlayer(socket.id);

      if (!player || !player.isGameHost) {
        throw new HostOnlyActionError();
      }
    }

    // Store validated data in request context
    // socket.data = socket.data || {};
    // socket.data[event] = data;

    next(); // Continue if everything is fine
  } catch (error) {
    const customError = error as CustomError;

    // Emit error event to the client
    socket.emit(`${event}--error`, {
      code: customError.code || "VALIDATION_ERROR",
      message: customError.message || "An unexpected error occurred.",
    });

    next(customError)
  }
}