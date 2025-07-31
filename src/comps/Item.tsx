type ItemProps = {
  item: Item;
  dragState?: State;
  cellSize: number;
  handlePointerDown?: (e: React.PointerEvent, item: Item) => void;
};

export default function Item({ item, dragState, cellSize, handlePointerDown  }: ItemProps) {
  const position = item.position;
  const size = item.size;
  const x = dragState && dragState.draggedItem?.id === item.id ? dragState.pixelX : pos.x * cellSize;
  const y = dragState && dragState.draggedItem?.id === item.id ? dragState.pixelY : pos.y * cellSize;
  const w = size.width * cellSize;
  const h = size.height * cellSize;

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
      className={`absolute rounded-lg text-white text-xs flex items-center justify-center cursor-grab ${rarityClasses}`}
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
}