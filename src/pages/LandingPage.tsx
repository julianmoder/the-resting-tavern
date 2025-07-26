import { useState } from 'react';
import { species } from 'fantastical';

type LandingPageProps = {
  onEnterTavern: (hero: string) => void
};

export default function LandingPage({ onEnterTavern }: LandingPageProps) {
  const [hero, setHero] = useState('');

  const genHero = () => {
    const randomHero = species.human({"allowMultipleNames":true})
    setHero(randomHero);
  };

  const isHeroValid = hero.trim().length > 0;

  return (
    <>

      <p className="mb-3 text-center font-bold">What is your name, weary traveler?</p>

      <div className="flex space-x-2 mt-6">

        <input className="p-2 rounded-x1 text-center text-amber-400 focus:text-amber-400 focus:outline-amber-400 focus:outline-2 font-semibold border-solid border-3 leading-1 rounded-xl"
          type="text"
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          placeholder="Enter your hero's name"
        />

        <button
          className="hover:bg-stone-600 text-white px-3 rounded-full font-normal text-4xl"
          onClick={genHero}
        >
          🎲
        </button>

      </div>

      <button className={`mt-18 px-9 py-3 font-normal text-amber-900 rounded-full 
        ${ isHeroValid
            ? 'bg-amber-400 hover:bg-amber-500'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
        onClick={() => isHeroValid && onEnterTavern(hero.trim())}
        disabled={!isHeroValid}
      >
        Enter the Tavern
      </button>

    </>
  );
}
