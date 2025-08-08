import type { StateCreator } from 'zustand';
import type { AppSettings } from '../types/base';


export interface SettingsSlice {
  settings: AppSettings;
  setInvCellSize: (newCellSize: number) => void;
}

export const DEFAULT_SETTINGS = {
  inventory: {
    cellSize: 32,
  },
};

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settings: { ...DEFAULT_SETTINGS },
  setInvCellSize: (newCellSize: number) => {
    set((state) => ({
      settings: {
        ...state.settings,
        inventory: {
          ...state.settings.inventory,
          cellSize: newCellSize,
        },
      }
    }))
  },
});