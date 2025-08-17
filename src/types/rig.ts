/**
 * The Resting Tavern — Rig Type Definitions (Hero/Boss getrennt, Enum-Version)
 * ----------------------------------------------------------------------------
 * - String-Enums für Slots, Setups, Animations & Events.
 * - Klare Trennung: Hero* vs. Boss*.
 * - Gemeinsame Konzepte (z. B. GripSetup) liegen in Shared-Enums.
 */

//
// Shared (für beide Rigs nutzbar)
//

/** Wie eine Waffe gehalten/benutzt wird (beeinflusst Posen/Attachments) */
export enum GripSetup {
  OneHanded = 'one_handed',
  OneHandedShield = 'one_handed_shield',
  DualWield = 'dual_wield',
  TwoHandedMelee = 'two_handed_melee',
  StaffCast = 'staff_cast',
  Bow = 'bow',
  Crossbow = 'crossbow',
}

/** Lokomotion/Grundzustände (können von Hero & Boss verwendet werden) */
export enum LocomotionAnim {
  Idle = 'idle',
  Walk = 'walk',
  Run = 'run',
  Hurt = 'hurt',
  Die = 'die',
  Win = 'win',
}

/** Upper-Body/Grip-Posen (v. a. Hero; Boss kann eigene definieren) */
export enum GripAnim {
  GripOneHanded = 'grip_one_handed',
  GripDualWield = 'grip_dual_wield',
  GripTwoHanded = 'grip_two_handed',
  GripBow = 'grip_bow',
  GripStaff = 'grip_staff',
}

/** Generische Actionnamen (Hero & manche Bosse) */
export enum ActionAnim {
  AttackSlash = 'attack_slash',
  AttackThrust = 'attack_thrust',
  Block = 'block',
  Cast = 'cast',
  Shoot = 'shoot',
}

/** Gesamtsicht auf Animationsnamen (erweiterbar um BossActionAnim) */
export type AnimName = LocomotionAnim | GripAnim | ActionAnim;

/** Runtime-/Clip-Events, die ins Gameplay gespiegelt werden */
export enum RigEvent {
  Complete = 'complete',
  Marker = 'marker',
  Hit = 'hit',
}

/** Track-Indizes (0: Locomotion, 1: Grip/Upper, 2: Actions) */
export type AnimTrack = 0 | 1 | 2;

export interface PlayOptions {
  loop?: boolean;
  mix?: number; // Crossfade-Dauer in Sekunden
}

//
// HERO — Slots, Attach-Points & Specs
//

/** Slots/Flächen im Hero-Rig (Rüstung & Hände) */
export enum HeroSlotName {
  HandRMainhand = 'hand_r_mainhand',
  HandLOffhand = 'hand_l_offhand',
  ArmorChest = 'armor_chest',
  ArmorPants = 'armor_pants',
  ArmorArms = 'armor_arms',
  ArmorBack = 'armor_back',
  ArmorHead = 'armor_head',
  ArmorBoots = 'armor_boots',
}

/**
 * Interne Attach-Points des Hero-Rigs.
 * Diese sind keine Inventar-Slots, sondern Bone/Slot-Namen am Rig,
 * an denen Weapon-Meshes befestigt werden.
 */
export enum HeroAttachPoint {
  WeaponRGrip = 'weapon_r_grip',
  WeaponLGrip = 'weapon_l_grip',
}

/** Hero-Waffe belegt immer beide Gameplay-Hand-Slots */
export interface HeroWeaponSpec {
  type: 'weapon';
  setup: GripSetup;
  /** z. B. 'weapon__sword__iron_01', 'weapon__greatsword__steel_01' */
  rightAttachmentKey: string;
  /** optional: Schild, zweite Klinge, Orb … */
  leftAttachmentKey?: string;
  /** optionaler Offhand-FX (z. B. leuchtende Kugel) */
  offhandFxKey?: string;
}

/** Ein Armor-Item kann mehrere Render-Flächen beliefern */
export interface HeroArmorSpec {
  type: 'armor';
  parts: Partial<{
    chest: string;
    pants: string;
    arms: string;
    back: string;
    head: string;
    boots: string;
  }>;
}

export type HeroEquipSpec = HeroWeaponSpec | HeroArmorSpec;

/** Öffentliche Hero-Rig-API (falls extern typisieren) */
export interface IHeroRig {
  mount(layer: unknown): void;
  setPosition(x: number, y: number): void;

  play(anim: AnimName, loop?: boolean, mix?: number): void;
  on(event: RigEvent, cb: (payload: any) => void): void;
  off(event: RigEvent, cb: (payload: any) => void): void;

  equipWeapon(spec: HeroWeaponSpec): void;
  equipArmor(spec: HeroArmorSpec): void;
}

//
// BOSS — Slots & Specs (absichtlich generischer gehalten; Bosse variieren stark)
//

/**
 * Boss-Slots als Ausgangspunkt.
 * Je Boss könnt ihr eine spezifische Ableitung/Erweiterung definieren (z. B. Tentakel, Kanonen, Kristalle).
 */
export enum BossSlotName {
  Weapon
