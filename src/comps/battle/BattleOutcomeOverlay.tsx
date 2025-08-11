import { BattleOutcome } from '../../types/base';
import { useBattle } from '../../hooks/useBattle';

type BattleOutcomeProps = {
  onBossWin: () => void;
  onBossLose: () => void;
}

export default function BattleOutcomeOverlay({ onBossWin, onBossLose }: BattleOutcomeProps) {
  const battle = useBattle();

  if (battle.outcome === BattleOutcome.None) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-700 text-center space-y-4 pointer-events-auto">
        <h2 className="text-2xl font-bold">
          {battle.outcome === BattleOutcome.Victory ? 'Victory!' : 'Defeat'}
        </h2>
        <div className="space-x-3">
          {battle.outcome === BattleOutcome.Victory ? (
            <button onClick={onBossWin} className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500">
              Loot
            </button>
          ) : (
            <button onClick={onBossLose} className="px-4 py-2 rounded-full bg-stone-600 hover:bg-stone-500">
              Rest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}