import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Item, Inventory, Vector2D } from '../types/base';
import { ItemType } from '../types/base';
import { fitsAt, findInvPos, addInvMatrixItem, removeInvMatrixItem } from '../utils/inventory';

export interface InventorySlice {
  createInventory: (cols: number, rows: number) => string;
  removeInventory: (id: string) => void;
  resetInvMatrix: (id: string) => void;
  addInvItem: (id: string, addItem: Item, targetX?: number, targetY?: number, equipSlot?: ItemType) => Vector2D;
  removeInvItem: (id: string, removeItem: Item) => void;
}

export const createInventorySlice: StateCreator<InventorySlice, [], [], InventorySlice> = (set, get) => ({
  createInventory: (cols = 12, rows = 6) => {
    const id = uuidv4();
    let newMatrix = new Array();
    for (var y = 0; y < rows; y++) {
      const newRow = new Array();
      newMatrix.push(newRow)
      for (var x = 0; x < cols; x++) {
        const newSlot = {id: null};
        newRow.push(newSlot);
      }
    }
    const inv: Inventory = { id, cols, rows, items: [], matrix: newMatrix };
    set((state) => ({ 
      inventories: { 
        ...state.inventories, 
        [id]: inv 
      } 
    }));
    return id;
  },
  removeInventory: (id: string) => {
    const { inventories } = get();
    const copy = { ...inventories };
    delete copy[id];
    set({ inventories: copy });
  },
  resetInvMatrix: (id: string) => {
    const state = get();
    const inv = state.inventories[id];
    if (!inv) return;
    const cols = inv.cols;
    const rows = inv.rows;
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
      inventories: { 
        ...state.inventories, 
        [inv.id]: {
          ...state.inventories[inv.id],
          matrix: resetMatrix,
        } 
      } 
    }))
  },
  addInvItem: (id: string, addItem: Item, targetX?: number, targetY?: number, equipSlot?: ItemType):Vector2D => {
    const state = get();
    const inv = state.inventories[id];
    if (!inv) return;
    const isRepositioning = inv.items.some(i => i.id === addItem.id);
    let updatedMatrix = new Array();
    if(isRepositioning) { updatedMatrix = removeInvMatrixItem(addItem, inv) };
    let foundPos: { x: number; y: number } | null = null;
    equipSlot === ItemType.Weapon ? foundPos = { x: -1, y: -1 } : '';
    equipSlot === ItemType.Armor ? foundPos = { x: -2, y: -2 } : '';
    if (!foundPos && typeof targetX === 'number' && typeof targetY === 'number') {
      targetX < 0 ? targetX = 0 : targetX;
      targetY < 0 ? targetY = 0 : targetY;
      targetX >= inv.cols ? targetX = inv.cols : targetX;
      targetY >= inv.rows ? targetY = inv.rows : targetY;
      fitsAt(addItem, inv, targetX, targetY) ? foundPos = {x: targetX, y: targetY} : false;
    } 
    if (!foundPos) {
      foundPos = findInvPos(addItem, inv);
    }
    if (!foundPos) return false;
    const itemIndex = inv.items.findIndex(i => i.id === addItem.id);
    const newItem: Item = {
      ...addItem,
      position: {
        x: foundPos.x,
        y: foundPos.y,
      },
      slot: equipSlot ? equipSlot : null,
    };
    !equipSlot ? updatedMatrix = addInvMatrixItem(newItem, inv) : '';
    set((state) => ({
      inventories: { 
        ...state.inventories, 
        [inv.id]: {
          ...state.inventories[inv.id],
          items: isRepositioning ? inv.items.map(i => i.id === addItem.id ? newItem : i) : [...inv.items, newItem],
          matrix: updatedMatrix,
        } 
      } 
    }))
    return foundPos;
  },
  removeInvItem: (id: string, removeItem: Item) => {
    const state = get();
    const inv = state.inventories[id];
    if (!inv) return;
    const updatedMatrix = removeInvMatrixItem(newItem, inv)
    set((state) => ({
      inventories: { 
        ...state.inventories, 
        [inv.id]: {
          ...state.inventories[inv.id],
          items: inv.items.filter(item => item.id !== removeItem.id),
          matrix: updatedMatrix,
        } 
      } 
    }))
  },
})