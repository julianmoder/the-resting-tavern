import { useState } from 'react';
import { useHero } from '../hooks/useHero';
import { useInventory } from '../hooks/useInventory'
import { HeroClass } from '../types/base';

type LandingPageProps = {
  onEnterTavern: () => void
};

export default function LandingPage({ onEnterTavern }: LandingPageProps) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<HeroClass>(HeroClass.Warrior);
  const hero = useHero();
  const inventory = useInventory();

  const genHeroName = async () => {
    const { species } = await import('fantastical');
    const randomHeroName = species.human({'allowMultipleNames':true})
    setName(randomHeroName);
  };

  const isHeroNameValid = name.trim().length > 0;

  const heroClasses = Object.values(HeroClass);

  const enterTavern = (heroName: string, heroClass: HeroClass ) => {
    hero.setName(heroName);
    hero.setClass(heroClass);
    const invID = inventory.create(10, 6);
    hero.attachInventory(invID);
    onEnterTavern();
  };

 return (
    <div className='text-white'>
      <div className='flex flex-1 flex-col justify-center items-center'>
        <p className='mb-3 text-center font-bold'>What is your name, weary traveler?</p>
        <div className='relative flex mt-6'>
          <input className='p-2 px-10 text-center text-orange-500 focus:text-orange-500 focus:outline-orange-500 focus:outline-2 font-semibold border-solid border-3 leading-1 rounded-xl'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={'Enter your hero\'s name'}
          />
          <button
            className='absolute top-1 right-0 px-1 text-2xl'
            onClick={genHeroName}
          >
            🎲
          </button>
        </div>
        <div className="flex space-x-2 mt-9 justify-center">
          {heroClasses.map((heroClass) => (
            <button
              key={heroClass}
              className={`px-9 py-3 rounded-full font-semibold
                ${selectedClass === heroClass
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-600 text-gray-400 hover:bg-orange-600 hover:text-white'}
              `}
              onClick={() => {
                setSelectedClass(heroClass);
              }}
            >
              {heroClass.charAt(0).toUpperCase() + heroClass.slice(1)}
            </button>
          ))}
        </div>
        <button className={`mt-18 px-9 py-3 rounded-full font-semibold 
          ${ isHeroNameValid 
            ? 'bg-orange-500 text-white :bg-orange-600' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed' }
          `}
          onClick={() => isHeroNameValid && enterTavern(name.trim(), selectedClass)}
          disabled={!isHeroNameValid}
        >
          Enter the Tavern
        </button>
      </div>
    </div>
  );
}
