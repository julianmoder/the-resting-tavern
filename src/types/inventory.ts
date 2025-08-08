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
    slot: ItemType | null,
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

export interface ItemDragState {
  draggedItem: Item | null;
  state: string,
  cursorItemOffset: {
    x: number,
    y: number,
  },
  position: Vector2D;
  pixel: Vector2D;
  fromSlot: string | null;
}

export interface Inventory {
  id: string,
  cols: number,
  rows: number,
  items: Item[],
  matrix: Array<Array<{ x: number; y: number; id: string | null }>>
}

export interface Vector2D {
  x: number,
  y: number,
}