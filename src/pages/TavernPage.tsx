// src/pages/TavernPage.tsx
import { useState } from 'react';
import { questPrefixes } from '../utils/questPrefixes';
import { questQuestions } from '../utils/questQuestions';

type TavernPageProps = {
  hero: string;
  onStartQuest: (config: QuestConfig) => void;
};

type QuestConfig = {
  quest: string;
  duration: number;
  breakTime: number;
};

export default function TavernPage({ hero, onStartQuest }: TavernPageProps) {
  const [questInput, setQuestInput] = useState('');
  const [duration, setDuration] = useState(25);

  const [randomQuestion] = useState(() =>
    questQuestions[Math.floor(Math.random() * questQuestions.length)]
  );

  const randomPrefix =
    questPrefixes[Math.floor(Math.random() * questPrefixes.length)];

  const quest = questInput.trim()
    ? `${randomPrefix} ${questInput.trim()}`
    : '';

  const breakTime = Math.floor(duration / 5);
  const canStart = questInput.trim().length > 0;

  return (
    <>

      <p>Welcome, <span className="text-amber-400">{hero}</span>.</p>
      <p className="mb-6 text-center">{randomQuestion}</p>

      <input className="w-full mb-6 p-2 rounded-x1 text-center text-emerald-600 focus:text-emerald-400 focus:outline-emerald-400 focus:outline-2 font-semibold border-solid border-3 leading-1 rounded-xl"
        type="text"
        value={questInput}
        onChange={(e) => setQuestInput(e.target.value)}
        placeholder="Name you quest"
      />

      <input className="w-full mb-6 accent-emerald-500 hover:accent-emerald-500 cursor-pointer"
        type="range"
        min={5}
        max={120}
        step={5}
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <p className="mb-6 text-center">
        <span className="text-emerald-400 font-semibold">{duration}</span> minutes focus<br/><span className="text-emerald-400 font-semibold">{breakTime}</span> minutes break
      </p>

      <button
        className={`mt-4 px-9 py-3 rounded-full font-semibold ${
          canStart
            ? 'bg-emerald-600 hover:bg-emerald-500'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
        onClick={() =>
          canStart && onStartQuest({ quest, duration, breakTime })
        }
        disabled={!canStart}
      >
        Begin your Quest
      </button>

    </>
  );
}
