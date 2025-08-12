import { useAppStore } from '../store/useAppStore';

export function useUI() {
  const ui = useAppStore(s => s.ui);
  const toggleSideBarHero = useAppStore(s => s.toggleSideBarHero);
  const setPixiBoot = useAppStore(s => s.setPixiBoot);
  
  return {
    ...ui,
    pixi: {
      ...ui.pixi,
      setBoot: setPixiBoot,
    },
    sidebar: {
      ...ui.sidebar,
      toggleHero: toggleSideBarHero,
    }
  }
}