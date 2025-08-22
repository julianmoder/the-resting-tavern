export const HERO_GROUPED_SLOT_MAP = {
  armor_chest: ['armor_chest'],
  armor_back:  ['armor_back'],
  armor_head:  ['armor_head'],
  armor_arms:  ['armor_arm_l',  'armor_arm_r'],
  armor_legs: ['armor_leg_l',  'armor_leg_r'],
  armor_boots: ['armor_foot_l', 'armor_foot_r'],
} as const;

export type HeroGroupedSlot = keyof typeof HERO_GROUPED_SLOT_MAP;

export function resolveHeroSlots(slot: string): string[] {
  const entry = (HERO_GROUPED_SLOT_MAP as Record<string, readonly string[]>)[slot];
  return entry ? [...entry] : [slot]; // Fallback: unbekannt → 1:1
}