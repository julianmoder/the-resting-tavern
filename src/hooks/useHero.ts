import { useAppStore } from '../store/useAppStore';

export function useHero() {
  const hero = useAppStore(s => s.hero);
  const setHeroName = useAppStore(s => s.setHeroName);
  const setHeroClass = useAppStore(s => s.setHeroClass);
  const addHeroXp = useAppStore(s => s.addHeroXp);
  const attachHeroInventory = useAppStore(s => s.attachHeroInventory);
  const addHeroCoins = useAppStore(s => s.addHeroCoins);
  const removeHeroCoins = useAppStore(s => s.removeHeroCoins);
  const equipHeroItem = useAppStore(s => s.equipHeroItem);
  const unequipHeroItem = useAppStore(s => s.unequipHeroItem);
  const getHeroEffectiveStats = useAppStore(s => s.getHeroEffectiveStats);
  
  return {
    ...hero,
    setName: setHeroName,
    setClass: setHeroClass,
    addXp: addHeroXp,
    attachInventory: attachHeroInventory,
    getEffectiveStats: getHeroEffectiveStats,
    addCoins: addHeroCoins,
    removeCoins: removeHeroCoins,
    equipItem: equipHeroItem,
    unequipItem: unequipHeroItem,
  }
}