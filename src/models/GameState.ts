import { GameStateError } from "../services/CustomError/GameError";
import { gameId } from "../types";

type State = "joining-game" | "joining-teams" | "ready-up" | "starting-setup" | "begin-turn" | "phase1" | "phase2" | "phase3" | "discarding-cards" | "drawing-new-hand" | "end-game" | "game-finished";

type TransitionEvent = 'player-joined' | 'player-selected-sage' | 'all-sages-selected' | 'player-joined-team' | 'clear-teams' | 'all-teams-joined' | 'toggle-ready-status' | 'all-players-ready' | 'choose-warriors' | 'swap-warriors' | 'player-finished-setup' | 'cancel-setup' |'all-players-setup-complete' | 'next-phase' | 'day-break-card' | 'draw-card' | 'swap-cards' | 'summon-card' | 'attack' | 'utility' | 'sage-skill' | 'buy-card' | 'sell-card' | 'refresh-shop' | 'done-discarding-cards' | 'done-drawing-new-hand' | 'win-game';

type Transition = {
    currentStateValue: State;
    possibleInputs: Input[];
}

type Input = {
    acceptableEvents: TransitionEvent[];
    nextState: State;
}

export class GameState {
    gameId: gameId;
    private stateTransitionTable: Transition[] = []
    private currentTransition: Transition;
    
    constructor(gameId: gameId) {
        this.gameId = gameId;
        this.initTransitionTable();
        this.currentTransition = this.stateTransitionTable[0];
    }

    private initTransitionTable() {
        this.addTransition("joining-game", [
            { acceptableEvents: ['player-joined', 'player-selected-sage'], nextState: "joining-game" },
            { acceptableEvents: ['all-sages-selected'], nextState: "joining-teams" }
        ])
        this.addTransition("joining-teams", [
            { acceptableEvents: ['player-joined-team', 'clear-teams'], nextState: "joining-teams" },
            { acceptableEvents: ['all-teams-joined'], nextState: "ready-up" }
        ])
        this.addTransition("ready-up", [
            { acceptableEvents: ['toggle-ready-status'], nextState: "ready-up" },
            { acceptableEvents: ['all-players-ready'], nextState: "starting-setup" }
        ])
        this.addTransition("starting-setup", [
            { acceptableEvents: ['choose-warriors', 'swap-warriors', 'player-finished-setup', 'cancel-setup'], nextState: "starting-setup" },
            { acceptableEvents: ['all-players-setup-complete'], nextState: "begin-turn" }
        ])
        this.addTransition("begin-turn", [
            { acceptableEvents: ['next-phase'], nextState: "phase1" }
        ])
        this.addTransition("phase1", [
            { acceptableEvents: ['day-break-card'], nextState: "phase1" },
            { acceptableEvents: ['next-phase'], nextState: "phase2" }
        ])
        this.addTransition("phase2", [
            { acceptableEvents: ['draw-card', 'swap-cards', 'summon-card', 'attack', 'utility', 'sage-skill'], nextState: "phase2" },
            { acceptableEvents: ['next-phase'], nextState: "phase3" },
            { acceptableEvents: ['win-game'], nextState: "end-game" }
        ])
        this.addTransition("phase3", [
            { acceptableEvents: ['buy-card', 'summon-card', 'sell-card', 'refresh-shop'], nextState: "phase3" },
            { acceptableEvents: ['next-phase'], nextState: "discarding-cards" }
        ])
        this.addTransition("discarding-cards", [
            { acceptableEvents: ['done-discarding-cards'], nextState: "drawing-new-hand" },
        ])
        this.addTransition("drawing-new-hand", [
            { acceptableEvents: ['done-drawing-new-hand'], nextState: "begin-turn" }
        ])
        this.addTransition("end-game", [
            { acceptableEvents: ['win-game'], nextState: "game-finished" }
        ])
    }

    private addTransition(currentStateValue: State, possibleInputs: Input[]) {
        this.stateTransitionTable.push({ currentStateValue, possibleInputs });
    }

    getCurrentTransition() {
        return {
            currentState: this.currentTransition.currentStateValue,
            possibleInputs: this.currentTransition.possibleInputs.map(input => input.acceptableEvents).flat()
        };
    }

    private checkTransitionForEvent(event: TransitionEvent, transition: Transition) {
        return transition.possibleInputs.find(input => input.acceptableEvents.includes(event));
    }

    private findNextTransition(nextState: State) {
        return this.stateTransitionTable.find(transition => transition.currentStateValue === nextState);
    }

    verifyEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(event, this.currentTransition);
        if (!input) throw new GameStateError(`Invalid event: ${event} for current state: ${this.currentTransition.currentStateValue}`);
    }

    processEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(event, this.currentTransition);

        if (!input) throw new GameStateError(`Invalid event: ${event} for current state: ${this.currentTransition.currentStateValue}`);
        const nextTransition = this.findNextTransition(input.nextState);
        
        if (!nextTransition) throw new GameStateError(`Invalid next state: ${input.nextState}`);
        this.currentTransition = nextTransition;
    }
}