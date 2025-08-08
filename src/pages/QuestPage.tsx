import { useEffect, useState } from 'react';
import type { Quest } from '../types/base';

type QuestPageProps = {
  quest: Quest;
  onQuestComplete: () => void;
};

export default function QuestPage({ quest, onQuestComplete }: QuestPageProps) {
  const [secondsLeft, setSecondsLeft] = useState(quest.duration * 60);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finished]);

  useEffect(() => {
    if (finished) {
      onQuestComplete();
    }
  }, [finished, onQuestComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // START Keyboard Handler: Up / Down Arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSecondsLeft(0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  // END Keyboard Handler: Up / Down Arrows

  return (
    <>
      <p className='mb-3 text-lg'>Quest in progress...</p>
      <p className='font-bold text-emerald-400'>{quest.name}</p>
      <p className='mb-12 text-sm text-gray-400'>
        Focus time: {quest.duration} minutes – Break time: {quest.breakTime} minutes
      </p>
      <div className='text-9xl font-mono font-bold'>
        {minutes}:{seconds < 10 ? '0' : ''}{seconds}
      </div>
      
    </>
  );
}