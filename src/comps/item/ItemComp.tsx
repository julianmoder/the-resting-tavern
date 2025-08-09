import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Item, ItemDragState, Vector2D } from '../../types/base';
import { ItemType } from '../../types/base';
import ItemCard from '../../comps/item/ItemCard';
import { useHero } from '../../hooks/useHero';
import { useKeyPressed } from '../../hooks/useKeyPressed';

type ItemProps = {
  item: Item;
  dragState?: ItemDragState | null;
  cellSize: number;
  handlePointerDown?: (e: React.PointerEvent, item: Item) => void;
  offset?: Vector2D;
  slotOffsets?: {
    weapon: Vector2D;
    armor: Vector2D;
  },
  slotSizes?: {
    weapon: Vector2D;
    armor: Vector2D;
  },
};

export default function ItemComp({ item, dragState, cellSize, handlePointerDown, offset, slotOffsets, slotSizes }: ItemProps) {
  const isDragged = dragState && dragState.draggedItem?.id === item.id && dragState.state !== 'up';
  const w = item.size.width * cellSize;
  const h = item.size.height * cellSize;
  const [showCard, setShowCard] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hero = useHero();
  const { Shift } = useKeyPressed(['Shift']);
  const equippedForType =
    item.type === ItemType.Weapon
      ? hero.equipment?.weapon?.id !== item.id
        ? hero.equipment?.weapon ?? null
        : null
      : hero.equipment?.armor?.id !== item.id
        ? hero.equipment?.armor ?? null
        : null;

  let x = 0;
  let y = 0;
  let posRelative = false;
  if (isDragged) {
    x = dragState.pixel.x;
    y = dragState.pixel.y;
  } else if (item.slot === 'weapon' && slotOffsets && slotSizes) {
    x = slotOffsets.weapon.x + ((slotSizes.weapon.x - w) / 2);
    y = slotOffsets.weapon.y + ((slotSizes.weapon.y - h) / 2);
  } else if (item.slot === 'armor' && slotOffsets && slotSizes) {
    x = slotOffsets.armor.x + ((slotSizes.armor.x - w) / 2);;
    y = slotOffsets.armor.y + ((slotSizes.armor.y - h) / 2);;
  } else if (offset) {
    x = offset.x + (item.position.x * cellSize);
    y = offset.y + (item.position.y * cellSize);
  } else {
    posRelative = true;
  }
  
  const rarityClasses =
    item?.rarity === 'legendary'
      ? 'border border-3 border-yellow-500 bg-yellow-900'
      : item?.rarity === 'mythic'
      ? 'border border-3 border-rose-500 bg-rose-900'
      : item?.rarity === 'epic'
      ? 'border border-3 border-purple-500 bg-purple-900'
      : item?.rarity === 'rare'
      ? 'border border-3 border-blue-500 bg-blue-900'
      : item?.rarity === 'uncommon'
      ? 'border border-3 border-green-500 bg-green-900'
      : 'border border-3 border-stone-400 bg-stone-800';

  function onEnter() {
    if (item) setShowCard(true);
  }
  function onLeave() {
    setShowCard(false);
  }
  function onMove(e: MouseEvent<HTMLDivElement>) {
    setMousePos({ x: e.clientX, y: e.clientY });
  }
  function onTap() {
    if (item) setShowCard((v) => !v);
  }

  return (
    <div key={item.id}
      onPointerDown={handlePointerDown ? (e) => handlePointerDown(e, item) : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={onTap}
      onTouchStart={onTap}
      className={`rounded-lg text-white text-xs flex items-center justify-center cursor-grab select-none ${rarityClasses} ${posRelative ? 'relative' :' absolute'}`}
      style={ { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` } }
    >
      {item.name}

      {item ? (
        <ItemCard
          item={item}
          visible={showCard}
          x={mousePos.x}
          y={mousePos.y}
          placement="right"
          onRequestClose={() => setShowCard(false)}
        />
      ) : null}

      {equippedForType ? (
        <ItemCard
          item={equippedForType}
          visible={showCard && Shift}
          x={mousePos.x}
          y={mousePos.y}
          placement="left"
          onRequestClose={() => setShowCard(false)}
        />
      ) : null}

    </div>
  );
}