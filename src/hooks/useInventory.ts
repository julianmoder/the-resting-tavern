import { useAppStore } from '../store/useAppStore';
import type { Item } from '../types/base';
import { ItemType } from '../types/base';


export function useInventory(id?: string | null) {
  const inv = useAppStore(s => id ? s.inventories[id] : undefined);
  const createInventory = useAppStore(s => s.createInventory);
  const resetInvMatrix = useAppStore(s => s.resetInvMatrix);
  const addInvItem = useAppStore(s => s.addInvItem);
  const removeInvItem = useAppStore(s => s.removeInvItem);
  
  return {
    ...inv,
    create: createInventory,
    resetMatrix: () => (id ? resetInvMatrix(id) : false),
    addItem: (addItem: Item, targetX?: number, targetY?: number, equipSlot?: ItemType) => (id ? addInvItem(id, addItem, targetX, targetY, equipSlot) : false),
    removeItem: (removeItem: Item) => (id ? removeInvItem(id, removeItem) : false),
  }
}