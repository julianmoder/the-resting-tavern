import { useState, useRef } from 'react';
import { questQuestions } from '../utils/questQuestions';
import { useAppStore } from '../store/useAppStore';
import { useHero } from '../hooks/useHero';
import { useUI } from '../hooks/useUI';
import CharacterInventory from '../comps/CharacterInventory';
import CharacterOverview from '../comps/CharacterOverview';
import Toolbar from '../comps/Toolbar';

type TavernPageProps = {
  onStartQuest: () => void;
};

export default function TavernPage({ onStartQuest }: TavernPageProps) {
  const [randomQuestion] = useState(questQuestions[Math.floor(Math.random() * questQuestions.length)]);
  const [questNameInput, setQuestNameInput] = useState('');
  const [questDuration, setQuestDuration] = useState(25);
  const weaponRef = useRef<HTMLDivElement | null>(null);
  const armourRef = useRef<HTMLDivElement | null>(null);
  const canStart = questNameInput.trim().length > 0;
  const setQuest = useAppStore(s => s.setQuest);
  const hero = useHero();
  const ui = useUI();

  const handleDropItem = (item: Item, clientX: number, clientY: number) => {
    const slots = [
      { ref: weaponRef, slot: 'weapon' as const },
      { ref: armourRef, slot: 'armour' as const },
    ];
    for (const { ref, slot } of slots) {
      const el = ref.current;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        hero.equipment.equipItem(item, slot);
        return true;
      }
    }
    return false;
  };

  const startQuest = () => {
    setQuest(questNameInput, questDuration, hero);
    onStartQuest();
  }

  return (
    <>

      <Toolbar />

      <div className="flex w-full h-full relative">

        {/* Charakter Overview + Inventory */}
        {ui.toolbar.showCharacter && (
          <div className="absolute right-0 top-0 z-20 bg-gray-800 p-4 rounded-lg shadow-lg">
            <CharacterOverview weaponRef={weaponRef} armourRef={armourRef} />
            <CharacterInventory onDropItem={handleDropItem} />
          </div>
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
    </>
  );
}
