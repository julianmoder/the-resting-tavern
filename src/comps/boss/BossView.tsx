import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { BossRig } from '../../engine/pixi/bossRig';
import { createBossRig } from '../../engine/pixi/initRigs';
import { AnimIntent, RigEvent } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { PixiFactory } from 'pixi-dragonbones-runtime';
import type { DragonBonesFactoryLike } from '../../engine/pixi/dragonbonesAdapter';
import { useBattle } from '../../hooks/useBattle';

type Props = {
  boot: PixiBoot;
  pos: Vector2D;
  intent?: AnimIntent;
};

const BossAnimIntent: Record<AnimIntent, AnimIntent> = {
  [AnimIntent.Idle]: AnimIntent.Idle,
  [AnimIntent.Windup]: AnimIntent.Idle, 
  [AnimIntent.Mechanic]: AnimIntent.Idle,
  [AnimIntent.MechSuccess]:AnimIntent.Attack, 
  [AnimIntent.MechFail]: AnimIntent.Attack, 
  [AnimIntent.Attack]: AnimIntent.Attack, 
  [AnimIntent.Block]: AnimIntent.Block,
  [AnimIntent.Hurt]: AnimIntent.Hurt,
  [AnimIntent.Victory]: AnimIntent.Idle, 
  [AnimIntent.Defeat]: AnimIntent.Idle,
};

const loops = new Set<AnimIntent>([ AnimIntent.Idle, AnimIntent.Windup, AnimIntent.Mechanic, AnimIntent.Victory, AnimIntent.Defeat ]);

export default function BossView({ boot, pos, intent = AnimIntent.Idle }: Props) {
  const battle = useBattle();
  const rigRef = useRef<BossRig | null>(null);
  const playTokenRef = useRef(0);
  const completeHandlerRef = useRef<((p: any) => void) | null>(null);
  const aliveRef = useRef(true);

  // set armature and rig
  useLayoutEffect(() => {
    aliveRef.current = true;
    const stage = (boot as any).stage;
    if (!stage) return;

    let cancelled = false;

    (async () => {
      const factory: DragonBonesFactoryLike = (PixiFactory as any)?.factory;
      if (!factory) {
        // eslint-disable-next-line no-console
        console.error('[BossoView] DragonBones factory not available');
        return;
      }

      const skeUrl = new URL( '../../assets/characters/bosses/placeholdor/placeholdorArmature_ske.json', import.meta.url ).href;
      const texUrl = new URL( '../../assets/characters/bosses/placeholdor/placeholdorArmature_tex.json', import.meta.url ).href;
      const pngUrl = new URL( '../../assets/characters/bosses/placeholdor/placeholdorArmature_tex.png', import.meta.url ).href;

      const rig = await createBossRig(
        factory,
        'boss',
        skeUrl,
        texUrl,
        pngUrl,
        'Armature'
      );
      if (cancelled || !aliveRef.current) return;

      rig.mount(stage);
      rig.setPosition(pos.x, pos.y);
      rig.play(AnimIntent.Idle, true, 0.25);
      rigRef.current = rig;
    })();

    return () => {
      cancelled = true;
      aliveRef.current = false;
      try {
        // @ts-ignore
        rigRef.current?.destroy?.();
      } finally {
        rigRef.current = null;
      }
    };
  }, [boot.stage]);

  // set position
  useLayoutEffect(() => {
    rigRef.current?.setPosition(pos.x, pos.y);
  }, [pos.x, pos.y]);

  // set animation
  useLayoutEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;

    const name = BossAnimIntent[intent] ?? AnimIntent.Idle;
    const loop = loops.has(intent);
    const token = ++playTokenRef.current;

    rig.play(name, loop, 0.2);

    if (!loop) {
      const onComplete = () => {
        if (playTokenRef.current !== token) return;
        battle.setAnimIntent('boss', AnimIntent.Idle);
      };
      if (completeHandlerRef.current) rig.off(RigEvent.Complete, completeHandlerRef.current);
      completeHandlerRef.current = onComplete;
      rig.on(RigEvent.Complete, onComplete);
    }
  }, [intent, battle.setAnimIntent]);

  return null;
}
