import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Boss, BossStats, BossTemplate, Hero } from '../types/base';

export interface BossSlice {
  boss: Boss;
  createBoss: (newBoss: BossTemplate, hero: Hero) => void;
}

export const createBossSlice: StateCreator<BossSlice, [], [], BossSlice> = (set, get) => ({
  boss: {
    id: 'noID',
    name: 'Unnamed Boss',
    level: 1,
    stats: {
      health: 1,
      maxHealth: 1,
      energy: 1,
      maxEnergy: 1,
      attack: 1,
      defense: 1, 
    },
    mechanics: [],
  },
  createBoss: (newBoss: BossTemplate, hero: Hero) => {
    const newLevel = hero.level;
    const newMaxHealth = 200 + (newLevel * 5);
    const newMaxEnergy = 200 + (newLevel * 5);
    const newAttack = hero.level;
    const newDefence = Math.floor(hero.level/2);

    set((state) => ({
      boss: {
        ...state.boss,
        id: uuidv4(),
        name: newBoss.name,
        level: newLevel,
        stats: {
          ...state.boss.stats,
          health: newMaxHealth,
          maxHealth: newMaxHealth,
          energy: newMaxEnergy,
          maxEnergy: newMaxEnergy,
          attack: newAttack,
          defense: newDefence,
        },
        mechanics: newBoss.mechanics,
      }
    }))
  },
});