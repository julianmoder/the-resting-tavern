import { useLayoutEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BossRig } from '../../engine/pixi/bossRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';
import { useBattle } from '../../hooks/useBattle'

type Props = {
  boot: PixiBoot;
  x: number;
  y: number;
  intent?: 'idle' | 'attack' | 'block' | 'hurt';
};

export default function BossView({ boot, x, y, intent = 'idle' }: Props) {
  const battle = useBattle();
  const rigRef = useRef<BossRig | null>(null);

  useLayoutEffect(() => {
    const stage = boot.stage;
    if (!stage) return;

    const rig = new BossRig();
    rig.mount(stage);
    rig.setPosition(x, y);
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
    rigRef.current?.setPosition(x, y);
  }, [x, y]);

  useLayoutEffect(() => {
    rigRef.current?.play(intent);
  }, [intent]);

  return null;
}