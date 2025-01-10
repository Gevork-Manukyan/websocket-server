export type gameId = string;
export type CurrentGames = {
  [key: gameId]: Game;
};

export type Game = {
  id: gameId;
  players: Player[];
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: Player["id"]) => void;
};

export type Player = {
  id: string; // socket id
  isReady: boolean;
  isGameHost: boolean;
  toggleReady: () => void;
};
