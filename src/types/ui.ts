import { PixiBoot } from '../engine/pixi/pixiApp';

export interface UIHelper {
  pixi: {
    boot: PixiBoot | null;
  }
  sidebar: {
    showHero: boolean
  }
}