import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

type BreakPageProps = {
  onGoBack: () => void;
};

export default function BreakPage({ onGoBack }: BreakPageProps) {
  const questConfig = useAppStore(s => s.questConfig!);
  const setStage = useAppStore(s => s.setStage);
  const [secondsLeft, setSecondsLeft] = useState(questConfig.breakTime * 60);

  useEffect(() => {
    const iv = setInterval(() => {
      setSecondsLeft(prev => prev <= 1 ? (clearInterval(iv), 0) : prev - 1);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // START Keyboard Handler: Up / Down Arrows
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
  // END Keyboard Handler: Up / Down Arrows

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">🛏️ Rest Break</h2>
      <div className="text-6xl font-mono">
        {minutes}:{seconds < 10 ? '0' : ''}{seconds}
      </div>
      {secondsLeft === 0 && (
        <button
          className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2 rounded"
          onClick={() => {
            onGoBack();
          }}
        >
          Let's go back to the tavern
        </button>
      )}
    </>
  );
}
