import type { ItemType, ItemRarity } from '../types/types';

export const itemTemplatesWeapons = [

// melee weapons
  {
    name: 'Wooden Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemType.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 1,
  },
  {
    name: 'Steel Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemType.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 5,
  },
  {
    name: 'Imbued Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemType.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 15,
  },

// ranged weapons
  {
    name: 'Simple Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemType.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 1,
  },
  {
    name: 'Recurve Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemType.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 5,
  },
  {
    name: 'Enchanted Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemType.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 15,
  },

// spell weapons
  {
    name: 'Oak Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemType.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 1,
  },
  {
    name: 'Silverwood Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemType.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 5,
  },
  {
    name: 'Cursed Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemType.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 15,
  }
];