class CustomError extends Error {
    code;
    status; 

    constructor(message: string, code: string, status = 400) {
      super(message);
      this.code = code; // Custom error code (e.g., "INVALID_INPUT")
      this.status = status; // HTTP status or similar (e.g., 400 for bad request)
    }
}

/**
 * Use this for handling invalid input from the client.
 * ex) throw new ValidationError("Invalid sage name", "sage");
 */
class ValidationError extends CustomError {
    field;

    constructor(message: string, field: string) {
        super(message, "VALIDATION_ERROR", 422);
        this.field = field; // Name of the invalid field, if applicable
    }
}
  
/**
 * Handle scenarios where users are not authenticated.
 */
class AuthenticationError extends CustomError {
    constructor(message = "Authentication required") {
      super(message, "AUTHENTICATION_ERROR", 401);
    }
}
  
/**
 * Handle scenarios where users are not authenticated or lack necessary permissions.
 */
class AuthorizationError extends CustomError {
    constructor(message = "Access denied") {
      super(message, "AUTHORIZATION_ERROR", 403);
    }
}

/**
 * When a requested resource, such as a game or player, doesn’t exist.
 * ex) throw new NotFoundError("Game", gameId);
 */
class NotFoundError extends CustomError {
    resource;
    identifier;

    constructor(resource: string, identifier: string) {
      super(`${resource} not found`, "NOT_FOUND", 404);
      this.resource = resource; // Name of the resource (e.g., "Game")
      this.identifier = identifier; // Identifier for debugging (e.g., game ID)
    }
}

/**
 * When an operation cannot be completed due to a conflict, such as trying to select an already chosen sage.
 */
class ConflictError extends CustomError {
    constructor(message = "Conflict detected") {
      super(message, "CONFLICT_ERROR", 409);
    }
}

/**
 * For unexpected server-side issues.
 */
class InternalServerError extends CustomError {
    constructor(message = "An internal server error occurred") {
      super(message, "INTERNAL_SERVER_ERROR", 500);
    }
}

/**
 * For issues related to connectivity or transport.
 */
class NetworkError extends CustomError {
    constructor(message = "A network error occurred") {
      super(message, "NETWORK_ERROR", 503);
    }
}
  