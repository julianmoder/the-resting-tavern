import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useBattle } from '../../hooks/useBattle';
import type { Vector2D } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { BossMechanicPhase } from '../../types/base';
import SpeechBubble from '../ui/SpeechBubble';

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
  durationMs?: number; 
};

export default function BattleFloatingOverlay({ boot, durationMs = 1000 }: BattleFloatingOverlayProps) {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const battle = useBattle();
  const [now, setNow] = useState(performance.now());

  const timeLeft = useMemo(() => {
    if (!battle.mechanic.deadline) return null;
    return Math.max(0, battle.mechanic.deadline - now);
  }, [battle.mechanic.deadline, now]);

  const totalDuration = useMemo(() => {
    const total = battle.mechanic.phase === BossMechanicPhase.Windup ? battle.mechanic.windup : battle.mechanic.duration;
    if (!total) return undefined;
    return total;
  }, [battle.mechanic.phase, battle.mechanic.windup, battle.mechanic.duration]);

  const heroPos = useAppStore(s => s.hero?.position);
  const bossPos = useAppStore(s => s.boss?.position);
  const heroScreen = boot.worldToScreen(heroPos.x + 150, heroPos.y - 250);
  const bossScreen = boot.worldToScreen(bossPos.x - 150, bossPos.y - 250);

  const heroHp = useAppStore(s => s.hero?.stats?.health);
  const bossHp = useAppStore(s => s.boss?.stats?.health);
  const prevHeroHp = useRef(heroHp);
  const prevBossHp = useRef(bossHp);

  // clock
  useEffect(() => {
    if (!boot?.app) return;
    const tick = () => setNow(performance.now());
    boot.app.ticker.add(tick);
    return () => boot.app.ticker.remove(tick);
  }, [boot]);

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

  const showBossWindup = battle.mechanic.phase === BossMechanicPhase.Windup && battle.mechanic?.overlay?.text;
  const showHeroInteraction = battle.mechanic.phase === BossMechanicPhase.Interaction && battle.mechanic?.overlay?.text;
  const showHeroSuccess = battle.mechanic.phase === BossMechanicPhase.Success && battle.mechanic?.overlay?.text;
  const showBossFail = battle.mechanic.phase === BossMechanicPhase.Fail && battle.mechanic?.overlay?.text;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {showBossWindup && (
        <SpeechBubble
          x={bossScreen.left}
          y={bossScreen.top}
          side="right"
          color="stone-700"
          borderColor="stone-300"
          text={battle!.mechanic!.overlay!.text!}
          total={typeof totalDuration === 'number' ? totalDuration : undefined}
        />
      )}
      {showHeroInteraction && (
        <SpeechBubble
          x={heroScreen.left}
          y={heroScreen.top}
          side="left"
          color="blue-600"
          borderColor="blue-500"
          text={battle!.mechanic!.overlay!.text!}
          total={typeof totalDuration === 'number' ? totalDuration : undefined}
        />
      )}
      {showHeroSuccess && (
        <SpeechBubble
          x={heroScreen.left}
          y={heroScreen.top}
          side="left"
          color="blue-600"
          borderColor="blue-500"
          text={battle!.mechanic!.overlay!.text!}
        />
      )}
      {showBossFail && (
        <SpeechBubble
          x={bossScreen.left}
          y={bossScreen.top}
          side="right"
          color="stone-700"
          borderColor="stone-300"
          text={battle!.mechanic!.overlay!.text!}
        />
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