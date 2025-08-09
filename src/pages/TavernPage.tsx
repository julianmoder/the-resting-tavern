import { useState } from 'react';
import { questQuestions } from '../utils/questQuestions';
import { useAppStore } from '../store/useAppStore';
import { useHero } from '../hooks/useHero';
import { useBoss } from '../hooks/useBoss';
import { bossTemplates } from '../utils/bossTemplates';
import { useUI } from '../hooks/useUI';
import CharacterOverview from '../comps/character/CharacterOverview';
import SideBar from '../comps/ui/SideBar';

type TavernPageProps = {
  onStartQuest: () => void;
};

export default function TavernPage({ onStartQuest }: TavernPageProps) {
  const [randomQuestion] = useState(questQuestions[Math.floor(Math.random() * questQuestions.length)]);
  const [questNameInput, setQuestNameInput] = useState('');
  const [questDuration, setQuestDuration] = useState(25);
  const canStart = questNameInput.trim().length > 0;
  const setQuest = useAppStore(s => s.setQuest);
  const resetBattle = useAppStore(s => s.resetBattle);
  const hero = useHero();
  const boss = useBoss();
  const ui = useUI();

  const startQuest = () => {
    setQuest(questNameInput, questDuration, hero);
    boss.create(bossTemplates[0], hero);
    resetBattle();
    onStartQuest();
  }

  return (
    <div className='text-white'>

      <SideBar />

      {/* Charakter Overview */}
      {ui.sidebar.showCharacter && (
          <CharacterOverview />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center space-y-4">
        <p>Welcome, <span className='text-orange-500 font-bold'>{hero.name}</span>.</p>
        <p className='mb-9 text-center'>{randomQuestion}</p>
        
        <input className='w-sm mb-15 p-2 text-center text-emerald-400 focus:text-emerald-400 focus:outline-emerald-400 focus:outline-2 font-semibold border-solid border-3 leading-1 rounded-xl'
          type='text'
          value={questNameInput}
          onChange={(e) => setQuestNameInput(e.target.value)}
          placeholder='Name you quest'
        />
        
        <input className='w-sm mb-6 accent-emerald-400 hover:accent-emerald-400 cursor-pointer'
          type='range'
          min={5}
          max={120}
          step={5}
          value={questDuration}
          onChange={(e) => setQuestDuration(Number(e.target.value))}
        />
        
        <p className='mb-6 text-center'>
          <span className='text-emerald-400 font-semibold'>{questDuration}</span> minutes focus<br/><span className='text-emerald-400 font-semibold'>{Math.floor(questDuration / 5)}</span> minutes break
        </p>
        
        <button
          className={`mt-3 px-9 py-3 rounded-full font-semibold ${
            canStart
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          onClick={() =>
            canStart && startQuest()
          }
          disabled={!canStart}
        >
          Begin your Quest
        </button>

      </div>
    </div>
  );
}
