import { InteractionName } from '../../types/base';
import type { Interaction, InteractionCtx } from '../../types/base';

export class ReactionClick implements Interaction {
  name = InteractionName.ReactionClick;
  private ctx!: InteractionCtx;
  private success = false;
  private buttonEl: HTMLButtonElement | null = null;

  start(ctx: InteractionCtx) {
    this.ctx = ctx;

    const bossX = this.ctx.bossPos.x;
    const bossY = this.ctx.bossPos.y;
    const radius = 250;
    const angle = Math.PI + Math.random() * (Math.PI / 2); 
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    const pos = this.ctx.worldToScreen(bossX + offsetX, bossY + offsetY);

    this.buttonEl = document.createElement("button");
    this.buttonEl.className = "absolute w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg animate-bounce z-[9999] pointer-events-auto";

    this.buttonEl.style.left = `${pos.left}px`;
    this.buttonEl.style.top = `${pos.top}px`;
    this.buttonEl.style.position = "absolute";
    this.buttonEl.style.transform = "translate(-50%, -50%)";

    const host = this.ctx.hostEl;
    host.appendChild(this.buttonEl);

    const clickHandler = () => {
      if (this.success) return;
      this.success = true;
      this.ctx.onSuccess();
      this.cleanup();
    };

    this.buttonEl.addEventListener("click", clickHandler);
    const timer = window.setTimeout(() => {
      if (this.success) return;
      this.ctx.onFail();
      this.cleanup();
    }, (this.ctx.deadline ?? 0) - performance.now());

    this.onCleanup = () => {
      window.clearTimeout(timer);
      this.buttonEl?.removeEventListener("click", clickHandler);
      this.buttonEl?.remove();
      this.buttonEl = null;
    };
  }

  cleanup() {
    this.onCleanup?.();
    this.onCleanup = null;
  }

  getPrompt() { 
    return 'Click in the Target!'; 
  }
}