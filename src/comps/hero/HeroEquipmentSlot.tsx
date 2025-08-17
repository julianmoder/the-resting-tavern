import type { Item } from '../../types/base';

type CharacterEquipmentSlotProps = {
  item?: Item | null,
  slotType: 'weapon' | 'armor'; 
  slotRef: React.RefObject<HTMLDivElement | null>;
  cellSize: number,
};

export default function CharacterEquipmentSlot({ item, slotType, slotRef, cellSize }: CharacterEquipmentSlotProps) {
  const rarityClasses =
    item?.rarity === 'legendary'
      ? 'border-yellow-700 bg-yellow-950'
      : item?.rarity === 'mythic'
      ? 'border-rose-700 bg-rose-950'
      : item?.rarity === 'epic'
      ? 'border-purple-700 bg-purple-950'
      : item?.rarity === 'rare'
      ? 'border-blue-700 bg-blue-950'
      : item?.rarity === 'uncommon'
      ? 'border-green-700 bg-green-950'
      : 'border-stone-500 bg-stone-900';

  return (
    <div ref={slotRef} className={`relative flex flex-1 rounded-lg items-center justify-center border border-3 ${rarityClasses}`} style={{ width: `${cellSize * 4.5}px`, height: `${cellSize * 4.5}px` }} >
      <span className="text-xs text-stone-500 select-none">
        {item ? '' : slotType === 'weapon' ? 'Weapon' : 'Armor'}
      </span>
    </div>
  );
}