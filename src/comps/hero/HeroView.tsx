import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { HeroRig } from '../../engine/pixi/heroRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { createHeroRig } from '../../engine/pixi/initRigs';
import type { DragonBonesFactoryLike } from '../../engine/pixi/dragonbonesAdapter';
import { PixiFactory } from 'pixi-dragonbones-runtime';

type Props = {
  boot: PixiBoot;
  pos: Vector2D;
  intent?: 'idle' | 'attack' | 'block' | 'hurt';
};

function intentToAnim(intent: Props['intent']): import('../../types/rig').AnimName {
  switch (intent) {
    case 'attack':
      return 'attack_slash';
    case 'block':
      return 'block';
    case 'hurt':
      return 'hurt';
    case 'idle':
    default:
      return 'idle';
  }
}

export default function HeroView({ boot, pos, intent = 'idle' }: Props) {
  const rigRef = useRef<HeroRig | null>(null);
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
        console.error('[HeroView] DragonBones factory not available');
        return;
      }

      const skeUrl = new URL( '../../assets/characters/heroes/skeleton/skeletonArmature_ske.json', import.meta.url ).href;
      const texUrl = new URL( '../../assets/characters/heroes/skeleton/skeletonArmature_tex.json', import.meta.url ).href;
      const pngUrl = new URL( '../../assets/characters/heroes/skeleton/skeletonArmature_tex.png', import.meta.url ).href;

      const rig = await createHeroRig(
        factory,
        'hero',
        skeUrl,
        texUrl,
        pngUrl,
        'Armature'
      );
      if (cancelled || !aliveRef.current) return;

      rig.mount(stage);
      rig.setPosition(pos.x, pos.y);
      rig.play(intentToAnim(intent), true, 0.25);
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

  // set idle animation
  useLayoutEffect(() => {
    const anim = intentToAnim(intent);
    const loop = anim === 'idle' ? 0 : 1 ;
    rigRef.current?.play(anim, loop);
  }, [intent]);

  return null;
}
