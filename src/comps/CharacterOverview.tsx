import { RefObject } from 'react';
import { useHero } from '../hooks/useHero';


type Props = {
  weaponRef: RefObject<HTMLDivElement | null>;
  armourRef: RefObject<HTMLDivElement | null>;
};

export default function CharacterOverview({ weaponRef, armourRef }: Props) {
  const hero = useHero();

  const weapon = hero.equipment?.weapon;
  const armour = hero.equipment?.armour;

  return (
    <div className="bg-gray-700 text-sm rounded-md p-4 shadow-md
                    w-full mx-auto">
      {/* Charakterdaten */}
      <h2 className="text-xl font-bold text-orange-500 text-center">{hero.name}</h2>
      <h4 className="font-bold text-white mb-4 text-center">{hero.class.charAt(0).toUpperCase() + hero.class.slice(1)} Level {hero.level}</h4>
      <div className="space-y-1">
        <div>Health: {hero.stats.maxHealth}</div>
        <div>Energy: {hero.stats.maxEnergy}</div>
        <div>Strength: {hero.stats.str}</div>
        <div>Intelligence: {hero.stats.int}</div>
        <div>Dexterity: {hero.stats.dex}</div>
      </div>

      {/* Ausrüstungsslots */}
      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        {/* Waffenslot */}
        <div className="flex-1">
          <p className="font-semibold text-gray-300 mb-1 text-center sm:text-left">Weapon</p>
          <div
            ref={weaponRef}
            className="relative h-32 border-2 border-gray-500 rounded-lg flex items-center justify-center
                       bg-gray-800 hover:bg-gray-700 cursor-pointer"
            onDoubleClick={() => weapon && hero.equipment.unequipItem('weapon')}
          >
            {weapon && (
              <span className="text-blue-400 text-xs text-center px-1">{weapon.name}</span>
            )}
          </div>
        </div>

        {/* Rüstungsslot */}
        <div className="flex-1">
          <p className="font-semibold text-gray-300 mb-1 text-center sm:text-left">Armour</p>
          <div
            ref={armourRef}
            className="relative h-32 border-2 border-gray-500 rounded-lg flex items-center justify-center
                       bg-gray-800 hover:bg-gray-700 cursor-pointer"
            onDoubleClick={() => armour && hero.equipment.unequipItem('armour')}
          >
            {armour && (
              <span className="text-green-400 text-xs text-center px-1">{armour.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}