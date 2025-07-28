import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

type BreakPageProps = {
  onGoBack: () => void;
};

export default function BreakPage({ onGoBack }: BreakPageProps) {
  const quest = useAppStore(s => s.quest!);
  const [secondsLeft, setSecondsLeft] = useState(quest.breakTime * 60);

  useEffect(() => {
    const iv = setInterval(() => {
      setSecondsLeft(prev => prev <= 1 ? (clearInterval(iv), 0) : prev - 1);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // START Keyboard Handler: Down Arrow
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
  // END Keyboard Handler: Down Arrow

  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>Rest Break</h2>
      <div className='text-6xl font-mono'>
        {minutes}:{seconds < 10 ? '0' : ''}{seconds}
      </div>
      {secondsLeft === 0 && (
        <button
          className='mt-6 bg-green-500 hover:bg-green-600 px-9 py-3 rounded-full'
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
