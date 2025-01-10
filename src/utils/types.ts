export type gameId = string;
export type CurrentGames = {
    [key: gameId]: Game;
}

export type Game = {
    id: gameId;
    players: Player[];
}

export type Player = {
    id: string; // socket id
    readyStatus: boolean;
}