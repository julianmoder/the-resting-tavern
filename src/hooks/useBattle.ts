import { useAppStore } from '../store/useAppStore';

export function useBattle() {
  const battle = useAppStore(s => s.battle);
  const resetBattle = useAppStore(s => s.resetBattle);
  const setBattleDamageHero = useAppStore(s => s.setBattleDamageHero);
  const setBattleDamageBoss = useAppStore(s => s.setBattleDamageBoss);
  const setBattlePaused = useAppStore(s => s.setBattlePaused);
  const setBattleOutcome = useAppStore(s => s.setBattleOutcome);
  const setBattleAnimIntent = useAppStore(s => s.setBattleAnimIntent);
  const setBattleMechanic = useAppStore(s => s.setBattleMechanic);
  const resetBattleMechanic = useAppStore(s => s.resetBattleMechanic);
  const setBattleMechanicOverlay = useAppStore(s => s.setBattleMechanicOverlay);
  
  return {
    ...battle,
    mechanic: {
      ...battle.mechanic,
      overlay: {
        ...battle.mechanic.overlay,
        set: setBattleMechanicOverlay, 
      }
    },
    reset: resetBattle,
    damageHero: setBattleDamageHero,
    damageBoss: setBattleDamageBoss,
    setPause: setBattlePaused,
    setOutcome: setBattleOutcome,
    setAnimIntent: setBattleAnimIntent,
    setMechanic: setBattleMechanic,
    resetMechanic: resetBattleMechanic,
  }
}