export interface UIHelper {
  sidebar: {
    showCharacter: boolean
  }
}

export interface Modal {
  showModal: boolean;
  title: string;
  message: string;
  type?: ModalType,
  onClose?: () => void,
};

export enum ModalType {
  Default = 'default',
  Warning = 'warning',
  Alert = 'alert',
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
  stats: HeroStats,
  xp: number,
  level: number,
  leveledUp: boolean,
  inventory: Inventory,
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

export interface Inventory {
  coins: number,
  items: Item[],
  equipment: Equipment,
  cols: number,
  rows: number,
  matrix: Array<Array<{ x: number; y: number; id: string | null }>>
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

export interface Vector2D {
  x: number,
  y: number,
}

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

