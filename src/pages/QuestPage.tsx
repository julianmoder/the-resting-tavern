import { useEffect, useState } from 'react';

type QuestPageProps = {
  config: { hero: string; quest: string; duration: number; breakTime: number };
  onQuestComplete: () => void;
};

export default function QuestPage({ config, onQuestComplete }: QuestPageProps) {
  const [secondsLeft, setSecondsLeft] = useState(config.duration * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onQuestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onQuestComplete]);

  // Keyboard Handler: Up / Down Arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSecondsLeft(prev => Math.max(prev - 10, 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSecondsLeft(prev => prev + 10);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <>

      <p className="mb-3 text-4x1 font-bold text-emerald-400">{config.quest}</p>
      
      <p className="text-2xl mb-6">🛡️ Quest in progress...</p>
      
      <div className="mb-3 text-8xl font-mono font-bold">
        {minutes}:{seconds < 10 ? '0' : ''}{seconds}
      </div>

      <p className="text-sm text-gray-400">
        Focus time: {config.duration} min – Break after: {config.breakTime} min
      </p>

    </>
  );
}