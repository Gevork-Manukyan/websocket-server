import { z } from "zod";


export const EventSchemas: Record<string, z.ZodSchema> = {
  "join-game": z.object({
    gameId: z.string(),
    numPlayers: z.number().int().positive(),
  }),
  "select-sage": z.object({
    gameId: z.string(),
    sage: z.string(), // Adjust type as needed
  }),
  "toggle-ready-status": z.object({ gameId: z.string() }),
  "join-team": z.object({
    gameId: z.string(),
    team: z.union([z.literal(1), z.literal(2)]),
  }),
  "start-game": z.object({ gameId: z.string() }),
  "chose-warriors": z.object({
    gameId: z.string(),
    choices: z.tuple([z.any(), z.any()]), // Adjust type if needed
  }),
  "finished-setup": z.object({ gameId: z.string() }),
  "leave-game": z.object({ gameId: z.string() }),
};