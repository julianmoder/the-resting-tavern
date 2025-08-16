import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

type Direction = 'left'|'right'|'up'|'down';

export class DodgeDirection implements Interaction {
  name = InteractionName.DodgeDirection;
  private ctx!: InteractionCtx;
  private done = false;
  private attackFrom: Direction = 'left';

  start(ctx: InteractionCtx) {
    this.ctx = ctx;
    this.done = false;
    const dirs: Direction[] = ['left','right','up','down'];
    this.attackFrom = dirs[Math.floor(Math.random()*dirs.length)];
  }

  handleInput(e: KeyboardEvent | MouseEvent) {
    if (this.done) return;
    if (e instanceof KeyboardEvent) {
      const need = this.opposite(this.attackFrom);
      const map: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const pressed = map[e.key];
      if (!pressed) return;
      if (pressed === need) {
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

  getPrompt(): string {
    return `Attack from ${this.attackFrom.toUpperCase()}! Dodge ${this.opposite(this.attackFrom).toUpperCase()}!`;
  }

  private opposite(d: Direction): Direction {
    if (d === 'left') return 'right';
    if (d === 'right') return 'left';
    if (d === 'up') return 'down';
    return 'up';
  }
}