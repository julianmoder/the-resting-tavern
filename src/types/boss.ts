import type { Vector2D } from './base';

export interface Boss extends BossTemplate {
  id: string,
  stats: BossStats,
  level: number,
  postition: Vector2D,
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
  attack: number,
  attackSpeed: number, // attacks per second range: 0.2 to 1.0
  defense: number,
}

export interface BossMechanic {
  name: string,
  chance: number, // range: 0.0 to 1.0
  windup: number, // ms
  duration: number, // ms
}
