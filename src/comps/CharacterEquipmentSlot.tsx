import type { Item } from '../types/base';

type CharacterEquipmentSlotProps = {
  item?: Item | null,
  slotType: 'weapon' | 'armor'; 
  slotRef: React.RefObject<HTMLDivElement | null>;
};

export default function CharacterEquipmentSlot({ item, slotType, slotRef }: CharacterEquipmentSlotProps) {
  const rarityClasses =
    item?.rarity === 'legendary'
      ? 'border-yellow-700 bg-yellow-950'
      : item?.rarity === 'rare'
      ? 'border-blue-700 bg-blue-950'
      : item?.rarity === 'uncommon'
      ? 'border-green-700 bg-green-950'
      : 'border-stone-500 bg-stone-900';

  return (
    <div ref={slotRef} className={`relative flex flex-1 max-w-42 h-42 rounded-lg items-center justify-center border border-3 ${rarityClasses}`}>
      <span className="text-xs text-stone-500 select-none">
        {slotType === 'weapon' ? 'Weapon' : 'Armor'}
      </span>
    </div>
  );
}