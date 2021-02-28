import { CellState } from './cellState';
import { GameBoard } from './gameBoard';

export class WireWorld {
  private primaryBoard: GameBoard;
  private secondaryBoard: GameBoard;

  constructor(width: number, height: number) {
    this.primaryBoard = new GameBoard(width, height);
    this.secondaryBoard = new GameBoard(width, height);
  }

  update(): this {
    const { primaryBoard: board, secondaryBoard: nextBoard } = this;
    let electrons: number;

    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {

        switch (board.getState(x, y)) {
          case CellState.Conductor:
            electrons = board.countElectrons(x, y);

            if (electrons === 1 || electrons === 2) {
              nextBoard.setState(x, y, CellState.Head);
            } else {
              nextBoard.setState(x, y, CellState.Conductor);
            }

            break;
          case CellState.Head:
            nextBoard.setState(x, y, CellState.Tail);
            break;
          case CellState.Tail:
            nextBoard.setState(x, y, CellState.Conductor);
            break;
          case CellState.Empty:
            nextBoard.setState(x, y, CellState.Empty);
            break;
        }
      }
    }

    this.primaryBoard = nextBoard;
    this.secondaryBoard = board;

    return this;
  }

  getBoard(): GameBoard {
    return this.primaryBoard;
  }
}
