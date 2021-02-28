import { CellState } from './cellState';
import { GameBoard } from './gameBoard';
import { GameLoop } from './gameLoop';
import { WireWorld } from './wireWorld';
import { Renderer } from './renderer';

function example(board: GameBoard) {
  for (let x = 0; x < board.width; x++) {
    board.setState(x, board.height / 2, CellState.Conductor);
  }

  board.setState(board.width / 2, board.height / 2, CellState.Head);
  board.setState(board.width / 2 - 1, board.height / 2, CellState.Tail);
}

window.addEventListener('DOMContentLoaded', function () {
  const WIDTH = 500;
  const HEIGHT = 500;
  const SCALE = 10;

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  const renderer = new Renderer(canvas, {scale: 10});
  const game = new WireWorld(WIDTH / SCALE, HEIGHT / SCALE);

  example(game.getBoard());
  renderer.render(game.getBoard());

  const loop = new GameLoop(game, renderer);

  document.getElementById('toggle-button').onclick = function () {
    loop.toggle();
  };

  document.getElementById('step-button').onclick = function () {
    loop.stop();
    game.update();
    renderer.render(game.getBoard());
  };

  document.getElementById('restart-button').onclick = function () {
    example(game.getBoard());
    renderer.render(game.getBoard());
  };

  canvas.addEventListener('mousedown', function (event) {
    const {x, y, button} = event;
    const boardX = Math.floor(x / SCALE) - 1;
    const boardY = Math.floor(y / SCALE) - 1;
    const board = game.getBoard();
    const currentState = board.getState(boardX, boardY);

    if (button === 0) {
      switch (currentState) {
        case CellState.Conductor:
          board.setState(boardX, boardY, CellState.Empty);
          break;
        case CellState.Empty:
          board.setState(boardX, boardY, CellState.Conductor);
          break;
      }
    }

    if (button === 2) {
      switch (currentState) {
        case CellState.Conductor:
          board.setState(boardX, boardY, CellState.Head);
          break;
        case CellState.Head:
          board.setState(boardX, boardY, CellState.Tail);
          break;
        case CellState.Tail:
          board.setState(boardX, boardY, CellState.Conductor);
          break;
      }
    }

    renderer.render(game.getBoard());
  });

  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
});
