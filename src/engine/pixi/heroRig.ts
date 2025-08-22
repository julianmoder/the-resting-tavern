import { ActionAnim, GripAnim, GripSetup, AnimIntent, RigEvent, HeroSlotName, HeroAttachPoint } from '../../types/base';
import type { AnimName, AnimTrack, IHeroRig, PlayOptions as RigPlayOptions, HeroArmorSpec, HeroWeaponSpec } from '../../types/base';
import type { ArmatureDisplayLike, DragonBonesFactoryLike } from './dragonbonesAdapter';
import { buildArmatureDisplay, DefaultDragonBonesEventBridge, onEvent, offEvent, playAnimation, replaceSlotDisplay } from './dragonbonesAdapter';

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
  if (isGrip(anim)) return 1;
  return 2; // Actions
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

export interface HeroRigParams {
  factory: DragonBonesFactoryLike;
  dragonBonesName: string;
  armatureName: string;
}

export class HeroRig implements IHeroRig {
  private factory: DragonBonesFactoryLike;
  private dragonBonesName: string;
  private armatureName: string;

  private display: ArmatureDisplayLike | null = null;
  private layer: unknown = null;
  private events = new Emitter();

  private pos = { x: 0, y: 0 };

  constructor(params: HeroRigParams) {
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

  mount(layer: unknown): void {
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

  equipWeapon(spec: HeroWeaponSpec): void {
    const grip = gripAnimFor(spec.setup);
    this.play(grip, true, 0.2);

    if (!this.display) return;

    replaceSlotDisplay(
      this.factory,
      this.display,
      HeroAttachPoint.WeaponRGrip,
      spec.rightAttachmentKey,
      this.dragonBonesName,
      this.armatureName
    );

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
  }

  equipArmor(spec: HeroArmorSpec) {
    if (!this.display) return;
    const { parts } = spec;

    const apply = (gameplaySlot: string, displayKey: string) => {
      for (const physicalSlot of resolveHeroSlots(gameplaySlot)) {
        replaceSlotDisplay(
          this.factory,
          this.display,
          physicalSlot,
          displayKey,
          this.dragonBonesName,
          this.armatureName
        );
      }
    };

    if (parts.chest) apply(HeroSlotName.ArmorChest, parts.chest);
    if (parts.legs) apply(HeroSlotName.ArmorLegs, parts.legs);
    if (parts.arms) apply(HeroSlotName.ArmorArms, parts.arms);
    if (parts.back) apply(HeroSlotName.ArmorBack, parts.back);
    if (parts.head) apply(HeroSlotName.ArmorHead, parts.head);
    if (parts.boots) apply(HeroSlotName.ArmorBoots, parts.boots);
  }
}
