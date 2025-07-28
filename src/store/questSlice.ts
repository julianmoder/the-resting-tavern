import type { StateCreator } from 'zustand'
import type { Hero, Quest } from '../types/types';
import { questPrefixes } from '../utils/questPrefixes';
import { largeItemWeapons } from '../utils/largeItemWeapons';
import { largeItemArmors } from '../utils/largeItemArmors';
import { BASE_XP } from '../utils/levelProgression';

export interface QuestSlice {
  quest: Quest;
  setQuest: (n: string, d: number, h: Hero) => void;
  resetQuest: () => void;
}

export const createQuestSlice: StateCreator<QuestSlice, [], [], QuestSlice> = (set) => ({
  quest: {
    name: 'Unnamed Quest',
    duration: 5,
    breakTime: 1,
    level: 1,
    loot: {
      xp: 0,
      coins: 0,
      itemChoices: [],
    },
  },
  setQuest: (newName: string, newDuration: number, hero: Hero) => {
    const randomPrefix = questPrefixes[Math.floor(Math.random() * questPrefixes.length)];
    const prefixedName = newName.trim() ? `${randomPrefix} ${newName.trim()}` : '';

    const newBreakTime = Math.floor(newDuration / 5);

    const newLevel = Math.floor(Math.random() + 0.5) + hero.level;

    function randomChoice<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const xp = BASE_XP * newLevel;
    const coins = Math.floor(Math.random() * 50) + 10 * newLevel;
    const itemPool = [...largeItemWeapons, ...largeItemArmors];
    const itemChoices = [randomChoice(itemPool), randomChoice(itemPool), randomChoice(itemPool), randomChoice(itemPool), randomChoice(itemPool)];
    const newLoot = {xp, coins, itemChoices};

    const quest = {
      name: prefixedName, 
      duration: newDuration,
      breakTime: newBreakTime, 
      level: newLevel,
      loot: newLoot
    }
    
    set({ quest });
  },
  resetQuest: () => {
    const quest = {
      name: 'Unnamed Quest', 
      duration: 5,
      breakTime: 1,
      level: 1,
      loot: {
        xp: 0,
        coins: 0,
        itemChoices: [],
      },
    }
    set({ quest });
  },
});