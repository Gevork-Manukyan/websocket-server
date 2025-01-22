import { Socket } from "socket.io";
import { Sage } from "../types";
import { DropletDeck, LeafDeck, PebbleDeck, TwigDeck } from "./constants";
import { CustomError, ValidationError } from "../services/CustomError/BaseError";
import { InvalidSageError } from "../services/CustomError/GameError";

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

export function handleSocketError(
  socket: Socket,
  eventName: string,
  fn: (...args: any[]) => Promise<void>
): (...args: any[]) => Promise<void> {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (error) {
      const { message, code, ...rest } = error as CustomError;

      socket.emit(`${eventName}--error`, {
        code: code || "INTERNAL_ERROR",
        message: message || "An unexpected error occurred.",
        ...rest
      });
    }
  };
}