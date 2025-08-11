export interface Battle {
  isPaused: boolean,
  lastHitAt: number,
  outcome: BattleOutcome,
}

export enum BattleOutcome {
  None = 'none',
  Victory = 'victory',
  Defeat = 'defeat',
}
