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
  const position = item?.position ?? { x:0, y:0 };
  const size = item?.size ?? { width:1, height:1 };
  const x = dragState && dragState.draggedItem?.id === item?.id ? dragState.pixelX : position.x * cellSize;
  const y = dragState && dragState.draggedItem?.id === item?.id ? dragState.pixelY : position.y * cellSize;
  const w = size.width * cellSize;
  const h = size.height * cellSize;

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
      {item ? (
        <ItemComp
          item={item}
          dragState={dragState}
          cellSize={cellSize}
          inSlot={true}
          handlePointerDown={onDragStart ? (e, item) => onDragStart(e, item, slotType) : undefined }
        />
      ) : (
        <span className="text-xs text-gray-500 select-none">
          {slotType === 'weapon' ? 'Weapon' : 'Armor'}
        </span>
      )}
    </div>
  );
}