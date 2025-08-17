/**
 * The Resting Tavern — HeroRig (Adapter-basiert, Pixi v8 + DragonBones)
 * ---------------------------------------------------------------------
 * - Nutzt den Adapter aus /src/engine/pixi/dragonbonesAdapter.ts
 * - Spielt Animationen via playAnimation()
 * - Tauscht Attachments via replaceSlotDisplay()
 * - Bridge für DB-Events vorhanden; kann bei Bedarf in on()/off() integriert werden.
 */

import type {
  ActionAnim,
  AnimName,
  AnimTrack,
  GripAnim,
  GripSetup,
  IHeroRig,
  LocomotionAnim,
  PlayOptions as RigPlayOptions,
  RigEvent,
  HeroArmorSpec,
  HeroWeaponSpec,
  HeroSlotName,
  HeroAttachPoint,
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

// Optional: Pixi v8 Container-Typen einkommentieren, wenn ihr streng typisieren wollt
// import type { Container } from 'pixi.js';

/** Kleine Event-Emitter-Utility (ohne externe Abhängigkeit) */
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

/** Track-Ermittlung anhand des Animationsnamens */
function resolveTrack(anim: AnimName): AnimTrack {
  if (isLocomotion(anim)) return 0;
  if (isGrip(anim)) return 1;
  return 2; // Actions
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

function isGrip(anim: AnimName): anim is GripAnim {
  return (
    anim === GripAnim.GripOneHanded ||
    anim === GripAnim.GripDualWield ||
    anim === GripAnim.GripTwoHanded ||
    anim === GripAnim.GripBow ||
    anim === GripAnim.GripStaff
  );
}

function isAction(anim: AnimName): anim is ActionAnim {
  return (
    anim === ActionAnim.AttackSlash ||
    anim === ActionAnim.AttackThrust ||
    anim === ActionAnim.Block ||
    anim === ActionAnim.Cast ||
    anim === ActionAnim.Shoot
  );
}

/** GripSetup → Standard-Grip-Animation für den Hero */
function gripAnimFor(setup: GripSetup): GripAnim {
  switch (setup) {
    case GripSetup.OneHanded:
    case GripSetup.OneHandedShield:
      return GripAnim.GripOneHanded;
    case GripSetup.DualWield:
      return GripAnim.GripDualWield;
    case GripSetup.TwoHandedMelee:
      return GripAnim.GripTwoHanded;
    case GripSetup.StaffCast:
      return GripAnim.GripStaff;
    case GripSetup.Bow:
    case GripSetup.Crossbow:
      return GripAnim.GripBow;
  }
}

/** Konstruktor-Parameter, um Adapter & Packnamen einzuspeisen */
export interface HeroRigParams {
  factory: DragonBonesFactoryLike;
  dragonBonesName: string; // z. B. 'hero'
  armatureName: string;    // z. B. 'hero_armature'
}

/**
 * HeroRig:
 * - Erstellt sein ArmatureDisplay via Adapter
 * - Nutzt Adapter für Animations- & Slot-Operationen
 */
export class HeroRig implements IHeroRig {
  private factory: DragonBonesFactoryLike;
  private dragonBonesName: string;
  private armatureName: string;

  private display: ArmatureDisplayLike | null = null;
  private layer: unknown = null; // z. B. Pixi Container
  private events = new Emitter();

  private pos = { x: 0, y: 0 };

  constructor(params: HeroRigParams) {
    this.factory = params.factory;
    this.dragonBonesName = params.dragonBonesName;
    this.armatureName = params.armatureName;

    // ArmatureDisplay bauen
    this.display = buildArmatureDisplay(this.factory, {
      armatureName: this.armatureName,
      dragonBonesName: this.dragonBonesName,
    });

    // Beispiel: DB-Events → interne Bridge (optional)
    onEvent(this.display, 'complete', (evt) => this.events.emit('complete', evt), DefaultDragonBonesEventBridge);
    onEvent(this.display, 'frame', (evt) => this.events.emit('marker', evt), DefaultDragonBonesEventBridge);
  }

  /** Mountet das Rig in eine Rendering-Layer/Stage (Pixi v8: Container.addChild) */
  mount(layer: unknown /* Container */): void {
    this.layer = layer;
    // @ts-ignore (kein harter Pixi-Import, aber übliche API: addChild)
    this.layer?.addChild?.(this.display as any); // Pixi v8: nur Container haben Kinder
  }

  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    if (this.display) {
      // @ts-ignore (typfreie Weitergabe)
      this.display.x = x;
      // @ts-ignore
      this.display.y = y;
    }
  }

  /**
   * Startet eine Animation (Track-Aufteilung bleibt konzeptionell; DB selbst kennt keine numerischen Tracks).
   * Wir nutzen Adapter.playAnimation; Loop → playTimes=0, Mix → fadeIn time (falls unterstützt).
   */
  play(anim: AnimName, loop: boolean = false, mix: number = 0.2): void {
    if (!this.display) return;
    const track = resolveTrack(anim);
    playAnimation(this.display, anim, { loop, mix });

    // Debug/Marker
    this.events.emit('marker', { type: 'play', anim, track, loop, mix });
  }

  on(event: RigEvent, cb: (payload: any) => void): void {
    this.events.on(event, cb);
  }

  off(event: RigEvent, cb: (payload: any) => void): void {
    this.events.off(event, cb);
  }

  equipWeapon(spec: HeroWeaponSpec): void {
    const grip = gripAnimFor(spec.setup);
    this.play(grip, true, 0.2);

    if (!this.display) return;

    // Rechte Hand
    replaceSlotDisplay(
      this.factory,
      this.display,
      HeroAttachPoint.WeaponRGrip,
      spec.rightAttachmentKey,
      this.dragonBonesName,
      this.armatureName
    );

    // Linke Hand (optional)
    if (spec.leftAttachmentKey) {
      replaceSlotDisplay(
        this.factory,
        this.display,
        HeroAttachPoint.WeaponLGrip,
        spec.leftAttachmentKey,
        this.dragonBonesName,
        this.armatureName
      );
    }

    // FX kann hier via extra Slot/Emitter angebunden werden (Adapter-spezifisch)
  }

  equipArmor(spec: HeroArmorSpec): void {
    if (!this.display) return;
    const p = spec.parts || {};
    if (p.chest) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorChest, p.chest, this.dragonBonesName, this.armatureName);
    }
    if (p.pants) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorPants, p.pants, this.dragonBonesName, this.armatureName);
    }
    if (p.arms) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorArms, p.arms, this.dragonBonesName, this.armatureName);
    }
    if (p.back) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorBack, p.back, this.dragonBonesName, this.armatureName);
    }
    if (p.head) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorHead, p.head, this.dragonBonesName, this.armatureName);
    }
    if (p.boots) {
      replaceSlotDisplay(this.factory, this.display, HeroSlotName.ArmorBoots, p.boots, this.dragonBonesName, this.armatureName);
    }
  }

  /** Komfort-Helfer für Actions (nicht verpflichtend) */
  playAction(anim: ActionAnim, opts?: RigPlayOptions): void {
    const loop = opts?.loop ?? false;
    const mix = opts?.mix ?? 0.2;
    this.play(anim, loop, mix);
  }
}
