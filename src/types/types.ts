export interface UIHelper {
  ui: {
    sidebar: {
      showCharacter: boolean
    }
  }
}

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
  },
  position: {
    x: number, 
    y: number,
  }
}

export interface ItemTemplate {
  name: string,
  type: ItemType,
  category: string,
  rarity: string,
  level: number,
  affixes: string[],
  fluff: string,
  dropChance: number,
  size: {
    width: number, 
    height: number,
  }
}

export enum ItemType {
  Weapon = 'weapon',
  Armor = 'armor',
}

export enum ItemRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Mythic = 'mythic',
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

