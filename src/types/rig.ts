import { AnimIntent } from './animation';

export enum GripSetup {
  OneHanded = 'one_handed',
  OneHandedShield = 'one_handed_shield',
  DualWield = 'dual_wield',
  TwoHandedMelee = 'two_handed_melee',
  StaffCast = 'staff_cast',
  Bow = 'bow',
  Crossbow = 'crossbow',
}

export enum RigEvent {
  Complete = 'complete',
  Marker = 'marker',
  Hit = 'hit',
}

export enum HeroSlotName {
  HandRMainhand = 'hand_r_mainhand',
  HandLOffhand = 'hand_l_offhand',
  ArmorChest = 'armor_chest',
  ArmorLegs = 'armor_legs',
  ArmorArms = 'armor_arms',
  ArmorBack = 'armor_back',
  ArmorHead = 'armor_head',
  ArmorBoots = 'armor_boots',
}

export enum HeroAttachPoint {
  WeaponRGrip = 'weapon_r_grip',
  WeaponLGrip = 'weapon_l_grip',
}

export interface HeroWeaponSpec {
  type: 'weapon';
  setup: GripSetup;
  rightAttachmentKey: string;
  leftAttachmentKey?: string;
  offhandFxKey?: string;
}

export interface HeroArmorSpec {
  type: 'armor';
  parts: Partial<{
    chest: string;
    legs: string;
    arms: string;
    back: string;
    head: string;
    boots: string;
  }>;
}

export type HeroEquipSpec = HeroWeaponSpec | HeroArmorSpec;

export interface IHeroRig {
  mount(layer: unknown): void;
  setPosition(x: number, y: number): void;
  play(anim: AnimIntent, loop?: boolean, mix?: number): void;
  on(event: RigEvent, cb: (payload: any) => void): void;
  off(event: RigEvent, cb: (payload: any) => void): void;
  equipWeapon(spec: HeroWeaponSpec): void;
  equipArmor(spec: HeroArmorSpec): void;
}

export interface IBossRig {
  mount(layer: unknown): void;
  setPosition(x: number, y: number): void;
  play(anim: AnimIntent, loop?: boolean, mix?: number): void;
  on(event: RigEvent, cb: (payload: any) => void): void;
  off(event: RigEvent, cb: (payload: any) => void): void;
}
