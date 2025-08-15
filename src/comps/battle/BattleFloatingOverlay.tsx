import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useBattle } from '../../hooks/useBattle';
import type { Vector2D } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { BossMechanicPhase } from '../../types/base';


type FloatingNumber = {
  id: string;
  target: 'hero' | 'boss';
  text: string;
  x: number;
  y: number;
  born: number;
};

type BattleFloatingOverlayProps = {
  boot: PixiBoot;
  heroPos: Vector2D;
  bossPos: Vector2D;
  durationMs?: number; 
};

export default function BattleFloatingOverlay({ boot, heroPos, bossPos, durationMs = 1000 }: BattleFloatingOverlayProps) {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const battle = useBattle();
  const [now, setNow] = useState(performance.now());

  const timeLeft = useMemo(() => {
    if (!battle.mechanic.deadline) return null;
    return Math.max(0, battle.mechanic.deadline - now);
  }, [battle.mechanic.deadline, now]);

  const heroHp = useAppStore(s => s.hero?.stats?.health);
  const bossHp = useAppStore(s => s.boss?.stats?.health);

  const prevHeroHp = useRef(heroHp);
  const prevBossHp = useRef(bossHp);

  // animation frame
  useEffect(() => {
    let raf = 0;
    const tick = () => { setNow(performance.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // hero floating numbers
  useEffect(() => {
    if (heroHp !== undefined && prevHeroHp.current !== undefined) {
      const diff = prevHeroHp.current - heroHp;
      if (diff > 0) {
        const { left, top } = boot.worldToScreen(heroPos.x, heroPos.y - 140);
        const id = `h-${performance.now()}`;
        setFloatingNumbers(prev => [
          ...prev,
          { id, target: 'hero', text: `-${diff}`, x: left, y: top, born: performance.now() }
        ]);
        setTimeout(() => setFloatingNumbers(p => p.filter(f => f.id !== id)), durationMs);
      }
    }
    prevHeroHp.current = heroHp;
  }, [heroHp, boot, heroPos, durationMs]);

  // boss floating numbers
  useEffect(() => {
    if (bossHp !== undefined && prevBossHp.current !== undefined) {
      const diff = prevBossHp.current - bossHp;
      if (diff > 0) {
        const { left, top } = boot.worldToScreen(bossPos.x, bossPos.y - 180);
        const id = `b-${performance.now()}`;
        setFloatingNumbers(prev => [
          ...prev,
          { id, target: 'boss', text: `-${diff}`, x: left, y: top, born: performance.now() }
        ]);
        setTimeout(() => setFloatingNumbers(p => p.filter(f => f.id !== id)), durationMs);
      }
    }
    prevBossHp.current = bossHp;
  }, [bossHp, boot, bossPos, durationMs]);

  // recompute screen position on resize/scale changes
  useEffect(() => {
    if (!boot?.app) return;
    const handler = () => {
      setFloatingNumbers((prev) =>
        prev.map((f) => {
          const src = f.target === 'hero' ? heroPos : bossPos;
          const yOffset = f.target === 'hero' ? -140 : -180;
          const p = boot.worldToScreen(src.x, src.y + yOffset);
          return { ...f, x: p.left, y: p.top };
        })
      );
    };
    const ro = new ResizeObserver(handler);
    const el = (boot as any)['container'] as HTMLDivElement | null;
    if (el) ro.observe(el);
    const tick = () => handler();
    boot.app?.ticker?.add(tick);
    return () => {
      ro.disconnect();
      boot.app?.ticker?.remove(tick);
    };
  }, [boot, heroPos, bossPos]);

  const glowClass =
    battle.mechanic.overlay.flash === 'success'
      ? 'after:content-[""] after:absolute after:inset-0 after:bg-emerald-500/25 after:animate-[flash_500ms_ease-out]'
      : battle.mechanic.overlay.flash === 'fail'
      ? 'after:content-[""] after:absolute after:inset-0 after:bg-rose-600/25 after:animate-[flash_500ms_ease-out]'
      : '';
  const shakeClass = battle.mechanic.overlay.shake ? 'animate-[shake_300ms_ease]' : '';

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {battle.mechanic.phase !== BossMechanicPhase.Idle && (
        <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center pointer-events-none">
          <div className="inline-flex flex-col items-center gap-1 rounded-2xl bg-stone-900/70 border border-stone-700 px-4 py-2 shadow-lg">
            {battle.mechanic.overlay?.text ? <div className="text-white font-semibold">{battle.mechanic.overlay.text}</div> : null}
            {timeLeft !== null && battle.mechanic.phase !== BossMechanicPhase.Success && battle.mechanic.phase !== BossMechanicPhase.Fail ? (
              <div className="text-xs text-stone-400">{(timeLeft / 1000).toFixed(1)} s</div>
            ) : null}
            {/* Optional: Button für ReactionClick – pointer-events aktiv NUR am Button */}
            {battle.mechanic.phase === BossMechanicPhase.Interaction && battle.mechanic.overlay?.text?.toLowerCase().includes('klick') ? (
              <button
                className="pointer-events-auto mt-2 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                onMouseDown={() => {
                  // BattleScene hört global auf mousedown → reicht
                }}
              >
                Klick!
              </button>
            ) : null}
          </div>
        </div>
      )}
      {floatingNumbers.map((f) => (
        <div key={f.id}
          className={`absolute select-none font-bold ${
            f.target === 'hero' ? 'text-rose-400' : 'text-amber-300'
          }`}
          style={{
            left: f.x,
            top: f.y,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 1000ms ease-out',
            opacity: 1,
          }}
        >
          <span className="text-xl animate-[rise_0.9s_ease-out_forwards]" >
            {f.text}
          </span>
        </div>
      ))}
      {/* Keyframes */}
      <style>{`
        @keyframes rise { 100% { opacity: 0 } 90%{ opacity: 0 } 10%{ opacity: 1 } 0%{ opacity: 1 } }
        @keyframes flash { 0% { opacity: 0 } 20% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes shake {
          0% { transform: translate(0) }
          20% { transform: translate(-6px, 3px) }
          40% { transform: translate(4px, -2px) }
          60% { transform: translate(-3px, 2px) }
          80% { transform: translate(3px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}