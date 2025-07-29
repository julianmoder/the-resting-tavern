import type { StateCreator } from 'zustand'
import type { Hero, Item } from '../types/types';
import { tryLevelUp } from '../utils/levelProgression';

export interface HeroSlice {
  hero: Hero;
  setHeroName: (name: string) => void;
  addHeroXp: (xp: number) => void;
  addInvItem: (item: Item) => void;
  addInvCoins: (coins: number) => void;
}

export const createHeroSlice: StateCreator<HeroSlice, [], [], HeroSlice> = (set, get) => ({
  hero: {
    name: 'Unnamed Hero',
    xp: 0,
    level: 1,
    leveledUp: false,
    inventory: {
      coins: 0,
      items: [],
    },
  },
  setHeroName: (newName: string) => {
    set((state) => ({
      hero: {
        ...state.hero,
        name: newName
      }
    }))
  },
  addHeroXp: (earnedXp: number) => {
    const state = get();
    if (!state.hero) return;
    const tryLevelUpResult = tryLevelUp(state.hero.xp + earnedXp, state.hero.level);
    set((state) => ({
      hero: {
        ...state.hero,
        xp: tryLevelUpResult.xp,
        level: tryLevelUpResult.level,
        leveledUp: tryLevelUpResult.leveledUp,
      }
    }))
  },
  addInvItem: (earnedItem: Item) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: [...state.hero.inventory.items, earnedItem]
        }
      }
    }))
  },
  addInvCoins: (earnedCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          coins: state.hero.inventory.coins, earnedCoins
        }
      }
    }))
  },
});