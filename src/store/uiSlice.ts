import type { StateCreator } from 'zustand';
import type { UIHelper } from '../types/base';


export interface UISlice {
  ui: UIHelper;
  toggleSideBarCharacter: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  ui: {
    sidebar: {
      showCharacter: false,
    }
  },
  toggleSideBarCharacter: () => {
    set((state) => ({ 
      ui: {
        ...state.ui,
        sidebar: {
          ...state.ui.sidebar,
          showCharacter: !state.ui.sidebar.showCharacter,
        }
      }
    }))
  }
});