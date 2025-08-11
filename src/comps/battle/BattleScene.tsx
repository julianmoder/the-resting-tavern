import { useEffect, useRef, useState } from 'react';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import HeroView from '../hero/HeroView';
import BossView from '../boss/BossView';
import { useAppStore } from '../../store/useAppStore';
import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import { useBattle } from '../../hooks/useBattle';
import { BattleOutcome } from '../../types/base';

type Props = { className?: string };

export default function BattleScene({ className = '' }: Props) {
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [boot, setBoot] = useState<PixiBoot | null>(null);

  // pixi boot
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

  // idle loop
  useEffect(() => {
    if (!boot?.app) return;
    const { app } = boot;

    let bossAcc = 0;
    let heroAcc = 0;

    const tick = (t: any) => {
      if (battle.isPaused) return;
      if (battle.outcome !== BattleOutcome.None) return;
      if (!hero.stats || !boss.stats) return;

      const dt = t?.elapsedMS ?? 16.7;

      // hero auto attack
      // damage: heroDamage = hero.level + weapon.power
      // interval: weapon.attackSpeed (fallback 0.6 aps)
      const weapon = hero.equipment?.weapon;
      const heroAps = weapon?.attackSpeed ?? 0.6;
      const heroIntervalMs = Math.max(500, Math.round(1000 / Math.max(0.1, heroAps)));
      heroAcc += dt;

      if (heroAcc >= heroIntervalMs) {
        heroAcc = 0;

        const heroDmgBase = (hero.level ?? 1) + (weapon?.power ?? 0);
        const bossDef = boss.stats.defense ?? 0;
        const heroDmg = Math.max(0, heroDmgBase - bossDef);

        // minimum 1 damage
        const heroDamage = heroDmg > 0 ? heroDmg : 1;
        battle.damageBoss(heroDamage);
      }

      // boss auto attack or random mechanic
      const bossAps = boss.stats.attackSpeed ?? 0.5;
      const bossIntervalMs = Math.max(500, Math.round(1000 / Math.max(0.1, bossAps)));
      bossAcc += dt;

      if (bossAcc >= bossIntervalMs) {
        bossAcc = 0;

        // roll boss mechanic
        const mechs = boss.mechanics ?? [];
        const picked = mechs.find((m: any) => Math.random() < (m.chance ?? 0));

        if (picked) {
          // hier NUR triggern/anmelden – eigentliche Interaktion/Overlay kommt als nächster Schritt
          // Du kannst dir im State merken, dass eine Mechanik aktiv ist:
          // z.B. s.setBattleActiveMechanic(picked)
          // Für jetzt loggen wir es nur:
          console.debug('[Boss] mechanic triggered:', picked.name);
          return;
        }

        // boss auto attack
        const bossDmgBase = boss.stats.attack ?? 1;
        const heroDef = hero.stats.defense ?? 0;
        const bossDmg = Math.max(0, bossDmgBase - heroDef);

        // minimum 1 damage
        const bossDamage = bossDmg > 0 ? bossDmg : 1;
        battle.damageHero(bossDamage);
      }
    };

    app.ticker.add(tick);
    return () => app.ticker?.remove(tick);
  }, [boot]);

  // set defeat or victory
  useEffect(() => {
    if (battle.outcome !== BattleOutcome.None) return;
  
    if (hero.stats.health <= 0) {
      battle.setOutcome(BattleOutcome.Defeat);
    } else if (boss.stats.health <= 0) {
      battle.setOutcome(BattleOutcome.Victory);
    }
  }, [hero, boss, battle]);

  // pause on tab or website visibility change (e.g. change browser tab)
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
          <HeroView boot={boot} pos={hero.position} intent="idle" />
          <BossView boot={boot} pos={boss.position} intent="idle" />
        </>
      )}
    </div>
  );
}