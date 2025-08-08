import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsSlice } from './settingsSlice';
import { createSettingsSlice } from './settingsSlice';
import type { UISlice } from './uiSlice';
import { createUISlice } from './uiSlice';
import type { ModalSlice } from './modalSlice';
import { createModalSlice } from './modalSlice';
import type { StageSlice } from './stageSlice';
import { createStageSlice } from './stageSlice';
import type { HeroSlice } from './heroSlice';
import { createHeroSlice } from './heroSlice';
import type { InventorySlice } from './inventorySlice';
import { createInventorySlice } from './inventorySlice';
import type { QuestSlice } from './questSlice';
import { createQuestSlice } from './questSlice';

interface AppState extends SettingsSlice, UISlice, ModalSlice, StageSlice, HeroSlice, InventorySlice, QuestSlice {}

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSettingsSlice(...a),
      ...createUISlice(...a),
      ...createModalSlice(...a),
      ...createStageSlice(...a),
      ...createHeroSlice(...a),
      ...createInventorySlice(...a),
      ...createQuestSlice(...a)
    }),
    {
      name: 'resting-tavern-store',
      partialize: (state) => ({
        settings: state.settings,
        ui: state.ui,
        modal: state.modal,
        stage: state.stage,
        hero: state.hero,
        inventories: state.inventories, 
        quest: state.quest,
      }),
    }
  )

);
