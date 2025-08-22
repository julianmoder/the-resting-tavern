import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { BossRig } from '../../engine/pixi/bossRig';
import { createBossRig } from '../../engine/pixi/initRigs';
import { AnimIntent } from '../../types/base';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { PixiFactory } from 'pixi-dragonbones-runtime';
import type { DragonBonesFactoryLike } from '../../engine/pixi/dragonbonesAdapter';
import { useBattle } from '../../hooks/useBattle';

type Props = {
  boot: PixiBoot;
  pos: Vector2D;
  intent?: AnimIntent;
};

const BossAnimIntend: Record<AnimIntent, string> = {
  [AnimIntent.Idle]: 'idle',
  [AnimIntent.Windup]: 'idle', 
  [AnimIntent.Mechanic]: 'idle',
  [AnimIntent.MechSuccess]:'attack', 
  [AnimIntent.MechFail]: 'hurt', 
  [AnimIntent.Attack]: 'attack', 
  [AnimIntent.Block]: 'block',
  [AnimIntent.Hurt]: 'hurt',
  [AnimIntent.Win]: 'idle', 
  [AnimIntent.Defeat]: 'idle',
};

const isLooping = (intend: AnimIntent) => intend === AnimIntent.Idle || intend === AnimIntent.Windup || intend === AnimIntent.Mechanic || intend === AnimIntent.Win || intend === AnimIntent.Defeat;

export default function BossView({ boot, pos, intent = 'idle' }: Props) {
  const { setAnimIntent } = useBattle();
  const rigRef = useRef<BossRig | null>(null);
  const playTokenRef = useRef(0);
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

      const name = BossAnimIntend[intent] ?? 'idle';
      const token = ++playTokenRef.current;

      rig.play?.(name, { once: !isLooping(intent) });

      if (!isLooping(intent)) {
        const onComplete = () => {
          if (playTokenRef.current !== token) return;
          setAnimIntent('boss', AnimIntent.Idle);
        };

        if (rig.once) {
          rig.once('complete', onComplete);
        } else if (rig.addEventListener) {
          rig.addEventListener('complete', onComplete, { once: true } as any);
        }
      }
    }, [intent]);

  return null;
}
