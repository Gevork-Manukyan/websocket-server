import { Card, ElementalCard, gameId, Sage } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "../constants/decklists";
import { CustomError, NotFoundError, ValidationError } from "../services/CustomError/BaseError";
import { HostOnlyActionError, InvalidSageError } from "../services/CustomError/GameError";
import { AllPlayersSetupEvent, ClearTeamsEvent, EventSchemas, SocketEventMap, StartGameEvent } from "../types/server-types";
import { Socket } from "socket.io";
import { gameStateManager } from "../services/GameStateManager";

/* -------- PRE-GAME -------- */

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

export function socketErrorHandler<T extends keyof SocketEventMap>(
  socket: Socket,
  eventName: T,
  fn: (data: SocketEventMap[T]) => Promise<void>
) {
  return async (rawData: unknown) => {
    try {
      await fn(rawData as SocketEventMap[T])
    } catch (error) {
      handleSocketError(socket, eventName, error as CustomError)
    }
  }
}

export function handleSocketError(
  socket: Socket,
  eventName: string,
  error: CustomError,
) {
  const { message, code, ...rest } = error;

  socket.emit(`${eventName}--error`, {
    code: code || "INTERNAL_ERROR",
    message: message || "An unexpected error occurred.",
    ...rest
  });
}

export function processEvent<T extends keyof SocketEventMap>(socket: Socket, eventName: T, rawData: any, next: (err?: Error) => void) {
  try {
    // Ensure the event is recognized
    if (!(eventName in EventSchemas)) {
      throw new ValidationError(`Unrecognized event: ${eventName}`, rawData);
    }

    // Validate data schema
    const result = EventSchemas[eventName].safeParse(rawData);
    if (!result.success) {
      throw new ValidationError(`Invalid data for event: ${eventName}`, rawData);
    }

    const data = result.data;

    // Check for host-only actions
    const hostOnlyEvents = [StartGameEvent, ClearTeamsEvent, AllPlayersSetupEvent];
    for (const event of hostOnlyEvents) {
      if (eventName === event) {
        const player = gameStateManager.getGame(data.gameId as gameId).getPlayer(socket.id);

        if (!player || !player.getIsGameHost()) {
          throw new HostOnlyActionError();
        }
        break;
      }
    }

    // Store validated data in request context
    // socket.data = socket.data || {};
    // socket.data[event] = data;

    next();
  } catch (error) {
    const customError = error as CustomError;
    handleSocketError(socket, eventName, customError)
    next(customError)
  }
}


/* -------- GAME -------- */

export function drawCardFromDeck<T extends Card>(deck: T[]) {
  if (deck.length === 0) throw new NotFoundError("No cards left in deck", "deck");

  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  deck.splice(randomIndex, 1);

  return card;
}