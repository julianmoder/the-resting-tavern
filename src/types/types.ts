export enum Stage {
  Landing = 'landing',
  Tavern = 'tavern',
  Quest = 'quest',
  Boss = 'boss',
  Loot = 'loot',
  Break = 'break'
}

export enum HeroClass {
  Warrior = 'warrior',
  Wizzard = 'wizzard',
  Ranger = 'ranger',
}

export interface Hero {
  id: string,
  name: string,
  class: HeroClass | null,
  stats: {
    health: number,
    maxHealth: number,
    energy: number,
    maxEnergy: number,
    str: number,
    int: number,
    dex: number,
  },
  xp: number,
  level: number,
  leveledUp: boolean,
  inventory: Inventory,
  equipment: Equipment,
}

export interface Inventory {
  coins: number,
  items: Item[],
}

export interface Equipment {
  weapon: Item | null,
  armor: Item | null,
}

export interface Item extends ItemTemplate {
  id: string,
  power: number,
  modifier: {
    str: number,
    int: number,
    dex: number,
  }
}

export interface ItemTemplate {
  name: string,
  type: string,
  category: string,
  rarity: string,
  level: number,
  affixes: string[],
  fluff: string,
  dropChance: number,
}

export interface Quest {
  name: string,
  duration: number,
  breakTime: number,
  level: number,
  loot: Loot,
}

export interface Loot {
  xp: number,
  coins: number,
  itemChoices: Item[],
}

