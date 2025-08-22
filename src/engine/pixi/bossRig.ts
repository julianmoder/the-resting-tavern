import { AnimIntent, RigEvent } from '../../types/base';
import type { AnimName, AnimTrack, IBossRig } from '../../types/base';
import type { ArmatureDisplayLike, DragonBonesFactoryLike } from './dragonbonesAdapter';
import { buildArmatureDisplay, DefaultDragonBonesEventBridge, onEvent, playAnimation } from './dragonbonesAdapter';

class Emitter {
  private map = new Map<string, Set<(p: any) => void>>();
  on(evt: string, cb: (p: any) => void) {
    if (!this.map.has(evt)) this.map.set(evt, new Set());
    this.map.get(evt)!.add(cb);
  }
  off(evt: string, cb: (p: any) => void) {
    this.map.get(evt)?.delete(cb);
  }
  emit(evt: string, payload?: any) {
    this.map.get(evt)?.forEach((cb) => cb(payload));
  }
}

function resolveTrack(anim: AnimName): AnimTrack {
  if (isAnimIntent(anim)) return 0;
  return 2;
}

function isAnimIntent(anim: AnimName): anim is AnimIntent {
  return (
    anim === AnimIntent.Idle ||
    anim === AnimIntent.Windup ||
    anim === AnimIntent.Mechanic ||
    anim === AnimIntent.MechSuccess ||
    anim === AnimIntent.MechFail ||
    anim === AnimIntent.Attack ||
    anim === AnimIntent.Block ||
    anim === AnimIntent.Hurt ||
    anim === AnimIntent.Victory ||
    anim === AnimIntent.Defeat
  );
}

export interface BossRigParams {
  factory: DragonBonesFactoryLike;
  dragonBonesName: string;
  armatureName: string;
}

export class BossRig implements IBossRig {
  private factory: DragonBonesFactoryLike;
  private dragonBonesName: string;
  private armatureName: string;

  private display: ArmatureDisplayLike | null = null;
  private layer: unknown = null;
  private events = new Emitter();
  private pos = { x: 0, y: 0 };

  constructor(params: BossRigParams) {
    this.factory = params.factory;
    this.dragonBonesName = params.dragonBonesName;
    this.armatureName = params.armatureName;

    this.display = buildArmatureDisplay(this.factory, {
      armatureName: this.armatureName,
      dragonBonesName: this.dragonBonesName,
    });

    onEvent(this.display, 'complete', (evt) => this.events.emit('complete', evt), DefaultDragonBonesEventBridge);
    onEvent(this.display, 'frame', (evt) => this.events.emit('marker', evt), DefaultDragonBonesEventBridge);
  }

  mount(layer: unknown ): void {
    this.layer = layer;
    // @ts-ignore
    this.layer?.addChild?.(this.display as any);
  }

  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    if (this.display) {
      // @ts-ignore
      this.display.x = x;
      // @ts-ignore
      this.display.y = y;
    }
  }

  play(anim: AnimName, loop: boolean = false, mix: number = 0.2): void {
    if (!this.display) return;
    const track = resolveTrack(anim);
    playAnimation(this.display, anim, { loop, mix });
    this.events.emit('marker', { type: 'play', anim, track, loop, mix });
  }

  on(event: RigEvent, cb: (payload: any) => void): void {
    this.events.on(event, cb);
  }

  off(event: RigEvent, cb: (payload: any) => void): void {
    this.events.off(event, cb);
  }
}
