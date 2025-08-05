import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Hero, HeroClass, Item } from '../types/types';
import { ItemType } from '../types/types';
import { tryLevelUp } from '../utils/levelProgression';
import { useModal } from '../hooks/useModal';

export interface HeroSlice {
  hero: Hero;
  setHeroName: (newName: string) => void;
  setHeroClass: (newClass: HeroClass) => void;
  addHeroXp: (addXp: number) => void;
  getHeroEffectiveStats: () => void;
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
      equipment: {
        weapon: null,
        armor: null,
      },
      cols: 0,
      rows: 0,
      matrix: [],
    },
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
    return tryLevelUpResult;
  },
  getHeroEffectiveStats: () => {
    const state = get();
    if (!state.hero) return;

    let { str, int, dex, health, maxHealth, energy, maxEnergy } = state.hero.stats;
    if (state.hero.inventory.equipment.weapon) {
      str += state.hero.inventory.equipment.weapon.modifier.str ?? 0;
      int += state.hero.inventory.equipment.weapon.modifier.int ?? 0;
      dex += state.hero.inventory.equipment.weapon.modifier.dex ?? 0;
    }
    if (state.hero.inventory.equipment.armor) {
      str += state.hero.inventory.equipment.armor.modifier.str ?? 0;
      int += state.hero.inventory.equipment.armor.modifier.int ?? 0;
      dex += state.hero.inventory.equipment.armor.modifier.dex ?? 0;
    }
    return { str, int, dex, health, maxHealth, energy, maxEnergy };
  },
});