import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useHero } from '../hooks/useHero';
import { useInventory } from '../hooks/useInventory'
import type { Quest, Item } from '../types/base';
import CharacterOverview from '../comps/CharacterOverview';
import { useUI } from '../hooks/useUI';
import SideBar from '../comps/SideBar';
import { useModal } from '../hooks/useModal';


type LootPageProps = {
  quest: Quest;
  onLootTake: () => void;
};

export default function LootPage({ quest, onLootTake }: LootPageProps) {
  const hero = useHero();
  const inventory = useInventory(hero.inventoryID);
  const ui = useUI();
  const modal = useModal();
  const setXpEarned = useAppStore((s) => s.setXpEarned);
  const setLootGained = useAppStore((s) => s.setLootGained);

  useEffect(() => {
    if (quest.xpEarned) return;
    setXpEarned();
    const tryLevelUpResult = hero.addXp(quest.loot.xp);
    if(tryLevelUpResult.leveledUp) {
      modal.sendModalMessage('Level Up!', `${hero.name} is now Level ${tryLevelUpResult.level}!`);
    }
  }, []);

  const takeItem = (item: Item) => {
    if (quest.lootGained) return;
    setLootGained();

    hero.addCoins(quest.loot.coins);
    const itemAdded = inventory.addItem(item);
    if(!itemAdded) {
      modal.sendModalMessage('Your Bags are full!', `There\'s no space for ${item.name}!`);
      return;
    }else{
      onLootTake();
    }
  }

  return (
    <>

      <SideBar />

      {/* Charakter Overview + Inventory */}
      {ui.sidebar.showCharacter && (
        <div className="absolute justify-center z-20 bg-gray-800 p-4 rounded-lg shadow-lg">
          <CharacterOverview />
        </div>
      )}

      <div className='mb-12 text-center'>
        <p className='mb-3 text-lg font-bold'>Victory!</p>
        <p className='font-bold text-emerald-400'>{quest.name}</p>
        <p><span className='text-violet-500 font-bold'>XP earned: {quest.loot.xp}</span></p>
      </div>
      <div className='mb-3 text-center'>
        <p>You found <span className='text-amber-400 font-bold'>{quest.loot.coins} coins</span> and may choose one of these precious items: </p>
      </div>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        { quest.loot.itemChoices && 
          quest.loot.itemChoices.map((item: Item, i: number) => (
            <div key={i} className='p-3 flex flex-col text-center'>
            <p className='mb-3 text-lg font-bold'>
              {item.name} <br/><span className='text-sm font-normal'>(Attack {item.power})</span>
            </p>
            <button
              className='bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-full text-white'
              onClick={() => {
                takeItem(item);
              }}
            >
              Take
            </button>
          </div>
          ))}
      </div>
    </>
  );
}
