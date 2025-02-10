type GameState = {
  players: Player[];
};

type Player = {
  id: string;
  name: string;
  token: number;
};

type Message = {
  playerName: string;
  message: string;
  timestamp: Date;
};
