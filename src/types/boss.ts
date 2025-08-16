import { InteractionName } from './base';
import type { Vector2D } from './base';


export interface Boss extends BossTemplate {
  id: string,
  level: number,
  position: Vector2D,
}

export interface BossTemplate {
  name: string,
  stats: BossStats,
  mechanics: BossMechanicTemplate[],
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

export interface BossMechanicTemplate {
  name: string,
  chance: number | null, // range: 0.0 to 1.0
  windup: number | null, // ms
  interaction?: InteractionName,
  duration: number | null, // ms
  damageBaseBoss?: number | null,
  damageBaseHero?: number | null,
  windupText?: string,
  successText?: string,
  failText?: string,
}

export interface BossMechanic extends BossMechanicTemplate {
  id: string | null,
  phase: BossMechanicPhase,
  deadline: number | null,
  active: boolean,
  overlay?: BossMechanicOverlay,
}

export interface BossMechanicOverlay {
  text?: string,
  flash?: BossMechanicPhase.Success | BossMechanicPhase.Fail | null,
  shake?: boolean,
}

export enum BossMechanicPhase {
  Idle = 'idle',
  Windup = 'windup',
  Interaction = 'Interaction',
  Success = 'success',
  Fail = 'fail',
}