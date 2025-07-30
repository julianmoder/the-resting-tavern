import { useAppStore } from '../store/useAppStore';

export function useHero() {
  const hero = useAppStore(s => s.hero);
  const setHeroName = useAppStore(s => s.setHeroName);
  const setHeroClass = useAppStore(s => s.setHeroClass);
  const addHeroXp = useAppStore(s => s.addHeroXp);
  const addInvItem = useAppStore(s => s.addInvItem);
  const removeInvItem = useAppStore(s => s.removeInvItem);
  const addInvCoins = useAppStore(s => s.addInvCoins);
  const removeInvCoins = useAppStore(s => s.removeInvCoins);
  const addEquipItem = useAppStore(s => s.addEquipItem);
  const removeEquipItem = useAppStore(s => s.removeEquipItem);
  
  return {
    ...hero,
    setName: setHeroName,
    setClass: setHeroClass,
    addXp: addHeroXp,
    inventory: {
      ...hero.inventory,
      addCoins: addInvCoins,
      removeCoins: removeInvCoins,
      addItem: addInvItem,
      removeItem: removeInvItem,
    },
    equipment: {
      ...hero.equipment,
      addItem: addEquipItem,
      removeItem: removeEquipItem,
    },
  }
}