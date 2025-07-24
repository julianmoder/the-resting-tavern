import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestConfig {
  quest: string;
  duration: number;
  breakTime: number;
}

interface Loot {
  coins: number;
  potions: number;
  armor: Armor | null;
  weapon: Weapon | null;
}

interface AppState {
  stage: 'landing' | 'tavern' | 'quest' | 'boss' | 'loot' | 'break';
  hero?: string;
  questConfig?: QuestConfig;
  setStage: (s: AppState['stage']) => void;
  setHero: (h: string) => void;
  setQuestConfig: (q: QuestConfig) => void;
  loot?: Loot;
  setLoot: (l: Loot) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      stage: 'landing',
      setStage: (stage) => set({ stage }),
      setHero: (hero) => set({ hero }),
      setQuestConfig: (questConfig) => set({ questConfig }),
      setLoot: (newLoot) =>
        set((state) => ({
          loot: {
            coins: (state.loot?.coins ?? 0) + (newLoot.coins ?? 0),
            potions: (state.loot?.potions ?? 0) + (newLoot.potions ?? 0),
            weapon: newLoot.weapon ?? state.loot?.weapon ?? null,
            armor: newLoot.armor ?? state.loot?.armor ?? null,
          },
        }))
    }),
    {
      name: 'resting-tavern-store',
      partialize: (state) => ({
        stage: state.stage,
        hero: state.hero,
        questConfig: state.questConfig,
        loot: state.loot
      }),
    }
  )

);
