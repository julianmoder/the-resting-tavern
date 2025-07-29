export enum Stage {
  Landing = 'landing',
  Tavern = 'tavern',
  Quest = 'quest',
  Boss = 'boss',
  Loot = 'loot',
  Break = 'break'
}

export interface Hero {
  name: string,
  xp: number,
  level: number,
  leveledUp: boolean,
  inventory: Inventory,
}

export interface Inventory {
  coins: number,
  items: Item[],
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

