type GameState = {
  players: Player[];
};

type Player = {
  id: string;
  name: string;
  token: number;
};

type Message = {
  playerId: string;
  playerName: string;
  message: string;
};
