export interface Quest {
  name: string,
  duration: number,
  breakTime: number,
  level: number,
  loot: Loot,
  xpEarned: boolean,
  lootGained: boolean,
}

export interface Loot {
  xp: number,
  coins: number,
  itemChoices: Item[],
}