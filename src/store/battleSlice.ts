import type { StateCreator } from 'zustand';
import type { AppState } from './useAppStore';
import { BattleOutcome } from '../types/base';
import type { Battle } from '../types/base';

export type BattleSlice = {
  battle: Battle;
  resetBattle: () => void;
  setBattleDamageBoss: (dmg: number | undefined) => void;
  setBattleDamageHero: (dmg: number | undefined) => void;
  setBattlePaused: (p: boolean) => void;
  setBattleOutcome: (o: BattleOutcome) => void;
};

export const createBattleSlice: StateCreator<AppState, [], [], BattleSlice> = (set) => ({
  battle: {
    isPaused: false,
    lastHitAt: performance.now(),
    outcome: BattleOutcome.None,
    lastHeroHit: undefined,
    lastBossHit: undefined,
  },
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
      boss: {
        ...state.boss,
        stats: {
          ...state.boss.stats,
          health: state.boss.stats.maxHealth,
          energy: state.boss.stats.maxEnergy,
        },
      },
      battle: {
        isPaused: false,
        lastHitAt: performance.now(),
        outcome: BattleOutcome.None,
        lastHeroHit: undefined,
        lastBossHit: undefined,
      }
    }));
  },
  setBattleDamageHero: (dmg: number | undefined = undefined) => {
    if(!dmg) return;
    set((state) => ({
      hero: {
        ...state.hero,
        stats: {
          ...state.hero.stats,
          health: Math.max(0, state.hero.stats.health - dmg),
        },
      },
      battle: {
        ...state.battle,
        lastHitAt: performance.now(),
        lastHeroHit: (dmg > 0) ? { target: 'hero', amount: dmg, at: performance.now() } : state.battle.lastHeroHit,
      }
    }));
  },
  setBattleDamageBoss: (dmg: number | undefined = undefined) => {
    if(!dmg) return;
    set((state) => ({
      boss: {
        ...state.boss,
        stats: {
          ...state.boss.stats,
          health: Math.max(0, state.boss.stats.health - dmg),
        },
      },
      battle: {
        ...state.battle,
        lastBossHit: (dmg > 0) ? { target: 'boss', amount: dmg, at: performance.now() } : state.battle.lastBossHit,
      }
    }));
  },
  setBattlePaused: (newPause: boolean) => {
    set((state) => ({ 
      battle: {
        ...state.battle,
        isPaused: newPause,
      } 
    }));
  },
  setBattleOutcome: (newOutcome: BattleOutcome) => {
    set((state) => ({ 
      battle: {
        ...state.battle,
        isPaused: newOutcome !== BattleOutcome.None,
        outcome: newOutcome,
      } 
    }));
  },
});