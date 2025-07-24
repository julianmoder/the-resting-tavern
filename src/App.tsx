import { useState } from 'react';
import { useAppStore } from "./store/useAppStore";
import Header from "./comps/Header";
import LandingPage from './pages/LandingPage';
import TavernPage from './pages/TavernPage';
import QuestPage from './pages/QuestPage';
import BossPage from './pages/BossPage';
import LootPage from './pages/LootPage';
import BreakPage from './pages/BreakPage';

type SessionConfig = { hero: string };
type QuestConfig = { quest: string; duration: number };

export default function App() {
  const stage = useAppStore((s) => s.stage);
  const hero = useAppStore((s) => s.hero);
  const questConfig = useAppStore((s) => s.questConfig);
  const setStage = useAppStore((s) => s.setStage);
  const setHero = useAppStore((s) => s.setHero);
  const setQuestConfig = useAppStore((s) => s.setQuestConfig);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-800 p-6 mx-auto">
      <Header />
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <div className="min-h-max flex flex-col items-center justify-center p-6 mt-12 text-4xl text-white mx-auto leading-11">

          { stage === 'landing' ? (
              <LandingPage onEnterTavern={h => { setHero(h); setStage('tavern'); }} />
            ) : stage === 'tavern' ? (
              <TavernPage hero={hero} onStartQuest={cfg => { setQuestConfig(cfg); setStage('quest'); }} />
            ) : stage === 'quest' ? (
              <QuestPage config={questConfig} onQuestComplete={() => { setStage('boss') }} />
            ) : stage === 'boss' ? (
              <BossPage quest={questConfig.quest} onBossWin={() => { setStage('loot'); }} />
            ) : stage === 'loot' ? (
              <LootPage onLootTake={() => { setStage('break'); }} />
            ) : stage === 'break' ? (
              <BreakPage onGoBack={() => { setQuestConfig(undefined!); setStage('tavern'); }}/>
            ) : (
              <p>no content</p>
            )
          }

        </div>
      </main>
    </div>
  );
}
