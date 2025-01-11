import { Card, Character } from "../types";

export class Player {
  id: string;
  isReady: boolean = false;
  isGameHost: boolean;
  characterClass: Character | null = null;
  gold: number = 0;
  level: number = 1;
  hand: Card[] = [];
  deck: Card[] = [];
  discardPile: Card[] = [];

  constructor(socketId: string, isGameHost = false) {
    this.id = socketId;
    this.isGameHost = isGameHost;
  }

  toggleReady() {
    if (!this.characterClass) return;
    this.isReady = !this.isReady;
  }
}
