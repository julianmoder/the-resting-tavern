import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestConfig {
  quest: string;
  duration: number;
  breakTime: number;
}

interface AppState {
  stage: 'landing' | 'tavern' | 'quest' | 'boss';
  hero?: string;
  questConfig?: QuestConfig;
  setStage: (s: AppState['stage']) => void;
  setHero: (h: string) => void;
  setQuestConfig: (q: QuestConfig) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      stage: 'landing',
      setStage: (stage) => set({ stage }),
      setHero: (hero) => set({ hero }),
      setQuestConfig: (questConfig) => set({ questConfig }),
    }),
    {
      name: 'resting-tavern-store',
      partialize: (state) => ({
        stage: state.stage,
        hero: state.hero,
        questConfig: state.questConfig,
      }),
    }
  )
);
