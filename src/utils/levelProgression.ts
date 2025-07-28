export const BASE_XP = 10;

export const levelThresholds = [0, 10, 40, 80, 550, 800, 1100, 1450, 1850, 2300];

export function getNextLevelThreshold(level: number) {
  return levelThresholds[level] ?? levelThresholds[level];
}

export function tryLevelUp(xp: number, level: number) {
  const xpNeeded = getNextLevelThreshold(level);
  let leveledUp = false;

  if (xp >= xpNeeded) {
    level += 1;
    leveledUp = true;
  }

  return { xp, level, leveledUp };
}