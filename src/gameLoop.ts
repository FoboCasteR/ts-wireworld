import { WireWorld } from './wireWorld';
import { Renderer } from './renderer';

export class GameLoop {
  static msPerFrame = 16;
  private isRunned = false;
  private requestId: number;
  private lastTickTs: number;

  constructor(private game: WireWorld, private renderer: Renderer) {}

  start(): void {
    this.isRunned = true;
    this.lastTickTs = Date.now();
    this.requestId = window.requestAnimationFrame(this.boundTick);
  }

  stop(): void {
    this.isRunned = false;
    window.cancelAnimationFrame(this.requestId);
  }

  toggle(): void {
    if (this.isRunned) {
      this.stop();
    } else {
      this.start();
    }
  }

  tick(): void {
    const currentTickTs = Date.now();
    const elapsedTime = currentTickTs - this.lastTickTs;

    if (elapsedTime >= GameLoop.msPerFrame) {
      this.game.update();
      this.renderer.render(this.game.getBoard());
      this.lastTickTs = currentTickTs;
    }

    if (this.isRunned) {
      this.requestId = window.requestAnimationFrame(this.boundTick);
    }
  }

  private boundTick = (): void => {
    this.tick();
  };
}
