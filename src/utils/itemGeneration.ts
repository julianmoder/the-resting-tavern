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

export function randomItem(templateArray: ItemTemplate[] = defaultItemTemplates): Item {
  const template = templateArray[Math.floor(Math.random() * templateArray.length)];
  const item = generateItem(template);
  
  return item;
}

