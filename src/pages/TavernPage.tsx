// src/pages/TavernPage.tsx
import { useState } from 'react';
import { questPrefixes } from '../utils/questPrefixes';

type QuestConfig = {
  quest: string;
  duration: number;
  breakTime: number;
};

export default function TavernPage({
  hero,
  onStartQuest,
}: {
  hero: string;
  onStartQuest: (config: QuestConfig) => void;
}) {
  const [questInput, setQuestInput] = useState('');
  const [duration, setDuration] = useState(25);

  const randomPrefix =
    questPrefixes[Math.floor(Math.random() * questPrefixes.length)];
  const quest = questInput.trim()
    ? `${randomPrefix} ${questInput.trim()}`
    : '';

  const breakTime = Math.floor(duration / 5);
  const canStart = questInput.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-4xl text-white mx-auto">
      <p className="mb-6">Welcome, {hero}. What quest stirs your spirit today?</p>

      <input className="w-full mb-6 p-2 rounded-x1 text-center text-white font-normal border-solid border-2 leading-1 rounded-xl"
        type="text"
        value={questInput}
        onChange={(e) => setQuestInput(e.target.value)}
        placeholder="Describe your task"
      />

      <p className="mb-6">How long are you planning to be out there, {hero}. When can we expect you back in the tavern?</p>

      <input className="w-full mb-6 accent-emerald-300 cursor-pointer"
        type="range"
        min={5}
        max={120}
        step={5}
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <p className="mb-6">
        My endeavour will keep me busy for {duration} minutes. It will take {breakTime} minutes to replenish my powers.
      </p>

      <button
        className={`mt-4 px-9 py-3 rounded-full font-semibold ${
          canStart
            ? 'bg-emerald-700 hover:bg-emerald-600'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
        onClick={() =>
          canStart && onStartQuest({ quest, duration, breakTime })
        }
        disabled={!canStart}
      >
        Begin the Quest
      </button>

    </div>
  );
}
