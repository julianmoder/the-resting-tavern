import { useAppStore } from './store/useAppStore';
import Header from './comps/Header';
import LandingPage from './pages/LandingPage';
import TavernPage from './pages/TavernPage';
import QuestPage from './pages/QuestPage';
import BossPage from './pages/BossPage';
import LootPage from './pages/LootPage';
import BreakPage from './pages/BreakPage';

export default function App() {
  const stage = useAppStore((s) => s.stage);
  const setStage = useAppStore((s) => s.setStage);
  const quest = useAppStore((s) => s.quest);
  const resetQuest = useAppStore((s) => s.resetQuest);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-stone-800 p-6 mx-auto'>
      <Header />
      <main className='w-full max-w-2xl flex-1 flex flex-col items-center'>
        <div className='min-h-max flex flex-col items-center justify-center p-6 mt-12 text-3xl text-white mx-auto leading-11'>

          { stage === 'landing' ? (
              <LandingPage onEnterTavern={() => { setStage('tavern') }} />
            ) : stage === 'tavern' ? (
              <TavernPage onStartQuest={() => { setStage('quest'); }} />
            ) : stage === 'quest' ? (
              <QuestPage quest={quest} onQuestComplete={() => { setStage('boss') }} />
            ) : stage === 'boss' ? (
              <BossPage quest={quest} onBossWin={() => { setStage('loot') }} />
            ) : stage === 'loot' ? (
              <LootPage quest={quest} onLootTake={() => { setStage('break'); }} />
            ) : stage === 'break' ? (
              <BreakPage onGoBack={() => { resetQuest(); setStage('tavern'); }}/>
            ) : (
              <p>no content</p>
            )
          }

        </div>
      </main>
    </div>
  );
}
