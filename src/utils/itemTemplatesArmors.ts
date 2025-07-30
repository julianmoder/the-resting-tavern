import type { ItemType, ItemRarity } from '../types/types';

export const itemTemplatesArmors = [

// cloth armors
  {
    name: 'Rags',
    type: ItemType.Armor,
    category: 'cloth',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 1,
  },
  {
    name: 'Silk Shirt',
    type: ItemType.Armor,
    category: 'cloth',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 5,
  },
  {
    name: 'Scholar\'s Robe',
    type: ItemType.Armor,
    category: 'cloth',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 15,
  },

// leather armors
  {
    name: 'Hide Armor',
    type: ItemType.Armor,
    category: 'leather',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 1,
  },
  {
    name: 'Padded Vest',
    type: ItemType.Armor,
    category: 'leather',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 5,
  },
  {
    name: 'Runed Leather',
    type: ItemType.Armor,
    category: 'leather',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 15,
  },

// mail armors
  {
    name: 'Chain Shirt',
    type: ItemType.Armor,
    category: 'mail',
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 1,
  },
  {
    name: 'Scale Mail',
    type: ItemType.Armor,
    category: 'mail',
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 5,
  },
  {
    name: 'Ornated Halfplate',
    type: ItemType.Armor,
    category: 'mail',
    rarity: ItemRarity.Rare,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 15,
  }
];