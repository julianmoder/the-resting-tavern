import { Container, Graphics, Rectangle } from 'pixi.js';

export class BossRig {
  root: Container;
  private body: Graphics;

  onClick?: () => void;

  constructor() {
    this.root = new Container();
    this.root.label = 'BossRig';

    this.body = new Graphics()
      .roundRect(0, 0, 120, 160, 16)
      .fill(0x8b5cf6);
    this.body.position.set(-60, -160);
    this.root.addChild(this.body);

    this.root.eventMode = 'static';
    this.root.cursor = 'pointer';

    this.root.hitArea = new Rectangle(-70, -180, 140, 200);

    this.root.on('pointerdown', () => {
      this.onClick?.();
    });
  }

  mount(parent: Container) {
    parent.addChild(this.root);
  }

  setPosition(x: number, y: number) {
    this.root.position.set(x, y);
  }

  play(anim: 'idle' | 'attack' | 'block' | 'hurt' = 'idle') {
    if (anim === 'attack') this.body.tint = 0xffa500;
    else if (anim === 'block') this.body.tint = 0x60a5fa;
    else if (anim === 'hurt') this.body.tint = 0xf87171;
    else this.body.tint = 0xffffff;
  }

  destroy() {
    this.root.removeAllListeners();
    this.root.destroy({ children: true });
  }
}