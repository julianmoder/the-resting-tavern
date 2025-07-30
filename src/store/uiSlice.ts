import type { StateCreator } from 'zustand';
import type { UIHelper } from '../types/types';


interface UISlice {
  ui: UIHelper;
  toggleToolbarCharacter: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set, get) => ({
  ui: {
    toolbar: {
      showCharacter: false,
    }
  },
  toggleToolbarCharacter: () => set((state) => ({ showCharacter: !state.ui.toolbar.showCharacter })),
});