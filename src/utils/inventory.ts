import type { Item, Inventory } from '../types/base';

export function fitsAt(addItem: Item, inv: Inventory, x: number, y: number) {
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

export function findInvPos(addItem: Item, inv: Inventory, targetX: number = 0, targetY: number = 0) {
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

export function addInvMatrixItem(addItem: Item, inv: Inventory) {
  if(addItem.position.x + addItem.size.width > inv.cols || addItem.position.y + addItem.size.height > inv.rows) return inv.matrix;
  for (var cy = addItem.position.y; cy < addItem.position.y + addItem.size.height; cy++) {
    for (var cx = addItem.position.x; cx < addItem.position.x + addItem.size.width; cx++) {
      inv.matrix[cy][cx].id = addItem.id;
    }
  }
  return inv.matrix;
}

export function removeInvMatrixItem(removeItem: Item, inv: Inventory) {
  for (var cy = 0; cy < inv.rows; cy++) {
    for (var cx = 0; cx < inv.cols; cx++) {
      if(inv.matrix[cy][cx].id === removeItem.id) {
        inv.matrix[cy][cx].id = null
      }
    }
  }
  return inv.matrix;
}