import { ItemType, ItemClass, ItemRarity } from '../types/base';

export const itemTemplatesArmors = [

// light armors
  {
    name: 'Rags',
    type: ItemType.Armor,
    class: ItemClass.Light,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 1,
    affixes: ['int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 500,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Silk Shirt',
    type: ItemType.Armor,
    class: ItemClass.Light,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 2,
    affixes: ['int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 200,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Scholar\'s Robe',
    type: ItemType.Armor,
    class: ItemClass.Light,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 3,
    affixes: ['int'],
    fluff: 'This is the fluff text',
    dropChance: 25,
    size: {
      width: 2, 
      height: 3,
    },
  },

// medium armors
  {
    name: 'Hide Armor',
    type: ItemType.Armor,
    class: ItemClass.Medium,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 2,
    affixes: ['dex'],
    fluff: 'This is the fluff text',
    dropChance: 500,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Padded Vest',
    type: ItemType.Armor,
    class: ItemClass.Medium,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 3,
    affixes: ['int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 200,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Runed Leather',
    type: ItemType.Armor,
    class: ItemClass.Medium,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 4,
    affixes: ['str', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 25,
    size: {
      width: 2, 
      height: 3,
    },
  },

// heavy armors
  {
    name: 'Chainmail',
    type: ItemType.Armor,
    class: ItemClass.Heavy,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 3,
    affixes: [],
    fluff: 'This is the fluff text',
    dropChance: 500,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Scale Armor',
    type: ItemType.Armor,
    class: ItemClass.Heavy,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 4,
    affixes: ['str'],
    fluff: 'This is the fluff text',
    dropChance: 200,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Ornated Halfplate',
    type: ItemType.Armor,
    class: ItemClass.Heavy,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 5,
    affixes: ['str', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 25,
    size: {
      width: 2, 
      height: 3,
    },
  }
];