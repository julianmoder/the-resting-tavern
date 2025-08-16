import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BattleOutcome, InteractionName, BossMechanicPhase } from '../../types/base';
import type { BossMechanic, Interaction } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { useUI } from '../../hooks/useUI';
import HeroView from '../hero/HeroView';
import BossView from '../boss/BossView';
import { useAppStore } from '../../store/useAppStore';
import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import { useBattle } from '../../hooks/useBattle';
import { ReactionClick } from '../../engine/interactions/reactionClick';
import { KeyMash } from '../../engine/interactions/keyMash';
import { DodgeDirection } from '../../engine/interactions/dodgeDirection';


type Props = { className?: string };

export default function BattleScene({ className = '' }: Props) {
  const ui = useUI();
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const activeMechInteractionRef = useRef<Interaction | null>(null);
  const mechanicActiveRef = useRef(false);
  const mechanicFailDamage = Math.floor(hero.stats.maxHealth / 5);

  function launchMechanic(mechanic: BossMechanic) {
    setTimeout(() => {
      const interaction = mechanic.interaction;
      let mechInteraction: Interaction;
      if (interaction === InteractionName.ReactionClick) mechInteraction = new ReactionClick();
      else if (interaction === InteractionName.KeyMash) mechInteraction = new KeyMash();
      else mechInteraction = new DodgeDirection();

      activeMechInteractionRef.current?.cleanup();
      activeMechInteractionRef.current = mechInteraction;

      const duration = mechanic.duration ?? 2500;
      const now = performance.now();
      const deadline = now + duration;

      battle.setMechanic({ 
        deadline: deadline,
        phase: BossMechanicPhase.Interaction, 
      });

      mechInteraction.start({
        now,
        deadline,
        onSuccess: () => {
          // TODO: add level dependency for damage
          battle.damageBoss(mechanic.damageBaseBoss);
          battle.setMechanic({ 
            phase: BossMechanicPhase.Success, 
            overlay: {
              text: mechanic.successText,
              flash: BossMechanicPhase.Success,
              shake: false,
            }
          });
          cleanupMechanic();
        },
        onFail: () => {
          // TODO: add level dependency for damage
          battle.damageHero(mechanic.damageBaseHero);
          battle.setMechanic({ 
            phase: BossMechanicPhase.Fail, 
            overlay: {
              text: mechanic.failText,
              flash: BossMechanicPhase.Fail,
              shake: true,
            }
          });
          cleanupMechanic();
        },
      });

      const prompt = mechInteraction.getPrompt();

      battle.setMechanic({
        overlay: {
          text: prompt,
        },
      });
    }, mechanic.windup ?? 0);
  }

  function cleanupMechanic() {
    activeMechInteractionRef.current?.cleanup();
    activeMechInteractionRef.current = null;
    mechanicActiveRef.current = false;
    battle.setMechanic({ deadline: null });
    setTimeout(() => { battle.resetMechanic() }, 3000);
  }

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

    return () => { cancelled = true; b.destroy(); cleanupMechanic(); ui.pixi.setBoot(null); };
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

      const now = performance.now();
      if (mechanicActiveRef.current) {
        activeMechInteractionRef.current?.update(dt, now);
        // timeout
        if (state.battle.mechanic.deadline && now > state.battle.mechanic.deadline) {
          // fail as fallback
          battle.damageHero(mechanicFailDamage);
          cleanupMechanic();
        }
      }

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
          if (!mechanicActiveRef.current) {
            const newMechanic = {
              id: uuidv4(),
              phase: BossMechanicPhase.Windup,
              deadline: null,
              active: true,
              overlay: {
                text: picked.windupText ?? undefined,
                flash: null,
                shake: false,
              },
              name: picked.name,
              chance: picked.chance,
              windup: picked.windup,
              interaction: picked.interaction,
              duration: picked.duration,
              damageBaseBoss: picked.damageBaseBoss ?? 0,
              damageBaseHero: picked.damageBaseHero ?? 0,
              windupText: picked.windupText ?? undefined,
              successText: picked.successText ?? undefined,
              failText: picked.failText ?? undefined,
            }
            battle.setMechanic(newMechanic);
            console.log(newMechanic);
            launchMechanic(newMechanic);
            mechanicActiveRef.current = true;
          }
          return;
        }

        // boss auto attack
        if (mechanicActiveRef.current) return;
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

  // handle interactio inputs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => activeMechInteractionRef.current?.handleInput(e);
    const onMouse = (e: MouseEvent) => activeMechInteractionRef.current?.handleInput(e);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouse);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouse);
    };
  }, []);

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