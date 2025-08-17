type TimerBarProps = {
  totalMs: number;
  color?: string;
  className?: string;
  paused?: boolean;
};

export default function TimerBar({ totalMs, color = 'bg-stone-400', className = '', paused = false }: TimerBarProps) {

  return (
    <div className={`h-1.5 w-full mt-2 mb-1 rounded-full bg-black/40 overflow-hidden ${className}`}>
      <div className={`h-full w-full ${color} origin-left`}
        style={{
          animationName: 'drain',
          animationDuration: `${Math.max(0, totalMs)}ms`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards',
          animationPlayState: paused ? 'paused' as const : 'running' as const,
          transform: 'scaleX(1)',
          willChange: 'transform',
        }}
      />
      <style>{`
        @keyframes drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
