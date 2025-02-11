import { gameId } from "../types";
import { TransitionEvent } from "../types/types";

type Transition = {
    currentStateValue: string;
    possibleInputs: Input[];
}

type Input = {
    acceptableEvents: TransitionEvent[];
    nextState: string;
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
        this.addTransition("join-game", [
            { acceptableEvents: ['all-sages-selected'], nextState: "joining-teams" }
        ])
        this.addTransition("joining-teams", [
            { acceptableEvents: ['all-teams-joined'], nextState: "ready-up" }
        ])
        this.addTransition("ready-up", [
            { acceptableEvents: ['all-players-ready'], nextState: "starting-setup" }
        ])
        this.addTransition("starting-setup", [
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

    private addTransition(currentStateValue: string, possibleInputs: Input[]) {
        this.stateTransitionTable.push({ currentStateValue, possibleInputs });
    }

    getCurrentTransition() {
        return this.currentTransition;
    }
}