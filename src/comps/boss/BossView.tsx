import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { BossRig } from '../../engine/pixi/bossRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { useBattle } from '../../hooks/useBattle';

// Neu: Adapter-basierte Init-Helper
import { createBossRig } from '../../engine/pixi/initRigs';
import type { DragonBonesFactoryLike } from '../../engine/pixi/dragonbonesAdapter';
import type { BossWeaponSpec } from '../../types/rig';

// Pixi v8: für interaktives Overlay
import { Graphics, Rectangle } from 'pixi.js';

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

export default function BossView({ boot, pos, intent = 'idle' }: Props) {
  const battle = useBattle();
  const rigRef = useRef<BossRig | null>(null);
  const hitRef = useRef<Graphics | null>(null);
  const aliveRef = useRef(true);

  useLayoutEffect(() => {
    aliveRef.current = true;
    const stage = (boot as any).stage;
    if (!stage) return;

    let cancelled = false;

    (async () => {
      const factory: DragonBonesFactoryLike = (PixiFactory as any)?.factory;
      if (!factory) {
        // eslint-disable-next-line no-console
        console.error('[BossView] DragonBones factory not available');
        return;
      }

      const rig = await createBossRig(
        factory,
        'golem', // dragonBonesName (Alias-Paket)
        '/assets/boss/golem/skeleton.json',
        '/assets/boss/golem/texture.json',
        '/assets/boss/golem/texture.png',
        'golem_armature' // Armature-Name im SKE
      );
      if (cancelled || !aliveRef.current) return;

      rig.mount(stage);
      rig.setPosition(pos.x, pos.y);
      rig.play(intentToAnim(intent), true, 0.25);
      rigRef.current = rig;

      // Klickbares Hit-Overlay (Pixi v8: eventMode + hitArea)
      const g = new Graphics();
      g.eventMode = 'static'; // wichtig für Events in v8
      // Rechteck um die Boss-Position (anpassen an eure Rig/Bounds)
      const W = 240, H = 240;
      g.hitArea = new Rectangle(-W / 2, -H / 2, W, H);
      g.position.set(pos.x, pos.y);
      // g.alpha = 0.001; // unsichtbar; bei Debugging auf 0.2 setzen & drawRect
      // g.rect(-W/2, -H/2, W, H).fill(0x00ff00); // Debug

      const onTap = () => {
        battle.damageBoss(999);
        rig.play('hurt');
        // nach kurzer Zeit zurück zu idle
        setTimeout(() => rig.play('idle', true), 150);
      };
      g.on('pointertap', onTap);

      stage.addChild(g);
      hitRef.current = g;
    })();

    return () => {
      cancelled = true;
      aliveRef.current = false;

      if (hitRef.current) {
        hitRef.current.removeFromParent();
        hitRef.current.destroy();
        hitRef.current = null;
      }
      try {
        // @ts-ignore optional destroy in eurer Implementierung
        rigRef.current?.destroy?.();
      } finally {
        rigRef.current = null;
      }
    };
  }, [boot.stage]);

  useLayoutEffect(() => {
    // Rig & Hit-Overlay an neue Position schieben
    rigRef.current?.setPosition(pos.x, pos.y);
    if (hitRef.current) {
      hitRef.current.position.set(pos.x, pos.y);
    }
  }, [pos.x, pos.y]);

  useLayoutEffect(() => {
    const anim = intentToAnim(intent);
    const loop = anim === 'idle';
    rigRef.current?.play(anim, loop);
  }, [intent]);

  return null;
}
