import { useAppStore } from '../store/useAppStore';

export function useUI() {
  const ui = useAppStore(s => s.ui);
  const toggleToolbarCharacter = useAppStore(s => s.toggleToolbarCharacter);
  
  return {
    ui: {
      ...ui,
      toolbar: {
        ...ui.toolbar,
        toggleCharacter: toggleToolbarCharacter,
      }
    }
  }
}