import { useAppStore } from './store/useAppStore';
import Header from './comps/Header';
import Modal from './comps/Modal';
import LandingPage from './pages/LandingPage';
import TavernPage from './pages/TavernPage';
import QuestPage from './pages/QuestPage';
import BossPage from './pages/BossPage';
import LootPage from './pages/LootPage';
import BreakPage from './pages/BreakPage';
import { Stage } from './types/types';

export default function App() {
  const modal = useAppStore((s) => s.modal);
  const showModal = useAppStore((s) => s.showModal);
  const hideModal = useAppStore((s) => s.hideModal);
  const stage = useAppStore((s) => s.stage);
  const setStage = useAppStore((s) => s.setStage);
  const quest = useAppStore((s) => s.quest);
  const resetQuest = useAppStore((s) => s.resetQuest);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-stone-800 p-6 mx-auto'>
      <Header />
      <main className='w-full max-w-2xl flex-1 flex flex-col items-center'>
        <div className='min-h-max flex flex-col items-center justify-center p-6 mt-12 text-3xl text-white mx-auto leading-11'>

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

          <Modal showModal={showModal} title={modal.title} message={modal.message} onClose={hideModal} />

        </div>
      </main>
    </div>
  );
}
