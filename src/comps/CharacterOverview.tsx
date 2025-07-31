import { RefObject, useRef, useState, useEffect, useCallback } from 'react';
import { useHero } from '../hooks/useHero';
import ItemComp from '../comps/ItemComp';
import type { Item } from '../types/types';
import CharacterEquipmentSlot from '../comps/CharacterEquipmentSlot';


type Props = {
  weaponRef: RefObject<HTMLDivElement>;
  armourRef: RefObject<HTMLDivElement>;
};

export default function CharacterOverview({ weaponRef, armourRef }: Props) {
  const hero = useHero();
  const effectiveStats = hero.getEffectiveStats()

  const cols = 12;
  const rows = 6;

  const weapon = hero.equipment?.weapon;
  const armour = hero.equipment?.armour;

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const widthPx = containerRef.current.clientWidth;
        setCellSize(widthPx / cols);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [dragState, setDragState] = useState<{
    draggedItem: Item;
    offsetX: number;
    offsetY: number;
    originalX: number;
    originalY: number;
    pixelX: number;
    pixelY: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const canPlace = useCallback(
    (item: Item, x: number, y: number, widthCells: number, heightCells: number) => {
      if (x < 0 || y < 0 || x + widthCells > cols || y + heightCells > rows) return false;

      return !hero.inventory.items.some((someItem) => {
        if (someItem.id === item.id) return false;
        const ix = someItem.position.x ?? 0;
        const iy = someItem.position.y ?? 0;
        const iw = someItem.size.width ?? 1;
        const ih = someItem.size.height ?? 1;
        return (
          x < ix + iw &&
          x + widthCells > ix &&
          y < iy + ih &&
          y + heightCells > iy
        );
      });
    },
    [hero.inventory.items, cols, rows],
  );

  const handlePointerDown = (e: React.PointerEvent, item: Item) => {
    if (!item.id) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const pixelX = (item.position.x ?? 0) * cellSize;
    const pixelY = (item.position.y ?? 0) * cellSize;
    setDragState({
      draggedItem: item,
      offsetX: pointerX - pixelX,
      offsetY: pointerY - pixelY,
      originalX: item.position.x ?? 0,
      originalY: item.position.y ?? 0,
      pixelX,
      pixelY,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const px = pointerX - dragState.offsetX;
    const py = pointerY - dragState.offsetY;
    setDragState({ ...dragState, pixelX: px, pixelY: py });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState) return;
    const { draggedItem, pixelX, pixelY, originalX, originalY } = dragState;
    const handled = handleDropItem(draggedItem, e.clientX, e.clientY);
    if (!handled) {
      const gridX = Math.round(pixelX / cellSize);
      const gridY = Math.round(pixelY / cellSize);
      if (draggedItem) {
        const w = draggedItem.size.width ?? 1;
        const h = draggedItem.size.height ?? 1;
        if (canPlace(draggedItem, gridX, gridY, w, h)) {
          hero.inventory.setPosition(draggedItem, gridX, gridY);
        } else {
          hero.inventory.setPosition(draggedItem, originalX, originalY);
        }
      }
    }
    setDragState(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDropItem = (item: Item, clientX: number, clientY: number): boolean => {
    const slots = [
      { ref: weaponRef, slot: 'weapon' as const },
      { ref: armourRef, slot: 'armour' as const },
    ];
    for (const { ref, slot } of slots) {
      const el = ref.current;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        hero.equipment.equipItem(item, slot);
        return true;
      }
    }
    return false;
  };

  return (

    <div className="absolute justify-center z-20 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="bg-gray-700 text-sm rounded-md p-4 shadow-md w-full mx-auto">
        <h2 className="text-xl font-bold text-orange-500 text-center">{hero.name}</h2>
        <h4 className="font-bold text-white mb-4 text-center">{hero.class.charAt(0).toUpperCase() + hero.class.slice(1)} Level {hero.level}</h4>
        <div className="space-y-1">
          <div>Health: {effectiveStats.maxHealth}</div>
          <div>Energy: {effectiveStats.maxEnergy}</div>
          <div>Strength: {effectiveStats.str}</div>
          <div>Intelligence: {effectiveStats.int}</div>
          <div>Dexterity: {effectiveStats.dex}</div>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <CharacterEquipmentSlot
          item={hero.equipment.weapon}
          slotType="weapon"
          cellSize={cellSize}
          onDragStart={handlePointerDown}
          dragState={dragState}
        />
        <CharacterEquipmentSlot
          item={hero.equipment.armor}
          slotType="armor"
          cellSize={cellSize}
          onDragStart={handlePointerDown}
          dragState={dragState}
        />
      </div>
      <div
        ref={containerRef}
        className="relative mt-6 w-full"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-700"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          ))}
        </div>
        {hero.inventory.items.map((item) => (
          <Item
            key={item.id}
            item={item}
            dragState={dragState}
            cellSize={cellSize}
            handlePointerDown={handlePointerDown}
          />
        ))}
      </div>
    </div>
  );
}