import { useAppStore } from '../store/useAppStore';

export function useUI() {
  const ui = useAppStore(s => s.ui);
  const toggleSideBarCharacter = useAppStore(s => s.toggleSideBarCharacter);
  
  return {
    ...ui,
    sidebar: {
      ...ui.sidebar,
      toggleCharacter: toggleSideBarCharacter,
    }
  }
}