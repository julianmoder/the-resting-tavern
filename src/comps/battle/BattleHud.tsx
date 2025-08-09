import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import UnitPlate from '../ui/UnitPlate';

type BattleHudProps = {
  className?: string;
};

export default function BattleHud({ className = '' }: BattleHudProps) {
  const hero = useHero();
  const boss = useBoss();

  return (
    <div className={`absolute top-2 left-2 right-2 z-50 ${className}`}>
      <div className="flex flex-cols-2 justify-between">
        <div>
          <UnitPlate
            name={hero?.name}
            level={hero?.level}
            health={hero?.stats.health}
            maxHealth={hero?.stats.maxHealth}
            energy={hero?.stats.energy}
            maxEnergy={hero?.stats.maxEnergy}
            align="left"
          />
        </div>
        <div>
          <UnitPlate
            name={boss?.name}
            level={boss?.level}
            health={boss?.stats.health}
            maxHealth={boss?.stats.maxHealth}
            energy={boss?.stats.energy}
            maxEnergy={boss?.stats.maxEnergy}
            align="left"
          />
        </div>
      </div>
    </div>
  );
}