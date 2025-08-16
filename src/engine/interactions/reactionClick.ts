import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

export class ReactionClick implements Interaction {
  name = InteractionName.ReactionClick;
  private ctx!: InteractionCtx;
  private done = false;
  private armedAt = 0;

  start(ctx: InteractionCtx) {
    this.ctx = ctx;
    this.done = false;
    // random fuse to arm button
    this.armedAt = ctx.now + 250 + Math.random() * 400; // ~250-650ms
  }

  handleInput(e: KeyboardEvent | MouseEvent) {
    if (this.done) return;
    // only reacts to click
    if (e instanceof MouseEvent) {
      const t = performance.now();
      if (t >= this.armedAt && t <= this.ctx.deadline) {
        this.done = true;
        this.ctx.onSuccess();
      } else {
        this.done = true;
        this.ctx.onFail();
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
    return 'Click in the right moment!'; 
  }
}