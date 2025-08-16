import { useEffect, useState } from 'react';
import { useUI } from '../../hooks/useUI';
import { useHero } from '../../hooks/useHero';
import { useBoss } from '../../hooks/useBoss';
import { useBattle } from '../../hooks/useBattle';
import UnitPlate from '../ui/UnitPlate';
import BattleOutcomeOverlay from '../battle/BattleOutcomeOverlay';
import BattleFloatingOverlay from '../battle/BattleFloatingOverlay';


type BattleHudProps = {
  className?: string;
  onBossWin: () => void;
  onBossLose: () => void;
};

export default function BattleHud({ className = '', onBossWin, onBossLose }: BattleHudProps) {
  const ui = useUI();
  const hero = useHero();
  const boss = useBoss();
  const battle = useBattle();
  const [animNonce, setAnimNonce] = useState(0);

  useEffect(() => {
    if (battle.mechanic?.overlay?.flash || battle.mechanic?.overlay?.shake) {
      setAnimNonce(n => n + 1);
    }
  }, [battle.mechanic?.overlay?.flash, battle.mechanic?.overlay?.shake]);

  const shakeClass = battle.mechanic?.overlay?.shake ? 'animate-[shake_300ms_ease]' : '';
  
  if(!ui.pixi.boot) return;
  
  return (
    <div id='battle-hud'className={`absolute z-50 inset-0 pointer-events-none ${className} ${shakeClass}`}>
      <div className="flex flex-cols-2 justify-between p-2">
        <div>
          <UnitPlate unit={hero} align="left" />
        </div>
        <div>
          <UnitPlate unit={boss} align="left" />
        </div>
      </div>
      <BattleFloatingOverlay boot={ui.pixi.boot} heroPos={hero.position} bossPos={boss.position} durationMs={1000} />
      <BattleOutcomeOverlay onBossWin={onBossWin} onBossLose={onBossLose} />
      {battle.mechanic?.overlay?.flash && (
        <div
          key={`flash-${animNonce}`}
          className={`absolute inset-0 ${
            battle.mechanic?.overlay?.flash === 'success' ? 'bg-emerald-500/25' : 'bg-rose-600/25'
          } animate-[flash_500ms_ease-out_forwards]`}
        />
      )}
      <style>{`
        @keyframes flash { 0% { opacity: 0 } 20% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes shake {
          0% { transform: translate(0) }
          20% { transform: translate(-6px, 3px) }
          40% { transform: translate(4px, -2px) }
          60% { transform: translate(-3px, 2px) }
          80% { transform: translate(3px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}