import { useAppStore } from './store/useAppStore';
import Header from './comps/ui/Header';
import Modal from './comps/ui/Modal';
import LandingPage from './pages/LandingPage';
import TavernPage from './pages/TavernPage';
import QuestPage from './pages/QuestPage';
import BossPage from './pages/BossPage';
import LootPage from './pages/LootPage';
import BreakPage from './pages/BreakPage';
import { Stage } from './types/base';

export default function App() {
  const stage = useAppStore((s) => s.stage);
  const setStage = useAppStore((s) => s.setStage);
  const quest = useAppStore((s) => s.quest);
  const resetQuest = useAppStore((s) => s.resetQuest);

  return (
    <div className='min-w-screen min-h-screen flex flex-col items-center justify-center bg-stone-800'>
      <Header />
      <main className='w-full h-full flex flex-1 flex-col items-center justify-center'>
        <div className='w-full h-full flex flex-1 flex-col items-center justify-center'>

          { stage === Stage.Landing ? (
              <LandingPage onEnterTavern={() => { setStage(Stage.Tavern) }} />
            ) : stage === Stage.Tavern ? (
              <TavernPage onStartQuest={() => { setStage(Stage.Quest); }} />
            ) : stage === Stage.Quest ? (
              <QuestPage quest={quest} onQuestComplete={() => { setStage(Stage.Boss) }} />
            ) : stage === Stage.Boss ? (
              <BossPage quest={quest} onBossWin={() => { setStage(Stage.Loot) }} />
            ) : stage === Stage.Loot ? (
              <LootPage quest={quest} onLootTake={() => { setStage(Stage.Break); }} />
            ) : stage === Stage.Break ? (
              <BreakPage onGoBack={() => { resetQuest(); setStage(Stage.Tavern); }}/>
            ) : (
              <p>no content</p>
            )
          }

          <Modal />

        </div>
      </main>
    </div>
  );
}
