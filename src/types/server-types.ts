import { z } from "zod";
import { AllSpaceOptionsSchema } from "./types";
import { ElementalWarriorStarterCardSchema, SageSchema } from "./card-types";

const createGameSchema = z.object({
  userId: z.string(),
  numPlayers: z.union([z.literal(2), z.literal(4)]),
})

const joinGameSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
});

const selectSageSchema = z.object({
  gameId: z.string(),
  sage: SageSchema,
});

const allSagesSelectedSchema = z.object({
  gameId: z.string(),
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

const playerFinishedSetupSchema = z.object({
  gameId: z.string(),
});

const cancelSetupSchema = z.object({
  gameId: z.string(),
})

const allPlayersSetupSchema = z.object({
  gameId: z.string(),
})

const leaveGameSchema = z.object({
  gameId: z.string(),
});

const currentGameStateSchema = z.object({
  gameId: z.string(),
});

const getDayBreakCardsSchema = z.object({
  gameId: z.string(),
});

const activateDayBreakSchema = z.object({
  gameId: z.string(),
  spaceOption: AllSpaceOptionsSchema,
});

export const CreateGameEvent = "create-game" as const;
export const JoinGameEvent = "join-game" as const;
export const SelectSageEvent = "select-sage" as const;
export const AllSagesSelectedEvent = "all-sages-selected" as const;
export const ToggleReadyStatusEvent = "toggle-ready-status" as const;
export const JoinTeamEvent = "join-team" as const;
export const ClearTeamsEvent = "clear-teams" as const;
export const StartGameEvent = "start-game" as const;
export const ChoseWarriorsEvent = "chose-warriors" as const;
export const SwapWarriorsEvent = "swap-warriors" as const;
export const PlayerFinishedSetupEvent = "player-finished-setup" as const;
export const CancelSetupEvent = "cancel-setup" as const;
export const AllPlayersSetupEvent = "all-players-setup" as const;
export const LeaveGameEvent = "leave-game" as const;
export const CurrentGameStateEvent = "current-game-state" as const;
export const GetDayBreakCardsEvent = "get-day-break-cards" as const;
export const ActivateDayBreakEvent = "activate-day-break" as const;

// Define EventSchemas record
export const EventSchemas = {
  [CreateGameEvent]: createGameSchema,
  [JoinGameEvent]: joinGameSchema,
  [SelectSageEvent]: selectSageSchema,
  [AllSagesSelectedEvent]: allSagesSelectedSchema,
  [ToggleReadyStatusEvent]: toggleReadyStatusSchema,
  [JoinTeamEvent]: joinTeamSchema,
  [ClearTeamsEvent]: clearTeamsSchema,
  [StartGameEvent]: startGameSchema,
  [ChoseWarriorsEvent]: choseWarriorsSchema,
  [SwapWarriorsEvent]: swapWarriorsSchema,
  [PlayerFinishedSetupEvent]: playerFinishedSetupSchema,
  [CancelSetupEvent]: cancelSetupSchema,
  [AllPlayersSetupEvent]: allPlayersSetupSchema,
  [LeaveGameEvent]: leaveGameSchema,
  [CurrentGameStateEvent]: currentGameStateSchema,
  [GetDayBreakCardsEvent]: getDayBreakCardsSchema,
  [ActivateDayBreakEvent]: activateDayBreakSchema,
} as const;

// Infer the types from the schemas directly
export type CreateGameData = z.infer<typeof createGameSchema>;
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type AllSagesSelectedData = z.infer<typeof allSagesSelectedSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type ChoseWarriorsData = z.infer<typeof choseWarriorsSchema>;
export type SwapWarriorsData = z.infer<typeof swapWarriorsSchema>;
export type PlayerFinishedSetupData = z.infer<typeof playerFinishedSetupSchema>;
export type CancelSetupData = z.infer<typeof cancelSetupSchema>;
export type AllPlayersSetupData = z.infer<typeof allPlayersSetupSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;
export type CurrentGameStateData = z.infer<typeof currentGameStateSchema>;
export type GetDayBreakCardsData = z.infer<typeof getDayBreakCardsSchema>;
export type ActivateDayBreakData = z.infer<typeof activateDayBreakSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
  [CreateGameEvent]: CreateGameData;
  [JoinGameEvent]: JoinGameData;
  [SelectSageEvent]: SelectSageData;
  [AllSagesSelectedEvent]: AllSagesSelectedData;
  [ToggleReadyStatusEvent]: ToggleReadyStatusData;
  [JoinTeamEvent]: JoinTeamData;
  [ClearTeamsEvent]: ClearTeamsData;
  [StartGameEvent]: StartGameData;
  [ChoseWarriorsEvent]: ChoseWarriorsData;
  [SwapWarriorsEvent]: SwapWarriorsData;
  [PlayerFinishedSetupEvent]: PlayerFinishedSetupData;
  [CancelSetupEvent]: CancelSetupData;
  [AllPlayersSetupEvent]: AllPlayersSetupData;
  [LeaveGameEvent]: LeaveGameData;
  [CurrentGameStateEvent]: CurrentGameStateData;
  [GetDayBreakCardsEvent]: GetDayBreakCardsData;
  [ActivateDayBreakEvent]: ActivateDayBreakData;
}
