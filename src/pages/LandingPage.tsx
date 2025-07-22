import { useState } from 'react';
import { species } from 'fantastical';

export default function LandingPage({ onEnterTavern }: { onEnterTavern: (hero: string) => void }) {
  const [hero, setHero] = useState('');

  const genHero = () => {
    const randomHero = species.human({"allowMultipleNames":true})
    setHero(randomHero);
  };

  const isHeroValid = hero.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-4xl text-white mx-auto">
      <p className="mb-3 font-bold">What is your name, weary traveler?</p>

      <div className="flex space-x-2 mt-6">
        <input className="p-2 rounded-x1 text-center text-white font-normal border-solid border-2 leading-1 rounded-xl"
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

      <button className={`mt-18 px-9 py-3 font-normal rounded-full 
        ${ isHeroValid
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
        onClick={() => isHeroValid && onEnterTavern(hero.trim())}
        disabled={!isHeroValid}
      >
        Enter the Tavern
      </button>
    </div>
  );
}
