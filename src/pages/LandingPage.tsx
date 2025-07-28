import { useState } from 'react';
import { species } from 'fantastical';
import { useHero } from '../hooks/useHero';

type LandingPageProps = {
  onEnterTavern: () => void
};

export default function LandingPage({ onEnterTavern }: LandingPageProps) {
  const [name, setName] = useState('');
  const hero = useHero();

  const genHeroName = () => {
    const randomHeroName = species.human({'allowMultipleNames':true})
    setName(randomHeroName);
  };

  const isHeroNameValid = name.trim().length > 0;

  const enterTavern = (name: string) => {
    hero.setName(name)
    onEnterTavern()
  };

 

  return (
    <>

      <p className='mb-3 text-center font-bold'>What is your name, weary traveler?</p>

      <div className='flex space-x-2 mt-6'>

        <input className='p-2 text-center text-orange-500 focus:text-orange-500 focus:outline-orange-500 focus:outline-2 font-semibold border-solid border-3 leading-1 rounded-xl'
          type='text'
          value={name}
          onChange={(e) => hero.setName(e.target.value)}
          placeholder={'Enter your hero\'s name'}
        />

        <button
          className='hover:bg-orange-500 text-white px-3 rounded-full font-normal text-3xl'
          onClick={genHeroName}
        >
          🎲
        </button>

      </div>

      <button className={`mt-18 px-9 py-3 rounded-full font-semibold 
        ${ isHeroNameValid
            ? 'bg-orange-500 text-white :bg-orange-600'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
        onClick={() => isHeroNameValid && enterTavern(name.trim())}
        disabled={!isHeroNameValid}
      >
        Enter the Tavern
      </button>

    </>
  );
}
