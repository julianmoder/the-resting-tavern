import { ItemType } from '../types/base';
import type { Item, ItemTemplate, DropConfig } from '../types/base';
import { v4 as uuidv4 } from 'uuid';
import { itemTemplatesWeapons } from '../utils/itemTemplatesWeapons';
import { itemTemplatesArmors } from '../utils/itemTemplatesArmors';

const defaultItemTemplates = [...itemTemplatesWeapons, ...itemTemplatesArmors];

const defaultConfig: DropConfig = {
  levelWindow: 5,
  hardClamp: true,
  rarityWeights: {
    legendary: 1,
    epic: 1,
    rare: 1,
    uncommon: 1,
    common: 1,
  },
  classWeights: {
    melee: 1,
    ranged: 1,
    spell: 1,
    light: 1,
    medium: 1,
    heavy: 1,
  },
};

function generateItem(template: ItemTemplate): Item {
  const isWeapon = template.type === ItemType.Weapon;
  const aps = isWeapon ? template.attackSpeed : 0;
  const newPower = calcPower(template.level, template.type, template.basePower);
  const newDps = calcDps(newPower, aps);

  const item = {
    ...template,
    id: uuidv4(),
    power: newPower,
    dps: newDps,
    modifier: {
      str: template.affixes?.includes('str') ? calcModifier(template.level) : 0,
      int: template.affixes?.includes('int') ? calcModifier(template.level) : 0,
      dex: template.affixes?.includes('dex') ? calcModifier(template.level) : 0,
    },
    position: {
      x: 0,
      y: 0,
    },
    slot: null,
  };

  return item;
}

function calcDps(power: number, aps: number | undefined) {
  if(!aps) return; 
  return Math.round(power * aps);
}

function calcPower(level: number, type: ItemType, basePower: number): number {
  // Sigmoid-Kurve
  const min = 0, max = 100;
  const curve = (max - min) * Math.tanh(level / 50) + min;
  const value = curve * (0.9 + Math.random() * 0.2);

  const power = (type === 'armor') ? basePower + (value / 2) : basePower + value;

  return Math.round(power);
}

function calcModifier(level: number): number {
  const value = Math.floor(level * (1 + Math.random()));

  return Math.round(value);
}

function rarityWeight(rarity: string, cfg: DropConfig) {
  return cfg.rarityWeights?.[rarity] ?? 1;
}

function classWeight(cls: string, cfg: DropConfig) {
  return cfg.classWeights?.[cls] ?? 1;
}

function softLevelPenalty(tplLevel: number, heroLevel: number, cfg: DropConfig) {
  if (cfg.hardClamp) return 1; 
  const w = cfg.levelWindow ?? defaultConfig.levelWindow!;
  const distance = Math.max(0, Math.abs(tplLevel - heroLevel) - w);
  return 1 / (1 + 0.15 * distance);
}

function eligibleByLevel(tpl: ItemTemplate, heroLevel: number, cfg: DropConfig): boolean {
  const w = cfg.levelWindow ?? defaultConfig.levelWindow!;
  if (cfg.hardClamp) {
    return Math.abs(tpl.level - heroLevel) <= w;
  }
  return true;
}

export function randomItemWeighted(heroLevel: number, templateArray: ItemTemplate[] = defaultItemTemplates, cfg: DropConfig = defaultConfig): Item {
  const pool = templateArray.filter(tpl => eligibleByLevel(tpl, heroLevel, cfg));
  const effectivePool = pool.length > 0 ? pool : templateArray;

  const weights = effectivePool.map((tpl) => {
    const base = tpl.dropChance ?? 0;
    const wR = rarityWeight(String(tpl.rarity), cfg);
    const wC = classWeight(String(tpl.class), cfg);
    const wL = softLevelPenalty(tpl.level, heroLevel, cfg);
    return Math.max(0, base * wR * wC * wL);
  });

  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) {
    return generateItem(effectivePool[effectivePool.length - 1]);
  }

  let threshold = Math.random() * total;
  for (let i = 0; i < effectivePool.length; i++) {
    threshold -= weights[i];
    if (threshold <= 0) {
      return generateItem(effectivePool[i]);
    }
  }

  return generateItem(templateArray[templateArray.length - 1]);
}

