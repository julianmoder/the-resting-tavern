import type { StateCreator } from 'zustand';
import type { AppState } from './useAppStore';

export type BattleSlice = {
  isPaused: boolean;
  lastHitAt: number;
  resetBattle: () => void;
  damageBoss: (amount: number) => void;
  damagePlayer: (amount: number) => void;
  setPaused: (p: boolean) => void;
};

export const createBattleSlice: StateCreator<AppState, [], [], BattleSlice> = (set, get) => ({
  isPaused: false,
  lastHitAt: performance.now(),
  resetBattle: () => {
    set((state) => ({
      hero: {
        ...state.hero,
        stats: {
          ...state.hero.stats,
          health: state.hero.stats.maxHealth,
          energy: state.hero.stats.maxEnergy,
        },
      },
      lastHitAt: performance.now(),
      isPaused: false,
    }));
  },
  damagePlayer: (dmg) => {
    set((state) => ({
      hero: {
        ...state.hero,
        stats: {
          ...state.hero.stats,
          health: Math.max(0, state.hero.stats.health - dmg),
        },
      },
    }));
  },
  damageBoss: (dmg) => {
    console.log('damageBoss > test');
    set((state) => ({
      boss: {
        ...state.boss,
        stats: {
          ...state.boss.stats,
          health: Math.max(0, state.boss.stats.health - dmg),
        },
      },
    }));
  },
  setPaused: (p) => set({ isPaused: p }),
});