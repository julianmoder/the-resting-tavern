import type { Item, ItemDragState } from '../types/types';

type ItemProps = {
  item: Item;
  dragState?: ItemDragState;
  cellSize: number;
  handlePointerDown?: (e: React.PointerEvent, item: Item) => void;
  offset: Vector2D;
  slotOffsets?: {
    weapon: Vector2D;
    armor: Vector2D;
  },
  slotSizes?: {
    weapon: Vector2D;
    armor: Vector2D;
  }
};

export default function ItemComp({ item, dragState, cellSize, handlePointerDown, offset, slotOffsets, slotSizes }: ItemProps) {
  const isDragged = dragState && dragState.draggedItem?.id === item.id && dragState.state !== 'up';
  const w = item.size.width * cellSize;
  const h = item.size.height * cellSize;

  let x = 0;
  let y = 0;
  if (isDragged) {
    x = dragState.position.pixel.x;
    y = dragState.position.pixel.y;
  } else if (item.position.slot === 'weapon' && slotOffsets && slotSizes) {
    x = slotOffsets.weapon.x + ((slotSizes.weapon.x - w) / 2);
    y = slotOffsets.weapon.y + ((slotSizes.weapon.y - h) / 2);
  } else if (item.position.slot === 'armor' && slotOffsets && slotSizes) {
    x = slotOffsets.armor.x + ((slotSizes.armor.x - w) / 2);;
    y = slotOffsets.armor.y + ((slotSizes.armor.y - h) / 2);;
  } else {
    x = offset.x + (item.position.x * cellSize);
    y = offset.y + (item.position.y * cellSize);
  }
  const rarityClasses =
    item.rarity === 'legendary'
      ? 'border border-3 border-yellow-500 bg-yellow-900'
      : item.rarity === 'rare'
      ? 'border border-3 border-blue-500 bg-blue-900'
      : item.rarity === 'uncommon'
      ? 'border border-3 border-green-500 bg-green-900'
      : 'border border-3 border-gray-500 bg-gray-900';

  return (
    <div key={item.id}
      onPointerDown={handlePointerDown ? (e) => handlePointerDown(e, item) : undefined}
      className={`absolute rounded-lg text-white text-xs flex items-center justify-center cursor-grab select-none ${rarityClasses}`}
      style={ { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` } }
    >
      {item.name}
    </div>
  );
}