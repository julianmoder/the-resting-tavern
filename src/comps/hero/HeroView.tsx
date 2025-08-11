import { useLayoutEffect, useRef } from 'react';
import type { Vector2D } from '../../types/base';
import { CharacterRig } from '../../engine/pixi/characterRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';

type Props = {
  boot: PixiBoot;
  pos: Vector2D;
  intent?: 'idle' | 'attack' | 'block' | 'hurt';
};

export default function CharacterView({ boot, pos, intent = 'idle' }: Props) {
  const rigRef = useRef<CharacterRig | null>(null);

  useLayoutEffect(() => {
    const stage = boot.stage;
    if (!stage) return;

    const rig = new CharacterRig();
    rig.mount(stage);
    rig.setPosition(pos.x, pos.y);
    rig.play(intent);
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