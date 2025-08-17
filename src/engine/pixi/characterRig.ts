import { Container, Graphics } from 'pixi.js';

export class CharacterRig {
  root: Container;
  private body: Graphics;

  constructor() {
    this.root = new Container();
    this.root.label = 'CharacterRig';
    this.body = new Graphics().roundRect(0, 0, 50, 120, 12).fill(0x33e7d3);
    this.body.position.set(-40, -120);
    this.root.addChild(this.body);
  }

  mount(parent: Container) {
    parent.addChild(this.root);
  }

  setPosition(x: number, y: number) {
    this.root.position.set(x, y);
  }

  play(anim: 'idle' | 'attack' | 'block' | 'hurt' = 'idle') {
    if (anim === 'attack') this.body.tint = 0xffd166;
    else if (anim === 'block') this.body.tint = 0x60a5fa;
    else if (anim === 'hurt') this.body.tint = 0xf87171;
    else this.body.tint = 0xffffff;
  }

  destroy() {
    this.root.destroy({ children: true });
  }
}