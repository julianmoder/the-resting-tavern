import type { StateCreator } from 'zustand';
import type { AppState } from './useAppStore';
import { BattleOutcome } from '../types/base';
import type { Battle, BattleHit } from '../types/base';

export type BattleSlice = {
  battle: Battle;
  resetBattle: () => void;
  setBattleDamageBoss: (dmg: number | undefined) => void;
  setBattleDamageHero: (dmg: number | undefined) => void;
  setBattlePaused: (p: boolean) => void;
  setBattleOutcome: (o: BattleOutcome) => void;
};

export const createBattleSlice: StateCreator<AppState, [], [], BattleSlice> = (set, get) => ({
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
    const state = get();
    let damage = 0;
    if(typeof dmg === 'number') {
      damage = dmg;
    } else {
      damage = state.boss.stats.attack;
    }
    const defense = state.hero.stats.defense;
    const lostHealth = Math.max(0, damage - defense);

    set((state) => ({
      hero: {
        ...state.hero,
        stats: {
          ...state.hero.stats,
          health: Math.max(0, state.hero.stats.health - lostHealth),
        },
      },
      battle: {
        ...state.battle,
        lastHitAt: performance.now(),
        lastHeroHit: (lostHealth > 0) ? { target: 'hero', amount: lostHealth, at: performance.now() } : state.battle.lastHeroHit,
      }
    }));
  },
  setBattleDamageBoss: (dmg: number | undefined = undefined) => {
    const state = get();
    let damage = 0;
    if(typeof dmg === 'number') {
      damage = dmg;
    } else {
      damage = state.hero.stats.attack;
    }
    const defense = state.boss.stats.defense;
    const lostHealth = Math.max(0, damage - defense);

    set((state) => ({
      boss: {
        ...state.boss,
        stats: {
          ...state.boss.stats,
          health: Math.max(0, state.boss.stats.health - lostHealth),
        },
      },
      battle: {
        ...state.battle,
        lastBossHit: (lostHealth > 0) ? { target: 'boss', amount: lostHealth, at: performance.now() } : state.battle.lastBossHit,
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