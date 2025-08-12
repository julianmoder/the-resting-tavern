export interface Battle {
  isPaused: boolean,
  lastHitAt: number,
  outcome: BattleOutcome,
  lastHeroHit?: BattleHit,
  lastBossHit?: BattleHit,
}

export enum BattleOutcome {
  None = 'none',
  Victory = 'victory',
  Defeat = 'defeat',
}

export interface BattleHit {
  target: 'hero' | 'boss';
  amount: number;
  at: number; // ms
}
