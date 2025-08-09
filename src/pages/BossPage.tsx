import type { Quest } from '../types/types';
import BattleScene from '../comps/battle/BattleScene';
import BattleHud from '../comps/battle/BattleHud';
import { useBoss } from '../hooks/useBoss';

type BossPageProps = {
  quest: Quest;
  onBossWin: () => void;
};

export default function BossPage({ quest, onBossWin }: BossPageProps) {
  const boss = useBoss();

  return (
    <div className="relative w-full text-white">
      <BattleHud boss={boss} />
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="w-full aspect-video flex flex-1 flex-col items-center">
          <p className="absolute top-1 pl-2 text-sm text-emerald-400 z-50">{quest.name}</p>
          <BattleScene className="w-full h-full" />
        </div>
      </div>
      <button onClick={onBossWin} className="fixed bottom-3 right-3 bg-stone-600 hover:bg-stone-700 text-white font-semibold py-2 px-4 rounded-full">
        Continue
      </button>
    </div>
  );
}