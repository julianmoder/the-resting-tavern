import { RefObject } from 'react';
import ItemComp from '../comps/ItemComp';

type CharacterEquipmentSlotProps = {
  item: Item | null;
  slotType: 'weapon' | 'armor'; 
  slotRef: React.RefObject<HTMLDivElement>;
  cellSize: number;
  onDropItem?: (item: Item, slot: 'weapon' | 'armor') => void;
  onDragStart?: (e: React.PointerEvent, item: Item) => void;
  dragState?: any;
};

export default function CharacterEquipmentSlot({ item, slotType, slotRef, cellSize, onDropItem, onDragStart, dragState  }: CharacterEquipmentSlotProps) {
  const rarityClasses =
    item?.rarity === 'legendary'
      ? 'border border-3 border-yellow-500 bg-yellow-900'
      : item?.rarity === 'rare'
      ? 'border border-3 border-blue-500 bg-blue-900'
      : item?.rarity === 'uncommon'
      ? 'border border-3 border-green-500 bg-green-900'
      : 'border border-3 border-gray-500 bg-gray-900';

  return (
    <div ref={slotRef} className="relative flex-1 h-32 border-2 border-gray-700 rounded-lg bg-gray-800 flex items-center justify-center">
      <span className="text-xs text-gray-500 select-none">
        {slotType === 'weapon' ? 'Weapon' : 'Armor'}
      </span>
    </div>
  );
}