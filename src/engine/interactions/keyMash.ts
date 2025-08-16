import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

export class KeyMash implements Interaction {
  name = InteractionName.KeyMash;
  private ctx!: InteractionCtx;
  private pressed = 0;
  private targetCount = 1;
  private targetCode: string = "KeyA";
  private success = false;
  private onCleanup: (() => void) | null = null;

  private static possible = [
    // number keys
    'Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0',
    // letter keys
    'KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL', 'KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP', 'KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM',
    // arrow keys
    "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
    // other keys
    'Space','Enter',
  ] as const;

  private static labelFromCode(code: string): string {
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code === 'Space') return 'Space';
    return code;
  }

  start(ctx: InteractionCtx) {
    this.ctx = ctx;
    this.targetCode = KeyMash.possible[Math.floor(Math.random() * KeyMash.possible.length)];
    const keyHandler = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        e.preventDefault?.();
      }

      if (e.code === this.targetCode) {
        this.pressed++;
        if (this.pressed >= this.targetCount) {
          this.success = true;
          this.ctx.onSuccess?.();
          this.cleanup();
        }
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
      window.removeEventListener("keydown", keyHandler);
    };
  }

  cleanup() {
    this.onCleanup?.();
    this.onCleanup = null;
  }

  getPrompt() {
    const label = KeyMash.labelFromCode(this.targetCode); 
    return `Press "${label}" as fast as you can!`; 
  }
}