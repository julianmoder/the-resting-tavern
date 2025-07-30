import type { StateCreator } from 'zustand';
import type { UIHelper } from '../types/types';


interface UISlice {
  ui: UIHelper;
  toggleSideBarCharacter: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set, get) => ({
  ui: {
    sidebar: {
      showCharacter: false,
    }
  },
  toggleSideBarCharacter: () => set((state) => ({ 
    ui: {
      ...state.ui,
      sidebar: {
        ...state.ui.sidebar,
        showCharacter: !state.ui.sidebar.showCharacter,
      }
    } 
  })),
});