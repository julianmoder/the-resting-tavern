import type { StateCreator } from 'zustand';
import type { Hero, Quest, Item } from '../types/base';
import { prefixQuestName } from '../utils/questPrefixes';
import { randomItemWeighted } from '../utils/itemGeneration';
import { BASE_XP } from '../utils/levelProgression';

export interface QuestSlice {
  quest: Quest;
  setQuest: (n: string, d: number, h: Hero) => void;
  setXpEarned: () => void;
  setLootGained: () => void;
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
    xpEarned: false,
    lootGained: false,
  },
  setQuest: (newName: string, newDuration: number, hero: Hero) => {
    const prefixedName = prefixQuestName(newName);
    const newBreakTime = Math.floor(newDuration / 5);
    const newLevel = Math.floor(Math.random() + 0.5) + hero.level;
    const xp = BASE_XP * newLevel;
    const coins = Math.floor(Math.random() * 50) + 10 * newLevel;

    let itemChoiceCount = 2;

    if (newLevel > 99) {
      itemChoiceCount = 6;
    } else if (newLevel > 44) {
      itemChoiceCount = 5;
    } else if (newLevel > 14) {
      itemChoiceCount = 4;
    } else if (newLevel > 4) {
      itemChoiceCount = 3;
    }

    const itemChoices: Item[] = [];
    for (let i = 0; i < itemChoiceCount; i++) {
      itemChoices.push(randomItemWeighted(hero.level));
    }

    const newLoot = {xp, coins, itemChoices};

    const quest = {
      name: prefixedName, 
      duration: newDuration,
      breakTime: newBreakTime, 
      level: newLevel,
      loot: newLoot,
      xpEarned: false,
      lootGained: false,
    }
    
    set({ quest });
  },
  setXpEarned: () => {
    set((state) => ({
      quest: { ...state.quest, xpEarned: true },
    }))
  },
  setLootGained: () => {
    set((state) => ({
      quest: { ...state.quest, lootGained: true },
    }))
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
      xpEarned: false,
      lootGained: false,
    }
    set({ quest });
  },
});