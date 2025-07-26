// src/pages/LootPage.tsx
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { largeItemWeapons } from '../utils/largeItemWeapons';
import { largeItemArmors } from '../utils/largeItemArmors';

type LootPageProps = {
  onLootTake: () => void;
};

type Armor = { 
  name: string;
  type: string; 
  category: string; 
  rarity: string,
  chance: number, 
  power: number 
};

type Weapon = { 
  name: string;
  type: string; 
  category: string; 
  rarity: string,
  chance: number, 
  power: number 
};

const weapons = largeItemWeapons;
const armors = largeItemArmors;

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LootPage({ onLootTake }: LootPageProps) {
  const setLoot = useAppStore(s => s.setLoot);
  const setStage = useAppStore(s => s.setStage);
  const [armor, setArmor] = useState<Armor | null>(null);
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [coins] = useState(Math.floor(Math.random() * 50) + 10);
  const [potions] = useState(Math.floor(Math.random() * 3) + 1);

  useEffect(() => {
    setArmor({ type: 'armor', ...randomChoice(armors) });
    setWeapon({ type: 'weapon', ...randomChoice(weapons) });
  }, [])

  const takeWeapon = (weapon: Weapon) => {
    setLoot({ coins, potions, weapon, armor: undefined })
  }

  const takeArmor = (armor: Armor) => {
    setLoot({ coins, potions, weapon: undefined, armor })
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">🎁 You found...</h2>
      <p>💰 Coins: {coins}</p>
      <p>🧪 Potions: {potions}</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {weapon && (
          <div className="rounded-xl p-4 flex flex-col items-center">
            <p className="mb-2 text-lg font-semibold">
              🗡️ {weapon.name} (Power {weapon.power})
            </p>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-full text-white"
              onClick={() => {
                takeWeapon(weapon);
                onLootTake();
              }}
            >
              Take the weapon
            </button>
          </div>
        )}
        {armor && (
          <div className="rounded-xl p-4 flex flex-col items-center">
            <p className="mb-2 text-lg font-semibold">
              🛡️ {armor.name} (Defense {armor.power})
            </p>
            <button
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full text-white"
              onClick={() => {
                takeArmor(armor);
                onLootTake();
              }}
            >
              Take the armor
            </button>
          </div>
        )}
      </div>
    </>
  );
}
