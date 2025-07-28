import { useAppStore } from '../store/useAppStore';

export function useHero() {
  const hero = useAppStore(s => s.hero);
  const setHeroName = useAppStore(s => s.setHeroName);
  const addHeroXp = useAppStore(s => s.addHeroXp);
  const addInvItem = useAppStore(s => s.addInvItem);
  const addInvCoins = useAppStore(s => s.addInvCoins);
  
  return {
    ...hero,
    setName: setHeroName,
    addXp: addHeroXp,
    inventory: {
      ...hero.inventory,
      addCoins: addInvCoins,
      addItem: addInvItem,
    }
  }
}