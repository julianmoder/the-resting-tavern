import { useState } from 'react';
import Header from "./comps/Header";
import LandingPage from './pages/LandingPage';
import TavernPage from './pages/TavernPage';

type SessionConfig = { hero: string };
type QuestConfig = { quest: string; duration: number };

export default function App() {
  const [session, setSession] = useState<SessionConfig | null>(null);
  const [questConfig, setQuestConfig] = useState<QuestConfig | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-800 p-6 mx-auto">
      <Header />
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">

        {!session ? (
          <LandingPage onEnterTavern={hero => setSession({ hero })} />
        ) : !questConfig ? (
          <TavernPage hero={session.hero} onStartQuest={cfg => setQuestConfig(cfg)} />
        ) : (
          <section className="text-white flex flex-col items-center gap-2">
            <p>no content</p>
          </section>
        )}

      </main>
    </div>
  );
}
