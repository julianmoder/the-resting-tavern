import { useEffect, useRef, useState } from 'react';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import CharacterView from '../character/CharacterView';
import BossView from '../boss/BossView';
import { useAppStore } from '../../store/useAppStore'; // 👈 NEU

type Props = { className?: string };

export default function BattleScene({ className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [boot, setBoot] = useState<PixiBoot | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const b = new PixiBoot();
    let cancelled = false;

    (async () => {
      await b.init(host, { baseWidth: 1280, baseHeight: 720, backgroundAlpha: 0 });
      if (cancelled) { b.destroy(); return; }
      setBoot(b);
    })();

    return () => { cancelled = true; b.destroy(); setBoot(null); };
  }, []);

  useEffect(() => {
    if (!boot?.app) return;
    const { app } = boot;

    let accMs = 0;
    const ATTACK_PERIOD_MS = 3500;

    const tick = (t: any) => {
      const st: any = useAppStore.getState();
      if (st.isPaused) return;
      if (st.bossHp !== undefined && st.bossHp <= 0) return;

      accMs += t?.elapsedMS ?? 16.7;
      if (accMs >= ATTACK_PERIOD_MS) {
        // st.damagePlayer?.(6);
        accMs = 0;
      }
    };

    app.ticker.add(tick);
    return () => { app.ticker ? app.ticker.remove(tick) : ''; };
  }, [boot]);

  useEffect(() => {
    const onVis = () => {
      useAppStore.getState().setPaused?.(document.hidden);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div className={className}>
      <div ref={hostRef} className="relative w-full h-full overflow-hidden bg-stone-900" />
      {boot?.isReady && (
        <>
          <CharacterView boot={boot} x={240}  y={600} intent="idle" />
          <BossView      boot={boot} x={1000} y={600} intent="idle" />
        </>
      )}
    </div>
  );
}