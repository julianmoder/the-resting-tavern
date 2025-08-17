/**
 * The Resting Tavern — BossRig (Adapter-basiert, Pixi v8 + DragonBones)
 * ---------------------------------------------------------------------
 * - Eigene Klasse für Bosse, getrennt vom HeroRig.
 * - Nutzt den Adapter für Build/Play/Replace/Events.
 * - Einheitlicher Entry-Point equip(spec) für sehr unterschiedliche Bosse.
 */

import type {
  ActionAnim,
  AnimName,
  AnimTrack,
  BossEquipSpec,
  BossSlotName,
  IBossRig,
  LocomotionAnim,
  PlayOptions as RigPlayOptions,
  RigEvent,
} from '../../types/rig';

import type {
  ArmatureDisplayLike,
  DragonBonesFactoryLike,
} from './dragonbonesAdapter';
import {
  buildArmatureDisplay,
  DefaultDragonBonesEventBridge,
  onEvent,
  offEvent,
  playAnimation,
  replaceSlotDisplay,
} from './dragonbonesAdapter';

// import type { Container } from 'pixi.js';

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
  if (isLocomotion(anim)) return 0;
  return 2; // Bosse nutzen häufig direkt Actions; separate Upper-Body-Layer optional
}

function isLocomotion(anim: AnimName): anim is LocomotionAnim {
  return (
    anim === LocomotionAnim.Idle ||
    anim === LocomotionAnim.Walk ||
    anim === LocomotionAnim.Run ||
    anim === LocomotionAnim.Hurt ||
    anim === LocomotionAnim.Die ||
    anim === LocomotionAnim.Win
  );
}

export interface BossRigParams {
  factory: DragonBonesFactoryLike;
  dragonBonesName: string; // z. B. 'golem'
  armatureName: string;    // z. B. 'golem_armature'
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

  mount(layer: unknown /* Container */): void {
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

  equip(spec: BossEquipSpec): void {
    if (!this.display) return;

    if (spec.type === 'weapon') {
      replaceSlotDisplay(
        this.factory,
        this.display,
        BossSlotName.WeaponPrimary,
        spec.primaryAttachmentKey,
        this.dragonBonesName,
        this.armatureName
      );

      if (spec.secondaryAttachmentKey) {
        replaceSlotDisplay(
          this.factory,
          this.display,
          BossSlotName.WeaponSecondary,
          spec.secondaryAttachmentKey,
          this.dragonBonesName,
          this.armatureName
        );
      }
    } else if (spec.type === 'armor') {
      const p = spec.parts || {};
      if (p.body) {
        replaceSlotDisplay(
          this.factory,
          this.display,
          BossSlotName.ArmorBody,
          p.body,
          this.dragonBonesName,
          this.armatureName
        );
      }
      if (p.extra) {
        replaceSlotDisplay(
          this.factory,
          this.display,
          BossSlotName.ArmorExtra,
          p.extra,
          this.dragonBonesName,
          this.armatureName
        );
      }
    }
  }

  playAction(anim: ActionAnim, opts?: RigPlayOptions): void {
    const loop = opts?.loop ?? false;
    const mix = opts?.mix ?? 0.2;
    this.play(anim, loop, mix);
  }
}
