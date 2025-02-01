import { z } from "zod";
import { SageSchema } from "./types";
import { ElementalWarriorStarterCardSchema } from "./card-types";

const createGameSchema = z.object({
  gameId: z.string(),
  numPlayers: z.union([z.literal(2), z.literal(4)]),
})

const joinGameSchema = z.object({
  gameId: z.string(),
});

const selectSageSchema = z.object({
  gameId: z.string(),
  sage: SageSchema,
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

const swapWarriorsSchema = z.object({
  gameId: z.string(),
})

const finishedSetupSchema = z.object({
  gameId: z.string(),
});

const cancelSetupSchema = z.object({
  gameId: z.string(),
})

const leaveGameSchema = z.object({
  gameId: z.string(),
});

export const CreateGameEvent = "create-game" as const;
export const JoinGameEvent = "join-game" as const;
export const SelectSageEvent = "select-sage" as const;
export const ToggleReadyStatusEvent = "toggle-ready-status" as const;
export const JoinTeamEvent = "join-team" as const;
export const ClearTeamsEvent = "clear-teams" as const;
export const StartGameEvent = "start-game" as const;
export const ChoseWarriorsEvent = "chose-warriors" as const;
export const SwapWarriorsEvent = "swap-warriors" as const;
export const FinishedSetupEvent = "finished-setup" as const;
export const CancelSetupEvent = "cancel-setup" as const;
export const LeaveGameEvent = "leave-game" as const;

// Define EventSchemas record
export const EventSchemas = {
  [CreateGameEvent]: createGameSchema,
  [JoinGameEvent]: joinGameSchema,
  [SelectSageEvent]: selectSageSchema,
  [ToggleReadyStatusEvent]: toggleReadyStatusSchema,
  [JoinTeamEvent]: joinTeamSchema,
  [ClearTeamsEvent]: clearTeamsSchema,
  [StartGameEvent]: startGameSchema,
  [ChoseWarriorsEvent]: choseWarriorsSchema,
  [SwapWarriorsEvent]: swapWarriorsSchema,
  [FinishedSetupEvent]: finishedSetupSchema,
  [CancelSetupEvent]: cancelSetupSchema,
  [LeaveGameEvent]: leaveGameSchema,
} as const;

// Infer the types from the schemas directly
export type CreateGameData = z.infer<typeof createGameSchema>;
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type ChoseWarriorsData = z.infer<typeof choseWarriorsSchema>;
export type SwapWarriorsData = z.infer<typeof swapWarriorsSchema>;
export type FinishedSetupData = z.infer<typeof finishedSetupSchema>;
export type CancelSetupData = z.infer<typeof cancelSetupSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
  [CreateGameEvent]: CreateGameData;
  [JoinGameEvent]: JoinGameData;
  [SelectSageEvent]: SelectSageData;
  [ToggleReadyStatusEvent]: ToggleReadyStatusData;
  [JoinTeamEvent]: JoinTeamData;
  [ClearTeamsEvent]: ClearTeamsData;
  [StartGameEvent]: StartGameData;
  [ChoseWarriorsEvent]: ChoseWarriorsData;
  [SwapWarriorsEvent]: SwapWarriorsData;
  [FinishedSetupEvent]: FinishedSetupData;
  [CancelSetupEvent]: CancelSetupData;
  [LeaveGameEvent]: LeaveGameData;
}
