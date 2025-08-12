import type { StateCreator } from 'zustand';
import type { UIHelper } from '../types/base';
import { PixiBoot } from '../engine/pixi/pixiApp';

export interface UISlice {
  ui: UIHelper;
  setPixiBoot: (boot: PixiBoot | null) => void;
  toggleSideBarHero: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
ui: {
    pixi: {
      boot: null,
    },
    sidebar: {
      showHero: false,
    },
  },
  setPixiBoot: (newBoot) => {
    set((state) => ({ 
      ui: {
        ...state.ui,
        pixi: {
          ...state.ui.pixi,
          boot: newBoot,
        }
      } 
    }))
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