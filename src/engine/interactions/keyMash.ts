import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

export class KeyMash implements Interaction {
  name = InteractionName.KeyMash;
  private ctx!: InteractionCtx;
  private done = false;
  private targetKey = 'e';
  private required = 5;
  private progress = 0;

  start(ctx: InteractionCtx) {
    this.ctx = ctx;
    this.done = false;
    this.progress = 0;
  }

  handleInput(e: KeyboardEvent | MouseEvent) {
    if (this.done) return;
    if (e instanceof KeyboardEvent) {
      if (e.key.toLowerCase() === this.targetKey) {
        this.progress++;
        if (this.progress >= this.required) {
          this.done = true;
          this.ctx.onSuccess();
        }
      }
    }
  }

  update(_dt: number, now: number) {
    if (!this.done && now > this.ctx.deadline) {
      this.done = true;
      this.ctx.onFail();
    }
  }

  cleanup() {}

  getPrompt() { 
    return 'Press "E" as fast as you can!'; 
  }
}