export class Player {
    id: string;
    isReady: boolean = false;
    isGameHost;

    constructor(socketId: string, isGameHost = false) {
        this.id = socketId;
        this.isGameHost = isGameHost;
    }

    toggleReady() {
        this.isReady = !this.isReady;
    }
}