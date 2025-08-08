import { ItemType, ItemClass, ItemRarity } from '../types/base';

export const itemTemplatesArmors = [

// light armors
  {
    name: 'Rags',
    type: ItemType.Armor,
    class: ItemClass.Light,
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 25,
    size: {
      width: 2, 
      height: 3,
    },
  },

// heavy armors
  {
    name: 'Chain Shirt',
    type: ItemType.Armor,
    class: ItemClass.Heavy,
    rarity: ItemRarity.Common,
    level: 1,
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 500,
    size: {
      width: 2, 
      height: 2,
    }
  },
  {
    name: 'Scale Mail',
    type: ItemType.Armor,
    class: ItemClass.Heavy,
    rarity: ItemRarity.Uncommon,
    level: 1,
    affixes: ['str', 'int', 'dex'],
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
    affixes: ['str', 'int', 'dex'],
    fluff: 'This is the fluff text',
    dropChance: 25,
    size: {
      width: 2, 
      height: 3,
    },
  }
];