import { ItemType, ItemClass, ItemRarity } from '../types/base';

export const itemTemplatesWeapons = [

// melee weapons
  {
    name: 'Wooden Club',
    type: ItemType.Weapon,
    class: ItemClass.Melee,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 2,
    attackSpeed: 0.25,
    affixes: [],
    fluff: 'This is the fluff text.',
    dropChance: 500,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Steel Sword',
    type: ItemType.Weapon,
    class: ItemClass.Melee,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 2,
    attackSpeed: 0.25,
    affixes: ['str'],
    fluff: 'This is the fluff text.',
    dropChance: 200,
    size: {
      width: 1, 
      height: 4,
    }
  },
  {
    name: 'Imbued Sword',
    type: ItemType.Weapon,
    class: ItemClass.Melee,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 3,
    attackSpeed: 0.25,
    affixes: ['str', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  },

// ranged weapons
  {
    name: 'Simple Crossbow',
    type: ItemType.Weapon,
    class: ItemClass.Ranged,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 2,
    attackSpeed: 0.25,
    affixes: [],
    fluff: 'This is the fluff text.',
    dropChance: 500,
    size: {
      width: 2, 
      height: 3,
    }
  },
  {
    name: 'Recurve Bow',
    type: ItemType.Weapon,
    class: ItemClass.Ranged,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 2,
    attackSpeed: 0.25,
    affixes: ['dex'],
    fluff: 'This is the fluff text.',
    dropChance: 200,
    size: {
      width: 2, 
      height: 4,
    }
  },
  {
    name: 'Enchanted Bow',
    type: ItemType.Weapon,
    class: ItemClass.Ranged,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 3,
    attackSpeed: 0.25,
    affixes: ['int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  },

// spell weapons
  {
    name: 'Oak Wand',
    type: ItemType.Weapon,
    class: ItemClass.Spell,
    rarity: ItemRarity.Common,
    level: 1,
    basePower: 1,
    attackSpeed: 0.25,
    affixes: ['int'],
    fluff: 'This is the fluff text.',
    dropChance: 500,
    size: {
      width: 1, 
      height: 3,
    }
  },
  {
    name: 'Silverwood Staff',
    type: ItemType.Weapon,
    class: ItemClass.Spell,
    rarity: ItemRarity.Uncommon,
    level: 1,
    basePower: 2,
    attackSpeed: 0.25,
    affixes: ['int', 'dex'],
    fluff: 'This is the fluff text.',
    dropChance: 200,
    size: {
      width: 1, 
      height: 4,
    }
  },
  {
    name: 'Cursed Staff',
    type: ItemType.Weapon,
    class: ItemClass.Spell,
    rarity: ItemRarity.Rare,
    level: 1,
    basePower: 3,
    attackSpeed: 0.25,
    affixes: ['int'],
    fluff: 'This is the fluff text.',
    dropChance: 25,
    size: {
      width: 1, 
      height: 4,
    }
  }
];