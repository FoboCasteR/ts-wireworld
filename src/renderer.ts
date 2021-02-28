import { CellState } from './cellState';
import { GameBoard } from './gameBoard';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, options: {scale?: number}) {
    const ctx = canvas.getContext('2d');

    ctx.scale(options.scale, options.scale);
    ctx.imageSmoothingEnabled = false;

    this.ctx = ctx;
  }

  render(gameBoard: GameBoard): void {
    const imageData = this.ctx.getImageData(
      0,
      0,
      gameBoard.width,
      gameBoard.height
    );

    const buffer = new ArrayBuffer(imageData.data.length);
    const pixels = new Uint32Array(buffer);

    for (let y = 0; y < gameBoard.height; y++) {
      for (let x = 0; x < gameBoard.width; x++) {
        const index = y * gameBoard.width + x;

        switch (gameBoard.getState(x, y)) {
          case CellState.Head:
            pixels[index] = 0xffff0000;
            break;
          case CellState.Tail:
            pixels[index] = 0xff0000ff;
            break;
          case CellState.Conductor:
            pixels[index] = 0xff00ffff;
            break;
          default:
            pixels[index] = 0xff000000;
        }
      }
    }

    imageData.data.set(new Uint8ClampedArray(buffer));

    this.ctx.putImageData(imageData, 0, 0);
    this.ctx.drawImage(this.ctx.canvas, 0, 0);
  }
}
