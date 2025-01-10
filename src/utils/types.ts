export type gameId = string;
export type CurrentGames = {
    [key: gameId]: Game;
}

export type Game = {
    players: Player[];
}

export type Player = {
    id: string;
}