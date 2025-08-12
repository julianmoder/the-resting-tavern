import type { Item, Vector2D } from './base';

export enum HeroClass {
  Warrior = 'warrior',
  Wizard = 'wizard',
  Ranger = 'ranger',
}

export interface Hero {
  id: string,
  name: string,
  class: HeroClass | null,
  stats: HeroStats,
  xp: number,
  level: number,
  leveledUp: boolean,
  inventoryID: string | null,
  equipment: Equipment,
  coins: number,
  position: Vector2D,
}

export interface HeroStats {
  health: number,
  maxHealth: number,
  energy: number,
  maxEnergy: number,
  str: number,
  int: number,
  dex: number,
}

export interface Equipment {
  weapon: Item | null,
  armor: Item | null,
}
