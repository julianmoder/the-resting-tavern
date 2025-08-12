import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Hero, HeroStats, HeroClass, Item } from '../types/base';
import { ItemType } from '../types/base';
import { tryLevelUp } from '../utils/levelProgression';

export interface HeroSlice {
  hero: Hero;
  setHeroName: (newName: string) => void;
  setHeroClass: (newClass: HeroClass) => void;
  addHeroXp: (addXp: number) => { xp: number, level: number, leveledUp: boolean };
  attachHeroInventory: (id: string) => void;
  getHeroEffectiveStats: () => HeroStats;
  addHeroCoins: (addCoins: number) => void;
  removeHeroCoins: (removeCoins: number) => void;
  equipHeroItem: (item: Item, slot: ItemType) => void;
  unequipHeroItem: (slot: ItemType) => void;
}

export const createHeroSlice: StateCreator<HeroSlice, [], [], HeroSlice> = (set, get) => ({
  hero: {
    id: uuidv4(),
    name: 'Unnamed Hero',
    class: null,
    xp: 0,
    level: 1,
    leveledUp: false,
    position: { x: 250, y: 600 }, //  initial position for battle
    stats: {
      health: 60,
      maxHealth: 60,
      energy: 120,
      maxEnergy: 120,
      str: 5,
      int: 5,
      dex: 5,
    },
    equipment: {
      weapon: null,
      armor: null,
    },
    coins: 0,
    inventoryID: null,
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
  addHeroXp: (addXp: number):{ xp: number, level: number, leveledUp: boolean } => {
    const state = get();
    if (!state.hero) return{ xp: 0, level: 0, leveledUp: false };
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
          ...state.hero.stats,
          maxHealth: newMaxHealth,
          maxEnergy: newMaxEnergy,
          str: newStr,
          int: newInt,
          dex: newDex,
        },
      }
    }))
    return tryLevelUpResult;
  },
  attachHeroInventory: (id: string) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventoryID: id,
      }
    }))
  },
  getHeroEffectiveStats: ():HeroStats  => {
    const state = get();
    const baseStats = state.hero?.stats ?? {
      str: 0, 
      int: 0, 
      dex: 0,
      health: 0, 
      maxHealth: 0,
      energy: 0, 
      maxEnergy: 0,
    };
    let { str, int, dex, health, maxHealth, energy, maxEnergy } = baseStats;
    const weapon = state.hero?.equipment?.weapon;
    const armor = state.hero?.equipment?.armor;
    if (weapon) {
      str += weapon?.modifier?.str ?? 0;
      int += weapon?.modifier?.int ?? 0;
      dex += weapon?.modifier?.dex ?? 0;
    }
    if (state.hero?.equipment.armor) {
      str += armor?.modifier?.str ?? 0;
      int += armor?.modifier?.int ?? 0;
      dex += armor?.modifier?.dex ?? 0;
    }
    return { str, int, dex, health, maxHealth, energy, maxEnergy };
  },
  addHeroCoins: (addCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        coins: state.hero.coins + addCoins,
      }
    }))
  },
  removeHeroCoins: (removeCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        coins: state.hero.coins - removeCoins,
      }
    }))
  },
  equipHeroItem: (item: Item, slot: ItemType) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          ...state.hero.equipment,
          [slot]: item,
        },
      }
    }));
  },
  unequipHeroItem: (slot: ItemType) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          ...state.hero.equipment,
          [slot]: null,
        },
      }
    }));
  }
});