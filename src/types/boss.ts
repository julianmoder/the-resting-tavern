export interface Boss extends BossTemplate {
  id: string,
  stats: BossStats,
  level: number,
}

export interface BossTemplate {
  name: string,
  mechanics: BossMecanic[],
}

export interface BossStats {
  health: number,
  maxHealth: number,
  energy: number,
  maxEnergy: number,
}

export interface BossMechanic {
  name: string,
}
