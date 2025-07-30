import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UISlice } from './uiSlice';
import { createUISlice } from './uiSlice';
import type { StageSlice } from './stageSlice';
import { createStageSlice } from './stageSlice';
import type { HeroSlice } from './heroSlice';
import { createHeroSlice } from './heroSlice';
import type { QuestSlice } from './questSlice';
import { createQuestSlice } from './questSlice';

interface AppState extends UISlice, StageSlice, HeroSlice, QuestSlice {}

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createStageSlice(...a),
      ...createHeroSlice(...a),
      ...createQuestSlice(...a)
    }),
    {
      name: 'resting-tavern-store',
      partialize: (state) => ({
        ui: state.ui,
        stage: state.stage,
        hero: state.hero,
        quest: state.quest,
      }),
    }
  )

);
