import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import UnitPlate from '../ui/UnitPlate';
import BattleOutcomeOverlay from '../battle/BattleOutcomeOverlay';

type BattleHudProps = {
  className?: string;
  onBossWin: () => void;
  onBossLose: () => void;
};

export default function BattleHud({ className = '', onBossWin, onBossLose }: BattleHudProps) {
  const hero = useHero();
  const boss = useBoss();

  return (
    <div className={`absolute z-50 w-full h-full pointer-events-none ${className}`}>
      <div className="flex flex-cols-2 justify-between p-2">
        <div>
          <UnitPlate unit={hero} align="left" />
        </div>
        <div>
          <UnitPlate unit={boss} align="left" />
        </div>
      </div>
      <BattleFloatingOverlay boot={boot} heroPos={hero.position} bossPos={boss.position} durationMs={500} />
      <BattleOutcomeOverlay onBossWin={onBossWin} onBossLose={onBossLose} />
    </div>
  );
}