import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSettingsSlice, type SettingsSlice } from './settingsSlice';
import { createUISlice, type UISlice } from './uiSlice';
import { createModalSlice, type ModalSlice } from './modalSlice';
import { createStageSlice, type StageSlice } from './stageSlice';
import { createHeroSlice, type HeroSlice } from './heroSlice';
import { createInventorySlice, type InventorySlice } from './inventorySlice';
import { createQuestSlice, type QuestSlice } from './questSlice';
import { createBattleSlice, type BattleSlice } from './battleSlice';
import { createBossSlice, type BossSlice } from './bossSlice';

export interface AppState extends SettingsSlice, UISlice, ModalSlice, StageSlice, HeroSlice, InventorySlice, QuestSlice, BattleSlice, BossSlice {}

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSettingsSlice(...a),
      ...createUISlice(...a),
      ...createModalSlice(...a),
      ...createStageSlice(...a),
      ...createHeroSlice(...a),
      ...createInventorySlice(...a),
      ...createQuestSlice(...a),
      ...createBattleSlice(...a),
      ...createBossSlice(...a)
    }),
    {
      name: 'resting-tavern-store',
      partialize: (state) => ({
        settings: state.settings,
        modal: state.modal,
        stage: state.stage,
        hero: state.hero,
        inventories: state.inventories, 
        quest: state.quest,
        battle: state.battle,
        boss: state.boss,
      }),
    }
  )

);
