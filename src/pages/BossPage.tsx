import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Quest } from '../types/types';
import BattleScene from '../comps/battle/BattleScene';
import BattleHud from '../comps/battle/BattleHud';
import { useHero } from '../hooks/useHero';
import { useBoss } from '../hooks/useBoss';
import { useBattle } from '../hooks/useBattle';

type BossPageProps = {
  quest: Quest;
  onBossWin: () => void;
};

export default function BossPage({ quest, onBossWin }: BossPageProps) {
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();

  useEffect(() => {
    if (!hero?.stats || !boss?.stats) return;
    battle.reset(hero.stats.maxHealth, boss.stats.maxHealth);
  }, [hero?.stats?.maxHealth, boss?.stats?.maxHealth]);

  return (
    <div className="relative w-full text-white">
      <BattleHud boss={boss} />
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="w-full aspect-video flex flex-1 flex-col items-center">
          <p className="absolute top-1 pl-2 text-sm text-emerald-400 z-50">{quest.name}</p>
          <BattleScene className="w-full h-full" />
        </div>
      </div>

      {battle.outcome !== 'none' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-700 text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {battle.outcome === 'victory' ? 'Victory!' : 'Defeat'}
            </h2>
            <div className="space-x-3">
              {battle.outcome === 'victory' ? (
                <button
                  onClick={onBossWin}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500"
                >
                  Continue
                </button>
              ) : (
                <>
                  <button
                    onClick={() => battle.setOutcome('none')}
                    className="px-4 py-2 rounded-full bg-stone-600 hover:bg-stone-500"
                  >
                    Retry
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <button onClick={onBossWin} className="fixed bottom-3 right-3 bg-stone-600 hover:bg-stone-700 text-white font-semibold py-2 px-4 rounded-full">
        Continue
      </button>
    </div>
  );
}