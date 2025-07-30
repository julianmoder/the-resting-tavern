import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Hero, HeroClass, Item, ItemType } from '../types/types';
import { tryLevelUp } from '../utils/levelProgression';

export interface HeroSlice {
  hero: Hero;
  setHeroName: (newName: string) => void;
  setHeroClass: (newClass: HeroClass) => void;
  addHeroXp: (addXp: number) => void;
  addInvCoins: (addCoins: number) => void;
  removeInvCoins: (removeCoins: number) => void;
  addInvItem: (addItem: Item) => void;
  removeInvItem: (removeItem: Item) => void;
  setInvItemPosition: (item: Item, x: number, y: number) => void;
  equipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  unequipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  addEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  removeEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
}

export const createHeroSlice: StateCreator<HeroSlice, [], [], HeroSlice> = (set, get) => ({
  hero: {
    id: uuidv4(),
    name: 'Unnamed Hero',
    class: null,
    xp: 0,
    level: 1,
    leveledUp: false,
    stats: {
      health: 10,
      maxHealth: 10,
      energy: 10,
      maxEnergy: 10,
      str: 5,
      int: 5,
      dex: 5,
    },
    inventory: {
      coins: 0,
      items: [],
    },
    equipment: {
      weapon: null,
      armor: null,
    }
  },
  setHeroName: (newName: string) => {
    set((state) => ({
      hero: {
        ...state.hero,
        name: newName,
      }
    }))
  },
  setHeroClass: (newClass: HeroClass) => {
    set((state) => ({
      hero: {
        ...state.hero,
        class: newClass,
      }
    }))
  },
  addHeroXp: (addXp: number) => {
    const state = get();
    if (!state.hero) return;

    const tryLevelUpResult = tryLevelUp(state.hero.xp + addXp, state.hero.level);

    let newMaxHealth = state.hero.stats.maxHealth;
    let newMaxEnergy = state.hero.stats.maxEnergy;
    let newStr = state.hero.stats.str;
    let newInt = state.hero.stats.int;
    let newDex = state.hero.stats.dex;

    if(tryLevelUpResult.leveledUp) {
      newMaxHealth = newMaxHealth + Math.floor(tryLevelUpResult.level / 2);
      newMaxEnergy = newMaxEnergy + Math.floor(tryLevelUpResult.level / 2);
      newStr = (state.hero.class === 'warrior') 
        ? newStr + Math.floor(tryLevelUpResult.level / 2) 
        : newStr + Math.floor(tryLevelUpResult.level / 3);
      newInt = (state.hero.class === 'wizzard') 
        ? newInt + Math.floor(tryLevelUpResult.level / 2) 
        : newInt + Math.floor(tryLevelUpResult.level / 3);
      newDex = (state.hero.class === 'ranger') 
        ? newDex + Math.floor(tryLevelUpResult.level / 2) 
        : newDex + Math.floor(tryLevelUpResult.level / 3);
    }
    
    set((state) => ({
      hero: {
        ...state.hero,
        xp: tryLevelUpResult.xp,
        level: tryLevelUpResult.level,
        leveledUp: tryLevelUpResult.leveledUp,
        stats: {
          maxHealth: newMaxHealth,
          maxEnergy: newMaxEnergy,
          str: newStr,
          int: newInt,
          dex: newDex,
        },
      }
    }))
  },
  addInvCoins: (addCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          coins: state.hero.inventory.coins + addCoins,
        }
      }
    }))
  },
  removeInvCoins: (removeCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          coins: state.hero.inventory.coins - removeCoins,
        }
      }
    }))
  },
  addInvItem: (addItem: Item) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: [...state.hero.inventory.items, addItem]
        }
      }
    }))
  },
  removeInvItem: (removeItem: Item) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: state.hero.inventory.items.filter(item => item.id !== removeItem.id)
        }
      }
    }))
  },
  setInvItemPosition: (item: Item, x: number, y: number) => {
    const state = get();
    if (!state.hero) return;

    const repositionedItems = state.hero.inventory.items.map((mapItem) => {
      return mapItem.id === item.id ? { ...mapItem, position: { x, y } } : mapItem;
    });

    set((state) => ({
      hero: { 
        ...state.hero, 
        inventory: { 
          ...state.hero.inventory, 
          items: repositionedItems,
        }, 
      } 
    }))
  },
  equipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {

  },
  unequipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {

  },
  addEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          weapon: slot === ItemType.Weapon ? item : state.hero.equipment.weapon,
          armor: slot === ItemType.Armor ? item : state.hero.equipment.armor,
        },
      }
    }))
  },
  removeEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          weapon: slot === ItemType.Weapon ? null : state.hero.equipment.weapon,
          armor: slot === ItemType.Armor ? null : state.hero.equipment.armor,
        },
      }
    }))
  },

});