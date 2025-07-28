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

export interface Item {
  name: string,
  type: string,
  category: string,
  rarity: string,
  chance: number,
  power: number,
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

