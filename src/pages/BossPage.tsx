import { useState } from 'react';

type BossPageProps = {
  quest: Quest;
  onBossWin: () => void;
};

export default function BossPage({ quest, onBossWin }: BossPageProps) {
  const [clicks, setClicks] = useState(0);
  const required = 10;

  return (
    <>
      <p className="mb-3 text-4x1 font-bold text-emerald-400">{quest}</p>
      <p className="mb-12 text-4xl font-bold">💥 Bossfight!</p>
      <button
        className="mb-3 bg-red-600 hover:bg-red-700 px-9 py-3 rounded-full font-bold text-4xl"
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
      <p className="text-gray-400 text-sm">Click the button rapidly to defeat the boss!</p>
    </>
  );
}