import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Item, ItemModifier } from '../../types/base';

type ItemCardProps = {
  item: Item;
  visible: boolean;
  x?: number;
  y?: number;
  anchorRef?: React.RefObject<HTMLElement | null>;
  onRequestClose?: () => void;
  placement?: 'left' | 'right';
};

function formatModifier(mod: ItemModifier) {
  const rows: { label: string; value: number }[] = [
    { label: 'Strength', value: mod.str },
    { label: 'Intelligence', value: mod.int },
    { label: 'Dexterity', value: mod.dex },
  ];

  return (
    <div className="mt-1 space-y-1">
      {rows
        .filter(r => r.value !== 0)
        .map(r => (
          <div key={r.label} className="flex justify-between">
            <dt className="text-stone-400"></dt>
            <dd className="text-stone-100">
              {r.value > 0 ? `+${r.value} ${r.label}` : r.value}
            </dd>
          </div>
        ))}
    </div>
  );
}

export default function ItemCard({ item, visible, x, y, anchorRef, onRequestClose, placement = 'right'}: ItemCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  const rarityClasses =
    item?.rarity === 'legendary'
      ? 'border border-3 border-yellow-500'
      : item?.rarity === 'mythic'
      ? 'border border-3 border-rose-500'
      : item?.rarity === 'epic'
      ? 'border border-3 border-purple-500'
      : item?.rarity === 'rare'
      ? 'border border-3 border-blue-500'
      : item?.rarity === 'uncommon'
      ? 'border border-3 border-green-500'
      : 'border border-3 border-stone-400';

  useLayoutEffect(() => {
    if (!visible) return;

    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ left: rect.right + 8 + window.scrollX, top: rect.top + window.scrollY });
      return;
    }

    if (typeof x === 'number' && typeof y === 'number') {
      const cardWidth = cardRef.current?.offsetWidth ?? 128;
      const gap = 12;
      const left =
        placement === 'left'
          ? x - cardWidth - gap + window.scrollX
          : x + gap + window.scrollX;
      const top = y + gap + window.scrollY;
      setPos({ left, top });
    }
  }, [visible, x, y, anchorRef]);

  useEffect(() => {
    if (!visible) return;
    function onDocDown(e: MouseEvent | TouchEvent) {
      const el = cardRef.current;
      if (!el) return;
      const target = e.target as Node;
      if (!el.contains(target)) onRequestClose?.();
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
    };
  }, [visible, onRequestClose]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={cardRef}
      role="dialog"
      className={`absolute z-50 max-w-40 rounded-xl shadow-xl bg-stone-900 backdrop-blur p-3 select-none ${rarityClasses}`}
      style={{ left: pos.left, top: pos.top }}
    >
      <header className="mb-2">
        <p className="text-sm text-stone-400">{item.rarity}</p>
        <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
      </header>

      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-400">{item.type === "weapon" ? 'Attack' : 'Defence'}</dt>
          <dd className="text-stone-100">{item.power}</dd>
        </div>
        {item.modifier ? (
          <div className="mt-3">
            {formatModifier(item.modifier as ItemModifier)}
          </div>
        ) : null}
      </dl>

      {item.fluff ? (
        <p className="mt-3 text-xs italic text-stone-500">{item.fluff}</p>
      ) : null}
    </div>,
    document.body
  );
}
