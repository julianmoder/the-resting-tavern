import TimerBar from './TimerBar';

type SpeechBubbleProps = {
  x: number;
  y: number;
  side: 'left'|'right';
  color: string;
  borderColor: string;
  text: string;
  total?: number;
  paused?: boolean;
  className?: string;
};

export default function SpeechBubble({ x, y, side, color, borderColor, text, total, paused = false, className = '' }: SpeechBubbleProps) {
  const fill = `bg-${color}`;
  const border = `border-${borderColor}`;
  const contrastFill = `bg-${borderColor}`;

  return (
    <div className={`pointer-events-none absolute ${className}`}
      style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }} >
      <div className={`relative max-w-[320px] rounded-2xl border ${fill} ${border} px-3 py-2 shadow-xl`}>
        <div className="text-white text-sm font-medium whitespace-pre-line">{text}</div>

        {typeof total === 'number' && total >= 0 && (
          <TimerBar totalMs={total} color={contrastFill} paused={paused} />
        )}

        {/* tail */}
        <div className={` absolute ${side === 'left' ? 'left-6' : 'right-6'} -bottom-2 w-4 h-4 rotate-45 ${fill} border-b border-r ${border} shadow-sm `} />
      </div>
    </div>
  );
}