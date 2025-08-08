import type { StateCreator } from 'zustand';
import type { Item, Inventory, Vector2D } from '../types/base';
import { ItemType } from '../types/base';

export interface InventorySlice {
  resetInvMatrix: () => void;
  addInvCoins: (addCoins: number) => void;
  removeInvCoins: (removeCoins: number) => void;
  addInvItem: (addItem: Item, targetX?: number, targetY?: number, equipSlot?: ItemType) => Vector2D;
  removeInvItem: (removeItem: Item) => void;
  equipInvItem: (item: Item, slot: ItemType) => void;
  unequipInvItem: (slot: ItemType) => void;
}

function fitsAt(addItem: Item, inv: Inventory, x: number, y: number) {
  if (x + addItem.size.width > inv.cols || y + addItem.size.height > inv.rows) return false;
  let currentPos = true;
  for (var cy = y; cy < y + addItem.size.height ; cy++) {
    for (var cx = x; cx < x + addItem.size.width ; cx++) {
      if (cy < 0 || cy >= inv.rows || cx < 0 || cx >= inv.cols || !inv.matrix[cy] || !inv.matrix[cy][cx]) return false;
      if(inv.matrix[cy][cx].id) { currentPos = false };
    }
  }
  return currentPos;
};

function findInvPos(addItem: Item, inv: Inventory, targetX: number = 0, targetY: number = 0) {
  let foundPos: { x: number; y: number } | null = null;
  for (let y = targetY; y <= inv.rows - addItem.size.height && !foundPos; y++) {
    for (let x = targetX; x <= inv.cols - addItem.size.width; x++) {
      if (fitsAt(addItem, inv, x, y)) {
        foundPos = { x, y };
        break;
      }
    }
  }
  return foundPos;
}

function addInvMatrixItem(addItem: Item, inv: Inventory) {
  if(addItem.position.x + addItem.size.width > inv.cols || addItem.position.y + addItem.size.height > inv.rows) return inv.matrix;
  for (var cy = addItem.position.y; cy < addItem.position.y + addItem.size.height; cy++) {
    for (var cx = addItem.position.x; cx < addItem.position.x + addItem.size.width; cx++) {
      inv.matrix[cy][cx].id = addItem.id;
    }
  }
  return inv.matrix;
}

function removeInvMatrixItem(removeItem: Item, inv: Inventory) {
  for (var cy = 0; cy < inv.rows; cy++) {
    for (var cx = 0; cx < inv.cols; cx++) {
      if(inv.matrix[cy][cx].id === removeItem.id) {
        inv.matrix[cy][cx].id = null
      }
    }
  }
  return inv.matrix;
}

export const createInventorySlice: StateCreator<InventorySlice, [], [], InventorySlice> = (set, get) => ({
  resetInvMatrix: () => {
    const rows = 6;
    const cols = 12;
    let resetMatrix = new Array();

    for (var y = 0; y < rows; y++) {
      const newRow = new Array();
      resetMatrix.push(newRow)
      for (var x = 0; x < cols; x++) {
        const newSlot = {id: null};
        newRow.push(newSlot);
      }
    }

    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          rows: rows,
          cols: cols,
          matrix: resetMatrix,
        }
      }
    }))
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
  addInvItem: (addItem: Item, targetX?: number, targetY?: number, equipSlot?: ItemType):Vector2D => {
    const state = get();
    const isRepositioning = state.hero.inventory.items.some(i => i.id === addItem.id);
    let updatedMatrix = new Array();
    if(isRepositioning) { updatedMatrix = removeInvMatrixItem(addItem, state.hero.inventory) };
    let foundPos: { x: number; y: number } | null = null;
    equipSlot === ItemType.Weapon ? foundPos = { x: -1, y: -1 } : '';
    equipSlot === ItemType.Armor ? foundPos = { x: -2, y: -2 } : '';
    if (!foundPos && typeof targetX === 'number' && typeof targetY === 'number') {
      targetX < 0 ? targetX = 0 : targetX;
      targetY < 0 ? targetY = 0 : targetY;
      targetX >= state.hero.inventory.cols ? targetX = state.hero.inventory.cols : targetX;
      targetY >= state.hero.inventory.rows ? targetY = state.hero.inventory.rows : targetY;
      fitsAt(addItem, state.hero.inventory, targetX, targetY) ? foundPos = {x: targetX, y: targetY} : false;
    } 
    if (!foundPos) {
      foundPos = findInvPos(addItem, state.hero.inventory);
    }
    if (!foundPos) return false;
    const itemIndex = state.hero.inventory.items.findIndex(i => i.id === addItem.id);
    const newItem: Item = {
      ...addItem,
      position: {
        x: foundPos.x,
        y: foundPos.y,
      },
      slot: equipSlot ? equipSlot : null,
    };
    !equipSlot ? updatedMatrix = addInvMatrixItem(newItem, state.hero.inventory) : '';
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: isRepositioning ? state.hero.inventory.items.map(i => i.id === addItem.id ? newItem : i) : [...state.hero.inventory.items, newItem],
          matrix: updatedMatrix,
        }
      }
    }))
    return foundPos;
  },
  removeInvItem: (removeItem: Item) => {
    const state = get();
    const updatedMatrix = removeInvMatrixItem(newItem, state.hero.inventory)
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          items: state.hero.inventory.items.filter(item => item.id !== removeItem.id),
          matrix: updatedMatrix,
        }
      }
    }))
  },
  equipInvItem: (item: Item, slot: ItemType) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          equipment: {
            ...state.hero.inventory.equipment,
            [slot]: item,
          },
        }
      }
    }));
  },
  unequipInvItem: (slot: ItemType) => {
    set((state) => ({
      hero: {
        ...state.hero,
        inventory: {
          ...state.hero.inventory,
          equipment: {
            ...state.hero.inventory.equipment,
            [slot]: null,
          },
        }
      }
    }));
  }
})