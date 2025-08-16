import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

type Direction = 'left' | 'right' | 'up' | 'down';

export class DodgeDirection implements Interaction {
  name = InteractionName.DodgeDirection;
  private ctx!: InteractionCtx;
  private attackFrom: Direction = 'left';
  private success = false;
  private onCleanup: (() => void) | null = null;

  private static dirs: Direction[] = ['left','right','up','down'];
  private static opposite(d: Direction): Direction {
    if (d === 'left') return 'right';
    if (d === 'right') return 'left';
    if (d === 'up') return 'down';
    return 'up';
  }

  private static attackFrom(d: Direction): string {
    if (d === 'left') return 'It\'s an attack from the left!';
    if (d === 'right') return 'It\'s an attack from the right!';
    if (d === 'up') return 'It\'s an attack from above!';
    return 'It\'s an attack from below!';
  }

  private static dodgeTo(d: Direction): string {
    if (d === 'left') return 'Dodge to the LEFT!';
    if (d === 'right') return 'Dodge to the RIGHT!';
    if (d === 'up') return 'JUMP!';
    return 'DUCK!';
  }

  start(ctx: InteractionCtx) {
    this.ctx = ctx;
    this.attackFrom = DodgeDirection.dirs[Math.floor(Math.random() * DodgeDirection.dirs.length)];
    const need = DodgeDirection.opposite(this.attackFrom);

    const needCode: Record<Direction, KeyboardEvent['code']> = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown',
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code.startsWith('Arrow')) e.preventDefault?.();
      if (e.code === needCode[need]) {
        this.success = true;
        this.ctx.onSuccess?.();
        this.cleanup();
      } else if (
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown'
      ) {
        this.ctx.onFail?.();
        this.cleanup();
      }
    };

    window.addEventListener('keydown', keyHandler, { passive: false });

    const ms = Math.max(0, (this.ctx.deadline ?? 0) - performance.now());
    const timer = window.setTimeout(() => {
      if (!this.success) {
        this.ctx.onFail?.();
        this.cleanup();
      }
    }, ms);

    this.onCleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', keyHandler);
    };
  }

  cleanup() {
    this.onCleanup?.();
    this.onCleanup = null;
  }

  getPrompt(): string {
    const from = DodgeDirection.attackFrom(this.attackFrom);
    const solution = DodgeDirection.opposite(this.attackFrom);
    const to = DodgeDirection.dodgeTo(solution);
    return `Attack from ${from}! ${to}`;
  }
}