import { useLayoutEffect, useRef } from 'react';
import { CharacterRig } from '../../engine/pixi/characterRig';
import { PixiBoot } from '../../engine/pixi/pixiApp';

type Props = {
  boot: PixiBoot;
  x: number;
  y: number;
  intent?: 'idle' | 'attack' | 'block' | 'hurt';
};

export default function CharacterView({ boot, x, y, intent = 'idle' }: Props) {
  const rigRef = useRef<CharacterRig | null>(null);

  useLayoutEffect(() => {
    const stage = boot.stage;
    if (!stage) return;

    const rig = new CharacterRig();
    rig.mount(stage);
    rig.setPosition(x, y);
    rig.play(intent);
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