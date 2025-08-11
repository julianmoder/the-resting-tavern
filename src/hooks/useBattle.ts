import { useAppStore } from '../store/useAppStore';

export function useBattle() {
  const battle = useAppStore(s => s.battle);
  const resetBattle = useAppStore(s => s.resetBattle);
  const setBattleDamageHero = useAppStore(s => s.setBattleDamageHero);
  const setBattleDamageBoss = useAppStore(s => s.setBattleDamageBoss);
  const setBattlePaused = useAppStore(s => s.setBattlePaused);
  const setBattleOutcome = useAppStore(s => s.setBattleOutcome);

  
  return {
    ...battle,
    reset: resetBattle,
    damageHero: setBattleDamageHero,
    damageBoss: setBattleDamageBoss,
    setPause: setBattlePaused,
    setOutcome: setBattleOutcome,
  }
}