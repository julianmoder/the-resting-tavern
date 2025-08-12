import { useEffect, useRef } from 'react';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { useUI } from '../../hooks/useUI';
import HeroView from '../hero/HeroView';
import BossView from '../boss/BossView';
import { useAppStore } from '../../store/useAppStore';
import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import { useBattle } from '../../hooks/useBattle';
import { BattleOutcome } from '../../types/base';

type Props = { className?: string };

export default function BattleScene({ className = '' }: Props) {
  const ui = useUI();
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();
  const hostRef = useRef<HTMLDivElement | null>(null);

  // pixi boot
  useEffect(() => {
    const host = hostRef.current!;
    const b = new PixiBoot();
    let cancelled = false;

    (async () => {
      await b.init(host, { baseWidth: 1280, baseHeight: 720, backgroundAlpha: 0 });
      if (cancelled) { b.destroy(); return; }
      ui.pixi.setBoot(b);
    })();

    return () => { cancelled = true; b.destroy(); ui.pixi.setBoot(null); };
  }, []);

  // idle loop
  useEffect(() => {
    if (!ui.pixi.boot?.app) return;
    const { app } = ui.pixi.boot;

    let bossAcc = 0;
    let heroAcc = 0;

    const tick = (t: any) => {
      const state = useAppStore.getState(); // <- immer aktueller Zustand

      if (state.battle.isPaused === true) return;
      if (state.battle.outcome !== BattleOutcome.None) return;
      if (!state.hero.stats || !state.boss.stats) return;

      const dt = t?.elapsedMS ?? 16.7;

      // hero auto attack
      // damage: heroDamage = hero.level + weapon.power
      // interval: weapon.attackSpeed (fallback 0.6 aps)
      const weapon = state.hero.equipment?.weapon;
      const heroAps = weapon?.attackSpeed ?? 0.2;
      const heroIntervalMs = Math.max(500, Math.round(1000 / Math.max(0.1, heroAps)));
      heroAcc += dt;

      if (heroAcc >= heroIntervalMs) {
        heroAcc = 0;

        const heroDmgBase = (state.hero.level ?? 1) + (weapon?.power ?? 0);
        const bossDef = state.boss.stats.defense ?? 0;
        const heroDmg = Math.max(0, heroDmgBase - bossDef);

        // minimum 1 damage
        const heroDamage = heroDmg > 0 ? heroDmg : 1;
        battle.damageBoss(heroDamage);
      }

      // boss auto attack or random mechanic
      const bossAps = state.boss.stats.attackSpeed ?? 0.5;
      const bossIntervalMs = Math.max(500, Math.round(1000 / Math.max(0.1, bossAps)));
      bossAcc += dt;

      if (bossAcc >= bossIntervalMs) {
        bossAcc = 0;

        // roll boss mechanic
        const mechs = state.boss.mechanics ?? [];
        const picked = mechs.find((m: any) => Math.random() < (m.chance ?? 0));

        if (picked) {
          // hier NUR triggern/anmelden – eigentliche Interaktion/Overlay kommt als nächster Schritt
          // Du kannst dir im State merken, dass eine Mechanik aktiv ist:
          // z.B. s.setBattleActiveMechanic(picked)
          // Für jetzt loggen wir es nur:
          console.log('[Boss] mechanic triggered:', picked.name);
          return;
        }

        // boss auto attack
        const bossDmgBase = state.boss.stats.attack ?? 1;
        const armor = state.hero.equipment?.armor;
        const heroDef = armor?.power ?? 0;
        const bossDmg = Math.max(0, bossDmgBase - heroDef);

        // minimum 1 damage
        const bossDamage = bossDmg > 0 ? bossDmg : 1;
        battle.damageHero(bossDamage);
      }
    };

    app.ticker.add(tick);
    return () => {
      app.ticker?.remove(tick);
    };
  }, [ui.pixi.boot]);

  // set defeat or victory
  useEffect(() => {
    if (battle.outcome !== BattleOutcome.None) return;
    if (battle.isPaused === true) return;
    
    if (hero.stats.health <= 0) {
      battle.setOutcome(BattleOutcome.Defeat);
      battle.setPause(true);
    } else if (boss.stats.health <= 0) {
      battle.setOutcome(BattleOutcome.Victory);
      battle.setPause(true);
    }
  }, [hero, boss, battle]);

  // pause on tab or website visibility change (e.g. change browser tab)
  useEffect(() => {
    const onVis = () => {
      battle.setPause(document.hidden);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div className={className}>
      <div ref={hostRef} className="relative w-full h-full overflow-hidden bg-stone-900" />
      {ui.pixi.boot?.isReady && (
        <>
          <HeroView boot={ui.pixi.boot} pos={hero.position} intent="idle" />
          <BossView boot={ui.pixi.boot} pos={boss.position} intent="idle" />
        </>
      )}
    </div>
  );
}