import type { StateCreator } from 'zustand';
import type { UIHelper } from '../types/base';


export interface UISlice {
  ui: UIHelper;
  toggleSideBarHero: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  ui: {
    sidebar: {
      showHero: false,
    }
  },
  toggleSideBarHero: () => {
    set((state) => ({ 
      ui: {
        ...state.ui,
        sidebar: {
          ...state.ui.sidebar,
          showHero: !state.ui.sidebar.showHero,
        }
      }
    }))
  }
});