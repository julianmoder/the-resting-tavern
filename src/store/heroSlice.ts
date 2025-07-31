import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Hero, HeroClass, Item } from '../types/types';
import { ItemType } from '../types/types';
import { tryLevelUp } from '../utils/levelProgression';
import { useModal } from '../hooks/useModal';

export interface HeroSlice {
  hero: Hero;
  setHeroName: (newName: string) => void;
  setHeroClass: (newClass: HeroClass) => void;
  addHeroXp: (addXp: number) => void;
  addInvCoins: (addCoins: number) => void;
  removeInvCoins: (removeCoins: number) => void;
  addInvItem: (addItem: Item) => void;
  removeInvItem: (removeItem: Item) => void;
  setInvItemPosition: (item: Item, x: number, y: number) => void;
  equipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  unequipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  addEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
  removeEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => void;
}

export const createHeroSlice: StateCreator<HeroSlice, [], [], HeroSlice> = (set, get) => ({
  hero: {
    id: uuidv4(),
    name: 'Unnamed Hero',
    class: null,
    xp: 0,
    level: 1,
    leveledUp: false,
    stats: {
      health: 10,
      maxHealth: 10,
      energy: 10,
      maxEnergy: 10,
      str: 5,
      int: 5,
      dex: 5,
    },
    inventory: {
      coins: 0,
      items: [],
    },
    equipment: {
      weapon: null,
      armor: null,
    }
  },
  setHeroName: (newName: string) => {
    set((state) => ({
      hero: {
        ...state.hero,
        name: newName,
      }
    }))
  },
  setHeroClass: (newClass: HeroClass) => {
    set((state) => ({
      hero: {
        ...state.hero,
        class: newClass,
      }
    }))
  },
  addHeroXp: (addXp: number) => {
    const state = get();
    if (!state.hero) return;

    const tryLevelUpResult = tryLevelUp(state.hero.xp + addXp, state.hero.level);

    let newMaxHealth = state.hero.stats.maxHealth;
    let newMaxEnergy = state.hero.stats.maxEnergy;
    let newStr = state.hero.stats.str;
    let newInt = state.hero.stats.int;
    let newDex = state.hero.stats.dex;

    if(tryLevelUpResult.leveledUp) {
      newMaxHealth = newMaxHealth + Math.floor(tryLevelUpResult.level / 2);
      newMaxEnergy = newMaxEnergy + Math.floor(tryLevelUpResult.level / 2);
      newStr = (state.hero.class === 'warrior') 
        ? newStr + Math.floor(tryLevelUpResult.level / 2) 
        : newStr + Math.floor(tryLevelUpResult.level / 3);
      newInt = (state.hero.class === 'wizzard') 
        ? newInt + Math.floor(tryLevelUpResult.level / 2) 
        : newInt + Math.floor(tryLevelUpResult.level / 3);
      newDex = (state.hero.class === 'ranger') 
        ? newDex + Math.floor(tryLevelUpResult.level / 2) 
        : newDex + Math.floor(tryLevelUpResult.level / 3);
    }
    
    set((state) => ({
      hero: {
        ...state.hero,
        xp: tryLevelUpResult.xp,
        level: tryLevelUpResult.level,
        leveledUp: tryLevelUpResult.leveledUp,
        stats: {
          maxHealth: newMaxHealth,
          maxEnergy: newMaxEnergy,
          str: newStr,
          int: newInt,
          dex: newDex,
        },
      }
    }))
    return tryLevelUpResult;
  },
  addInvCoins: (addCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          coins: state.hero.inventory.coins + addCoins,
        }
      }
    }))
  },
  removeInvCoins: (removeCoins: number) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          coins: state.hero.inventory.coins - removeCoins,
        }
      }
    }))
  },
  addInvItem: (addItem: Item) => {
    const state = get();
    const cols = 12;
    const rows = 6;

    const fitsAt = (x: number, y: number) => {
      if (x + addItem.size.width > cols || y + addItem.size.height > rows) return false;

      return !state.hero.inventory.items.some((other) => {
        const ox = other.position.x;
        const oy = other.position.y;
        const ow = other.size.width;
        const oh = other.size.height;
        return (
          x < ox + ow &&
          x + addItem.size.width > ox &&
          y < oy + oh &&
          y + addItem.size.height > oy
        );
      });
    };

    let foundPos: { x: number; y: number } | null = null;
    for (let y = 0; y <= rows - addItem.size.height && !foundPos; y++) {
      for (let x = 0; x <= cols - addItem.size.width; x++) {
        if (fitsAt(x, y)) {
          foundPos = { x, y };
          break;
        }
      }
    }

    if (!foundPos) {
      return false;
    }

    const newItem: Item = {
      ...addItem,
      position: foundPos,
    };

    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: [...state.hero.inventory.items, newItem]
        }
      }
    }))
    return true;
  },
  removeInvItem: (removeItem: Item) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: state.hero.inventory.items.filter(item => item.id !== removeItem.id)
        }
      }
    }))
  },
  setInvItemPosition: (item: Item, x: number, y: number) => {
    const state = get();
    if (!state.hero) return;

    const repositionedItems = state.hero.inventory.items.map((mapItem) => {
      return mapItem.id === item.id ? { ...mapItem, position: { x, y } } : mapItem;
    });

    set((state) => ({
      hero: { 
        ...state.hero, 
        inventory: { 
          ...state.hero.inventory, 
          items: repositionedItems,
        }, 
      } 
    }))
  },
  equipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => {
      const newItems = state.hero.inventory.items.filter((it) => it.id !== item.id);
      let oldItem: Item | null = null;
      if (slot === ItemType.Weapon && state.hero.equipment.weapon) {
        oldItem = state.hero.equipment.weapon;
      }
      if (slot === ItemType.Armor && state.hero.equipment.armor) {
        oldItem = state.hero.equipment.armor;
      }
      const updatedItems = oldItem ? [...newItems, oldItem] : newItems;
      return {
        hero: {
          ...state.hero,
          inventory: {
            ...state.hero.inventory,
            items: updatedItems,
          },
          equipment: {
            ...state.hero.equipment,
            [slot === ItemType.Weapon ? 'weapon' : 'armor']: item,
          },
        },
      };
    });
  },
  unequipInvItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => {
      const newEquipment = { ...state.hero.equipment };
      newEquipment[slot === ItemType.Weapon ? 'weapon' : 'armor'] = null;
      let foundPos: { x: number; y: number } | null = null;
      const cols = 12, rows = 6;
      const fitsAt = (x: number, y: number, w: number, h: number) => {
        return !state.hero.inventory.items.some((other) => {
          if (other.id === item.id) return false;
          const ox = other.position.x ?? 0;
          const oy = other.position.y ?? 0;
          const ow = other.size.width ?? 1;
          const oh = other.size.height ?? 1;
          return (
            x < ox + ow &&
            x + (item.size.width ?? 1) > ox &&
            y < oy + oh &&
            y + (item.size.height ?? 1) > oy
          );
        });
      };
      for (let y = 0; y <= rows - (item.size.height ?? 1); y++) {
        for (let x = 0; x <= cols - (item.size.width ?? 1); x++) {
          if (fitsAt(x, y, item.size.width ?? 1, item.size.height ?? 1)) {
            foundPos = { x, y };
            break;
          }
        }
        if (foundPos) break;
      }
      if (!foundPos) {
        // Optional: Modaler Fehlerdialog, wenn Inventar voll!
        return state;
      }
      const newItem = { ...item, position: foundPos };
      return {
        hero: {
          ...state.hero,
          equipment: newEquipment,
          inventory: {
            ...state.hero.inventory,
            items: [...state.hero.inventory.items, newItem],
          },
        },
      };
    });
  },
  getHeroEffectiveStats: () => {
    const state = get();
    if (!state.hero) return;

    let { str, int, dex, health, maxHealth, energy, maxEnergy } = state.hero.stats;
    if (state.hero.equipment.weapon) {
      str += state.hero.equipment.weapon.modifier.str ?? 0;
      int += state.hero.equipment.weapon.modifier.int ?? 0;
      dex += state.hero.equipment.weapon.modifier.dex ?? 0;
    }
    if (state.hero.equipment.armor) {
      str += state.hero.equipment.armor.modifier.str ?? 0;
      int += state.hero.equipment.armor.modifier.int ?? 0;
      dex += state.hero.equipment.armor.modifier.dex ?? 0;
    }
    return { str, int, dex, health, maxHealth, energy, maxEnergy };
  },
  addEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          weapon: slot === ItemType.Weapon ? item : state.hero.equipment.weapon,
          armor: slot === ItemType.Armor ? item : state.hero.equipment.armor,
        },
      }
    }))
  },
  removeEquipItem: (item: Item, slot: ItemType.Weapon | ItemType.Armor) => {
    set((state) => ({
      hero: {
        ...state.hero,
        equipment: {
          weapon: slot === ItemType.Weapon ? null : state.hero.equipment.weapon,
          armor: slot === ItemType.Armor ? null : state.hero.equipment.armor,
        },
      }
    }))
  },

});