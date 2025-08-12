type StatBarProps = {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
};

export default function StatBar({
  label,
  value,
  max,
  colorClass,
  size = 'md',
  ariaLabel,
}: StatBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  const heightClass = size === 'sm' ? 'h-2' : 'h-4';
  const trackClass = `w-full ${heightClass} bg-stone-700/80 rounded overflow-hidden`;
  const fillClass = `${heightClass} ${colorClass} rounded transition-[width] duration-300 ease-out`;

  return (
    <div className="relative w-full flex flex-col gap-1" aria-label={ariaLabel ?? label}>
      {size === 'md' &&
        <div className="absolute w-full text-center text-xs text-stone-300">
          {label}: {value}/{max}
        </div>
      }
      <div className={trackClass} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}