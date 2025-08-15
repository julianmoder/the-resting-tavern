export type { AppSettings } from './setting';
export type { UIHelper } from './ui';
export { ModalType } from './modal';
export type { Modal } from './modal';
export { HeroClass } from './hero';
export type { Hero, HeroStats, Equipment } from './hero';
export { ItemType, ItemClass, ItemRarity } from './item';
export type { Item, ItemModifier, ItemTemplate, ItemDragState, DropConfig } from './item';
export type { Inventory, Vector2D } from './inventory';
export type { Quest, Loot } from './quest';
export { BossMechanicPhase } from './boss';
export type { Boss, BossTemplate, BossStats, BossMechanic, BossMechanicState, BossMechanicOverlay } from './boss';
export { BattleOutcome } from './battle';
export type { Battle, BattleHit } from './battle';
export { InteractionId } from './interaction';
export type { Interaction, InteractionCtx } from './interaction';
export { AnimIntent } from './animation';

export enum Stage {
  Landing = 'landing',
  Tavern = 'tavern',
  Quest = 'quest',
  Boss = 'boss',
  Loot = 'loot',
  Break = 'break'
}



