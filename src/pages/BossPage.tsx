import { useState } from 'react';
import type { Quest } from '../types/base';

type BossPageProps = {
  quest: Quest;
  onBossWin: () => void;
};

export default function BossPage({ quest, onBossWin }: BossPageProps) {
  const [clicks, setClicks] = useState(0);
  const required = 3;

  return (
    <>
      <p className='mb-3 text-lg font-bold'>Bossfight!</p>
      <p className='mb-12 font-bold text-emerald-400'>{quest.name}</p>
      <button
        className='bg-red-600 hover:bg-red-700 px-9 py-3 rounded-full font-bold text-4xl'
        onClick={() => {
          const next = clicks + 1;
          if (next >= required) {
            onBossWin();
          } else {
            setClicks(next);
          }
        }}
      >
        Strike ({clicks}/{required})
      </button>
    </>
  );
}