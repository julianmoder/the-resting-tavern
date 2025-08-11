import { Application } from 'pixi.js';

export type PixiAppOptions = {
  backgroundAlpha?: number;
  antialias?: boolean;
  baseWidth?: number;
  baseHeight?: number;
};

const IS_DEV = typeof import.meta !== 'undefined' && !!(import.meta as any).env?.DEV;

export class PixiBoot {
  app: Application | null = null;
  private container: HTMLDivElement | null = null;
  private ro: ResizeObserver | null = null;
  private baseW = 1280;
  private baseH = 720;

  get stage()   { return this.app?.stage ?? null; }
  get isReady() { return !!this.app; }
  get appRef()  { return this.app; } // optional convenience

  async init(container: HTMLDivElement, opts: PixiAppOptions = {}) {
    this.container = container;
    this.baseW = opts.baseWidth ?? 1280;
    this.baseH = opts.baseHeight ?? 720;

    for (const c of Array.from(container.querySelectorAll('canvas'))) c.remove();

    if (IS_DEV && !container.dataset.rtPixiDevProbeDone) {
      container.dataset.rtPixiDevProbeDone = '1';
      return;
    }

    const app = new Application();
    await app.init({
      width: this.baseW,
      height: this.baseH,
      backgroundAlpha: opts.backgroundAlpha ?? 0,
      antialias: opts.antialias ?? true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    (app.canvas as any).dataset.rtPixi = '1';
    (app.canvas.style as any).display = 'block';
    if (app.canvas.parentElement !== container) {
      container.appendChild(app.canvas);
    }

    this.app = app;

    this.fitToContainer();
    this.ro = new ResizeObserver(() => this.fitToContainer());
    this.ro.observe(container);
  }

  private fitToContainer() {
    if (!this.app || !this.container) return;
    const cw = this.container.clientWidth  || 1;
    const ch = this.container.clientHeight || 1;

    this.app.renderer.resize(cw, ch);

    const scale = Math.min(cw / this.baseW, ch / this.baseH);

    const stage = this.app.stage;
    stage.scale.set(scale);
    stage.position.set(
      (cw - this.baseW * scale) * 0.5,
      (ch - this.baseH * scale) * 0.5
    );
  }

  destroy() {
    this.ro?.disconnect();
    this.ro = null;

    if (this.app) {
      try { this.app.destroy(); } finally { this.app = null; }
    }

    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }
}