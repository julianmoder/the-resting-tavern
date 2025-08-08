export enum HeroClass {
  Warrior = 'warrior',
  Wizzard = 'wizzard',
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
  inventory: Inventory,
  equipment: Equipment,
  coins: number,
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
