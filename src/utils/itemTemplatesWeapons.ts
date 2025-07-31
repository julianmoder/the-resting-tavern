import { ItemType, ItemRarity } from '../types/types';

export const itemTemplatesWeapons = [

// melee weapons
  {
    name: 'Wooden Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 100,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Steel Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 50,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Imbued Sword',
    type: ItemType.Weapon,
    category: 'melee',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  },

// ranged weapons
  {
    name: 'Simple Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 100,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Recurve Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 50,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Enchanted Bow',
    type: ItemType.Weapon,
    category: 'ranged',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  },

// spell weapons
  {
    name: 'Oak Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 100,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Silverwood Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 50,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Cursed Staff',
    type: ItemType.Weapon,
    category: 'spell',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  }
];