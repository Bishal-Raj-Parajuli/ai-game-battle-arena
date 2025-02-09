export default class Game {
  private static game: Game;
  state: GameState;
  constructor() {
    this.state = {
      players: [],
    };
  }

  static getInstance() {
    if (!this.game) {
      this.game = new Game();
    }
    return this.game;
  }
}
