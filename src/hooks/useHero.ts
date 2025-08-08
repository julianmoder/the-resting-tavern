import { useAppStore } from '../store/useAppStore';

export function useHero() {
  const hero = useAppStore(s => s.hero);
  const setHeroName = useAppStore(s => s.setHeroName);
  const setHeroClass = useAppStore(s => s.setHeroClass);
  const addHeroXp = useAppStore(s => s.addHeroXp);
  const resetInvMatrix = useAppStore(s => s.resetInvMatrix);
  const addHeroCoins = useAppStore(s => s.addHeroCoins);
  const removeHeroCoins = useAppStore(s => s.removeHeroCoins);
  const addInvItem = useAppStore(s => s.addInvItem);
  const removeInvItem = useAppStore(s => s.removeInvItem);
  const equipInvItem = useAppStore(s => s.equipInvItem);
  const unequipInvItem = useAppStore(s => s.unequipInvItem);
  const getHeroEffectiveStats = useAppStore(s => s.getHeroEffectiveStats);
  
  return {
    ...hero,
    setName: setHeroName,
    setClass: setHeroClass,
    addXp: addHeroXp,
    getEffectiveStats: getHeroEffectiveStats,
    addCoins: addHeroCoins,
    removeCoins: removeHeroCoins,
    inventory: {
      ...hero.inventory,
      resetMatrix: resetInvMatrix,
      addItem: addInvItem,
      removeItem: removeInvItem,
      equipment: {
        ...hero.inventory.equipment,
        equipItem: equipInvItem,
        unequipItem: unequipInvItem,
      },
    },
  }
}