import { useAppStore } from '../store/useAppStore';

export function useHero() {
  const hero = useAppStore(s => s.hero);
  const setHeroName = useAppStore(s => s.setHeroName);
  const setHeroClass = useAppStore(s => s.setHeroClass);
  const addHeroXp = useAppStore(s => s.addHeroXp);
  const addInvCoins = useAppStore(s => s.addInvCoins);
  const removeInvCoins = useAppStore(s => s.removeInvCoins);
  const addInvItem = useAppStore(s => s.addInvItem);
  const removeInvItem = useAppStore(s => s.removeInvItem);
  const setInvItemPosition = useAppStore(s => s.setInvItemPosition);
  const equipInvItem = useAppStore(s => s.equipInvItem);
  const unequipInvItem = useAppStore(s => s.unequipInvItem);
  const getHeroEffectiveStats = useAppStore(s => s.getHeroEffectiveStats);
  
  return {
    ...hero,
    setName: setHeroName,
    setClass: setHeroClass,
    addXp: addHeroXp,
    getEffectiveStats: getHeroEffectiveStats,
    inventory: {
      ...hero.inventory,
      addCoins: addInvCoins,
      removeCoins: removeInvCoins,
      addItem: addInvItem,
      removeItem: removeInvItem,
      setPosition: setInvItemPosition,
    },
    equipment: {
      ...hero.equipment,
      equipItem: equipInvItem,
      unequipItem: unequipInvItem,
    },
  }
}