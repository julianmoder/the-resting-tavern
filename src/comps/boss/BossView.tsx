import { useLayoutEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Vector2D } from '../../types/base';
import { BossRig } from '../../engine/pixi/bossRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { useBattle } from '../../hooks/useBattle';

type Props = {
  boot: PixiBoot;
  pos: Vector2D;
  intent?: 'idle' | 'attack' | 'block' | 'hurt';
};

export default function BossView({ boot, pos, intent = 'idle' }: Props) {
  const battle = useBattle();
  const rigRef = useRef<BossRig | null>(null);

  useLayoutEffect(() => {
    const stage = boot.stage;
    if (!stage) return;

    const rig = new BossRig();
    rig.mount(stage);
    rig.setPosition(pos.x, pos.y);
    rig.play(intent);

    rig.onClick = () => {
      battle.damageBoss(999);
      rig.play('hurt');
      setTimeout(() => rig.play('idle'), 150);
    };

    rigRef.current = rig;

    return () => {
      rigRef.current?.destroy();
      rigRef.current = null;
    };
  }, [boot.stage]);

  useLayoutEffect(() => {
    rigRef.current?.setPosition(pos.x, pos.y);
  }, [pos.x, pos.y]);

  useLayoutEffect(() => {
    rigRef.current?.play(intent);
  }, [intent]);

  return null;
}