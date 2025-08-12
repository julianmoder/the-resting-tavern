import { useEffect } from 'react';
import type { Quest } from '../types/base';
import BattleScene from '../comps/battle/BattleScene';
import BattleHud from '../comps/battle/BattleHud';
import { useHero } from '../hooks/useHero';
import { useBoss } from '../hooks/useBoss';
import { useBattle } from '../hooks/useBattle';

type BossPageProps = {
  quest: Quest;
  onBossWin: () => void;
  onBossLose: () => void;
};

export default function BossPage({ quest, onBossWin, onBossLose }: BossPageProps) {
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();

  //for debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (!hero?.stats?.maxHealth || !boss?.stats?.maxHealth) return;
      battle.reset();
    }
  }, [hero?.stats?.maxHealth, boss?.stats?.maxHealth]);

  return (
    <div className="relative w-full text-white">
      <BattleHud onBossWin={onBossWin} onBossLose={onBossLose} />
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="w-full aspect-video flex flex-1 flex-col items-center">
          <p className="absolute top-1 pl-2 text-sm text-emerald-400 z-50">{quest.name}</p>
          <BattleScene className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}