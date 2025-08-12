import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Vector2D } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';

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

  const heroHp = useAppStore(s => s.hero?.stats?.health);
  const bossHp = useAppStore(s => s.boss?.stats?.health);

  const prevHeroHp = useRef(heroHp);
  const prevBossHp = useRef(bossHp);

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

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
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
      <style>{`
        @keyframes rise {
          100% { opacity: 0; }
          90% { opacity: 0; }
          10% { opacity: 1; }
          0% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}