import { useState, useEffect, useRef, useCallback } from 'react';
import { useHero } from '../hooks/useHero';
import type { Item } from '../types/types';

type InventoryProps = {
  onDropItem?: (id: string, clientX: number, clientY: number) => boolean;
};

export default function Inventory({ onDropItem }: InventoryProps) {
  const hero = useHero();

  // Inventory Grid Setup
  const cols = 12;
  const rows = 6;
  // Die Zellengröße wird über ein ref gemessen, damit sie responsiv sein kann
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40); // fallback in px

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
    id: string;
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
      // Überprüfen, ob das Item innerhalb des Rasters bleibt
      if (x < 0 || y < 0 || x + widthCells > cols || y + heightCells > rows) return false;

      // Überlappung mit anderen Items verhindern
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
      id: item.id,
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
    const { id, pixelX, pixelY, originalX, originalY } = dragState;
    const handledOutside = onDropItem?.(id, e.clientX, e.clientY);
    if (!handledOutside) {
      const gridX = Math.round(pixelX / cellSize);
      const gridY = Math.round(pixelY / cellSize);
      const draggedItem = hero.inventory.items.find((it) => it.id === id);
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

  return (
    <div
      ref={containerRef}
      className="relative mt-6 w-full"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Gitterzellen als HTML‑Elemente */}
      <div className="grid w-full h-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
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

      {/* Items als absolut positionierte DIVs */}
      {hero.inventory.items.map((item) => {
        const pos = item.position ?? { x: 0, y: 0 };
        const size = item.size ?? { width: 1, height: 1 };
        const x = dragState && dragState.id === item.id ? dragState.pixelX : pos.x * cellSize;
        const y = dragState && dragState.id === item.id ? dragState.pixelY : pos.y * cellSize;
        const w = size.width * cellSize;
        const h = size.height * cellSize;

        const classes =
          item.rarity === 'legendary'
            ? 'border border-3 border-yellow-500 bg-yellow-900'
            : item.rarity === 'rare'
            ? 'border border-3 border-blue-500 bg-blue-900'
            : item.rarity === 'uncommon'
            ? 'border border-3 border-green-500 bg-green-900'
            : 'border border-3 border-gray-500 bg-gray-900';

        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item)}
            className={`absolute rounded-lg text-white text-xs flex items-center justify-center cursor-grab ${classes}`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${w}px`,
              height: `${h}px`,
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
}