import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { HeroRig } from '../../engine/pixi/heroRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';

// Neu: Adapter-basierte Init-Helper
import { createHeroRig } from '../../engine/pixi/initRigs';
import type { DragonBonesFactoryLike } from '../../engine/pixi/dragonbonesAdapter';

// Optional: direkte Factory aus eurer Runtime (falls vorhanden)
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

  useLayoutEffect(() => {
    aliveRef.current = true;
    const stage = (boot as any).stage;
    if (!stage) return;

    let cancelled = false;

    (async () => {
      // Factory beziehen (aus eurer DB-Runtime); ggf. aus boot holen, falls ihr das schon injiziert
      const factory: DragonBonesFactoryLike = (PixiFactory as any)?.factory;
      if (!factory) {
        // eslint-disable-next-line no-console
        console.error('[HeroView] DragonBones factory not available');
        return;
      }

      // HeroRig asynchron erstellen (Assets aliasen & laden)
      const rig = await createHeroRig(
        factory,
        'hero', // dragonBonesName (Alias-Paket)
        '/assets/characters/hero/dragonbones/skeleton.json',
        '/assets/characters/hero/dragonbones/texture.json',
        '/assets/characters/hero/dragonbones/texture.png',
        'hero_armature' // Armature-Name im SKE
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
      // vom Stage lösen & zerstören, falls Rig Cleanup anbietet
      try {
        // @ts-ignore optional destroy in eurer Implementierung
        rigRef.current?.destroy?.();
      } finally {
        rigRef.current = null;
      }
    };
  }, [boot.stage]);

  useLayoutEffect(() => {
    rigRef.current?.setPosition(pos.x, pos.y);
  }, [pos.x, pos.y]);

  useLayoutEffect(() => {
    const anim = intentToAnim(intent);
    // Idle soll loopen, Actions i. d. R. nicht
    const loop = anim === 'idle';
    rigRef.current?.play(anim, loop);
  }, [intent]);

  return null;
}
