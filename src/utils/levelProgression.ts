export const BASE_XP = 10;

const NUM_LEVELS = 99;

export const levelThresholds: number[] = (() => {
  const arr: number[] = [0];

  for (let lvl = 1; lvl <= NUM_LEVELS; lvl++) {
    let xp: number;
    if (lvl <= 25) {
      xp = Math.floor((lvl ** 2) * 10);
    } else if (lvl <= 75) {
      xp = Math.floor((lvl ** 2) * 20);
    } else {
      xp = Math.floor((lvl ** 2) * 20 + Math.exp((lvl - 75) / 5) * 500);
    }
    arr.push(xp);
  }
  return arr;
})();

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