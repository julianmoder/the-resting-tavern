import type { Item } from './base';

export interface Inventory {
  id: string,
  cols: number,
  rows: number,
  items: Item[],
  matrix: Array<Array<{ x: number; y: number; id: string | null }>>
}

export interface Vector2D {
  x: number,
  y: number,
}