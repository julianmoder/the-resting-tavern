import { RefObject, useRef, useState, useEffect, useCallback } from 'react';
import { useHero } from '../hooks/useHero';
import ItemComp from '../comps/ItemComp';
import type { Item, ItemDragState } from '../types/types';
import { ItemType } from '../types/types';
import CharacterEquipmentSlot from '../comps/CharacterEquipmentSlot';

export default function CharacterOverview() {
  const hero = useHero();
  const effectiveStats = hero.getEffectiveStats()
  const invCols = hero.inventory.cols;
  const invRows = hero.inventory.rows;
  const weapon = hero.inventory.equipment?.weapon;
  const armor = hero.inventory.equipment?.armor;

  const containerRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const armorRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const [invOffset, setInvOffset] = useState({ x: 0, y: 0 });
  const [weaponOffset, setWeaponOffset] = useState({ x: 0, y: 0 });
  const [armorOffset, setArmorOffset] = useState({ x: 0, y: 0 });
  const [weaponSize, setWeaponSize] = useState({ x: 0, y: 0 });
  const [armorSize, setArmorSize] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (inventoryRef.current) {
        const widthPx = inventoryRef.current.clientWidth;
        setCellSize(widthPx / invCols);
      }
      if (inventoryRef.current && containerRef.current) {
        const inventoryRect = inventoryRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setInvOffset({
          x: inventoryRect.left - containerRect.left,
          y: inventoryRect.top - containerRect.top,
        });
      }
      if (weaponRef.current && containerRef.current) {
        const weaponRect = weaponRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setWeaponOffset({
          x: weaponRect.left - containerRect.left,
          y: weaponRect.top - containerRect.top,
        });
        setWeaponSize({
          x: weaponRect.width,
          y: weaponRect.height,
        });
      }
      if (armorRef.current && containerRef.current) {
        const armorRect = armorRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setArmorOffset({
          x: armorRect.left - containerRect.left,
          y: armorRect.top - containerRect.top,
        });
        setArmorSize({
          x: armorRect.width,
          y: armorRect.height,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const newDragState = {
    draggedItem: null,
    state: 'up',
    cursorItemOffset: {
      x: 0,
      y: 0,
    },
    position: {
      x: null,
      y: null,
      pixel: {
        x: 0,
        y: 0,
      }
    },
    fromSlot: null,
  };

  const [dragState, setDragState] = useState<ItemDragState | null>(newDragState);

  const canPlace = useCallback(
    (item: Item, x: number, y: number, widthCells: number, heightCells: number) => {
      if (x < 0 || y < 0 || x + widthCells > invCols || y + heightCells > invRows) return false;

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
    [hero.inventory.items, invCols, invRows],
  );

  const handlePointerDown = (e: React.PointerEvent, item: Item, slotType?: 'weapon' | 'armor') => {
    if (dragState.state === 'move' || dragState.state === null) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const targetRect = e.target.getBoundingClientRect();
    const offsetX = -(pointerX - (targetRect.left - rect.left));
    const offsetY = -(pointerY - (targetRect.top - rect.top));
    const pixelX = slotType ? pointerX : null;
    const pixelY = slotType ? pointerY : null;
    const newDragState = {
      draggedItem: item,
      state: 'down',
      cursorItemOffset: {
        x: offsetX,
        y: offsetY,
      },
      position: {
        x: item.position.x,
        y: item.position.y,
        pixel: {
          x: pointerX + offsetX,
          y: pointerY + offsetY,
        }
      },
      fromSlot: slotType || null,
    };

    setDragState(newDragState);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragState.state === 'up') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const px = pointerX + dragState.cursorItemOffset.x;
    const py = pointerY + dragState.cursorItemOffset.y;
    const newDragState = {
      ...dragState,
      state: 'move',
      position: {
        ...dragState.position,
        pixel: {
          x: px,
          y: py,
        }
      },
    };
    setDragState(newDragState);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState.state === 'up') return;
    const handled = handleDropItem(dragState, e.clientX, e.clientY);

    const newDragState = {
      ...dragState,
      state: 'up',
    };
    setDragState(newDragState);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDropItem = (dragState: ItemDragState, clientX: number, clientY: number): boolean => {
    const slots = [
      { ref: inventoryRef, slot: 'inventory' },
      { ref: weaponRef, slot: ItemType.Weapon },
      { ref: armorRef, slot: ItemType.Armor },
    ];
    for (const { ref, slot } of slots) {
      if (!ref) continue;
      if (!ref.current) continue;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      if ( clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom ) {
          if(slot === dragState.draggedItem.type) {
            if(hero.inventory.equipment[slot]) {
              hero.inventory.equipment.unequipItem(slot);
              hero.inventory.addItem(hero.inventory.equipment[slot]); 
            }
            hero.inventory.equipment.equipItem(dragState.draggedItem, slot);
            hero.inventory.addItem(dragState.draggedItem, 0, 0, slot);          
            return true;
          }
          if (slot === 'inventory') {
            // client - rect (cursor relative to inventory) - offset (initial click offset) - cellSize (fix) - 10 (UX fix)
            const pointerX = (clientX - rect.left) + (dragState.cursorItemOffset.x / 2);
            const pointerY = (clientY - rect.top) + (dragState.cursorItemOffset.y / 2);
            const gridX = Math.floor(pointerX / cellSize);
            const gridY = Math.floor(pointerY / cellSize);
            dragState.draggedItem.type ? hero.inventory.equipment.unequipItem(dragState.draggedItem.position.slot) : '';
            console.log(`handleDropItem > dragState.draggedItem.position.slot: ${dragState.draggedItem.position.slot}`);
            hero.inventory.addItem(dragState.draggedItem, gridX, gridY);
            return true;
          }
      }
    }
    return false;
  };

  return (

    <div className="absolute justify-center z-20 bg-gray-800 p-4 rounded-lg shadow-lg" 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div id="character-sheet" className="bg-gray-700 text-sm rounded-md p-4 shadow-md w-full mx-auto">
        <h2 className="text-xl font-bold text-orange-500 text-center">{hero.name}</h2>
        <h4 className="font-bold text-white mb-4 text-center">{hero.class.charAt(0).toUpperCase() + hero.class.slice(1)} Level {hero.level}</h4>
        <div className="space-y-1">
          <div>Health: {effectiveStats.maxHealth}</div>
          <div>Energy: {effectiveStats.maxEnergy}</div>
          <div>Strength: {effectiveStats.str}</div>
          <div>Intelligence: {effectiveStats.int}</div>
          <div>Dexterity: {effectiveStats.dex}</div>
          <div id="character-equipment-slots" className="relative mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <CharacterEquipmentSlot
              slotType="weapon"
              slotRef={weaponRef}
              cellSize={cellSize}
              onDragStart={handlePointerDown}
              dragState={dragState}
            />
            <CharacterEquipmentSlot
              slotType="armor"
              slotRef={armorRef}
              cellSize={cellSize}
              onDragStart={handlePointerDown}
              dragState={dragState}
            />
          </div>
        </div>
      </div>
      <div id="character-inventory-grid" className="mt-6 w-full">
        <div className="relative grid w-full h-full" 
          ref={inventoryRef}
          onDragStart={handlePointerDown}
          style={{ gridTemplateColumns: `repeat(${invCols}, 1fr)`, gridTemplateRows: `repeat(${invRows}, 1fr)`, }} >
          {Array.from({ length: invRows * invCols }).map((_, idx) => (
            <div key={idx} className="border border-gray-700" style={{ width: `${cellSize}px`, height: `${cellSize}px`, }} />
          ))}
        </div>
      </div>
      {hero.inventory.items.map((item) => (
        <ItemComp key={item.id} item={item} dragState={dragState} cellSize={cellSize} handlePointerDown={handlePointerDown} offset={invOffset} slotOffsets={{ weapon: weaponOffset, armor: armorOffset }} slotSizes={{ weapon: weaponSize, armor: armorSize }} />
      ))}
    </div>
  );
}