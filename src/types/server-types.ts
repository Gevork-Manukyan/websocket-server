import { z } from "zod";
import { SageSchema } from "./types";
import { ElementalWarriorStarterCardSchema } from "./card-types";

// Define each event schema separately
const joinGameSchema = z.object({
  gameId: z.string(),
  numPlayers: z.union([z.literal(2), z.literal(4)]),
});

const selectSageSchema = z.object({
  gameId: z.string(),
  sage: SageSchema, // Ensuring SageSchema is correctly defined
});

const toggleReadyStatusSchema = z.object({
  gameId: z.string(),
});

const joinTeamSchema = z.object({
  gameId: z.string(),
  team: z.union([z.literal(1), z.literal(2)]),
});

const clearTeamsSchema = z.object({
  gameId: z.string(),
});

const startGameSchema = z.object({
  gameId: z.string(),
});

const choseWarriorsSchema = z.object({
  gameId: z.string(),
  choices: z.tuple([ElementalWarriorStarterCardSchema, ElementalWarriorStarterCardSchema]),
});

const finishedSetupSchema = z.object({
  gameId: z.string(),
});

const leaveGameSchema = z.object({
  gameId: z.string(),
});

// Define EventSchemas record
export const EventSchemas = {
  "join-game": joinGameSchema,
  "select-sage": selectSageSchema,
  "toggle-ready-status": toggleReadyStatusSchema,
  "join-team": joinTeamSchema,
  "clear-teams": clearTeamsSchema,
  "start-game": startGameSchema,
  "chose-warriors": choseWarriorsSchema,
  "finished-setup": finishedSetupSchema,
  "leave-game": leaveGameSchema,
} as const;

// Infer the types from the schemas directly
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type ChoseWarriorsData = z.infer<typeof choseWarriorsSchema>;
export type FinishedSetupData = z.infer<typeof finishedSetupSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
  "join-game": JoinGameData;
  "select-sage": SelectSageData;
  "toggle-ready-status": ToggleReadyStatusData;
  "join-team": JoinTeamData;
  "clear-teams": ClearTeamsData;
  "start-game": StartGameData;
  "chose-warriors": ChoseWarriorsData;
  "finished-setup": FinishedSetupData;
  "leave-game": LeaveGameData;
}
