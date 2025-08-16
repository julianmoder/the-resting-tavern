import type { StateCreator } from 'zustand';
import type { AppState } from './useAppStore';
import { BattleOutcome, BossMechanicPhase, AnimIntent } from '../types/base';
import type { Battle, BossMechanic } from '../types/base';

export type BattleSlice = {
  battle: Battle;
  resetBattle: () => void;
  setBattleDamageBoss: (dmg: number | null | undefined) => void;
  setBattleDamageHero: (dmg: number | null | undefined) => void;
  setBattlePaused: (p: boolean) => void;
  setBattleOutcome: (o: BattleOutcome) => void;
  setBattleAnimIntent: (who: 'hero'|'boss', intent: AnimIntent) => void;
  setBattleMechanic: (mechanic: Partial<BossMechanic>) => void;
  resetBattleMechanic: () => void;
};

export const createBattleSlice: StateCreator<AppState, [], [], BattleSlice> = (set) => ({
  battle: {
    isPaused: false,
    lastHitAt: 0,
    outcome: BattleOutcome.None,
    lastHeroHit: undefined,
    lastBossHit: undefined,
    heroIntent: AnimIntent.Idle,
    bossIntent: AnimIntent.Idle,
    mechanic: { 
      id: null,
      phase: BossMechanicPhase.Idle,
      deadline: null, 
      active: false, 
      overlay: {
        text: undefined, 
        flash: null, 
        shake: false,
      }, 
      name: 'Unnamed Mechanic',
      chance: null,
      windup: null,
      interaction: undefined,
      duration: null,
    },
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
        heroIntent: AnimIntent.Idle,
        bossIntent: AnimIntent.Idle,
        mechanic: { 
          id: null,
          phase: BossMechanicPhase.Idle,
          deadline: null, 
          active: false, 
          overlay: {
            text: undefined, 
            flash: null, 
            shake: false,
          }, 
          name: 'Unnamed Mechanic',
          chance: null,
          windup: null,
          interaction: undefined,
          duration: null,
        },
      }
    }));
  },
  setBattleDamageHero: (dmg: number | null | undefined = undefined) => {
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
  setBattleDamageBoss: (dmg: number | null | undefined = undefined) => {
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
  setBattleAnimIntent: (who: 'hero'|'boss', intent: AnimIntent) => {
    set((state) => ({
      battle: {
        ...state.battle,
        heroIntent: who === 'hero' ? intent : state.battle.heroIntent,
        bossIntent:   who === 'boss'   ? intent : state.battle.bossIntent,
      }
    }));
  },
  setBattleMechanic: (partial: Partial<BossMechanic>) => {
    set((state) => ({
      battle: {
        ...state.battle,
        mechanic: {
          ...state.battle.mechanic,
          ...partial
        }
      }
    }));
  },
  resetBattleMechanic: () => {
    set((state) => ({
      battle: {
        ...state.battle,
        mechanic: { 
          id: null,
          phase: BossMechanicPhase.Idle,
          deadline: null, 
          active: false, 
          overlay: {
            text: undefined, 
            flash: null, 
            shake: false,
          }, 
          name: undefined,
          chance: null,
          windup: null,
          interaction: undefined,
          duration: null,
        },
      }
    }));
  },
});