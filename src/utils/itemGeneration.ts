import type { Item, ItemTemplate } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { itemTemplatesWeapons } from '../utils/itemTemplatesWeapons';
import { itemTemplatesArmors } from '../utils/itemTemplatesArmors';

const defaultItemTemplates = [...itemTemplatesWeapons, ...itemTemplatesArmors];

function generateItem(template: ItemTemplate): Item {
  const item = {
    ...template,
    id: uuidv4(),
    power: calcPower(template.level),
      modifier: {
        str: template.affixes?.includes('str') ? calcModifier(template.level) : 0,
        int: template.affixes?.includes('int') ? calcModifier(template.level) : 0,
        dex: template.affixes?.includes('dex') ? calcModifier(template.level) : 0,
      },
    position: {
      x: 0,
      y: 0,
    }
  };

  return item;
}

function calcPower(level: number): number {
  // Sigmoid-Kurve
  const min = 10, max = 50;
  const curve = (max - min) * Math.tanh(level / 10) + min;
  const value = Math.floor(curve * (0.9 + Math.random() * 0.2));

  return Math.round(value);
}

function calcModifier(level: number): number {
  const value = Math.floor(level * (1 + Math.random()));

  return Math.round(value);
}

export function randomItemWeighted(heroLevel: number, templateArray: ItemTemplate[] = defaultItemTemplates): Item {
  const totalWeight = templateArray.reduce((sum: number, tpl: ItemTemplate) => {
    if((heroLevel * 15) < tpl.dropChance){
      return sum + (tpl.dropChance ?? 0)
    }
    return sum
  }, 0);

  let threshold = Math.random() * totalWeight;
  for (const tpl of templateArray) {
    threshold -= tpl.dropChance ?? 0;
    if (threshold <= 0) {
      return generateItem(tpl);
    }
  }
  return generateItem(templateArray[templateArray.length - 1]);
}

