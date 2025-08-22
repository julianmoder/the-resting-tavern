export enum AnimIntent {
  Idle = 'idle',
  Windup = 'windup',
  Mechanic = 'mechanic',
  MechSuccess = 'mechSuccess',
  MechFail = 'mechFail',
  Attack = 'attack',
  Block = 'block',
  Hurt = 'hurt',
  Victory = 'victory',
  Defeat = 'defeat',
}

export enum GripAnim {
  GripOneHanded = 'grip_one_handed',
  GripDualWield = 'grip_dual_wield',
  GripTwoHanded = 'grip_two_handed',
  GripBow = 'grip_bow',
  GripStaff = 'grip_staff',
}

export enum ActionAnim {
  Attack = 'attack',
  AttackSlash = 'attack_slash',
  AttackThrust = 'attack_thrust',
  Block = 'block',
  Cast = 'cast',
  Shoot = 'shoot',
}

export type AnimName = AnimIntent | GripAnim | ActionAnim;

export type AnimTrack = 0 | 1 | 2;

export interface PlayOptions {
  loop?: boolean;
  mix?: number;
}
