import React from 'react';
import StatBar from './StatBar';

type UnitPlateProps = {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
};

export default function UnitPlate({ name, level, health, maxHealth, energy, maxEnergy, align = 'left', size = 'sm' }: UnitPlateProps) {
  const alignClass = align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl bg-stone-900/70 backdrop-blur-sm border border-stone-700 ${alignClass}`}>
      <div className="flex items-baseline gap-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <span className="text-sm tracking-wide text-stone-300">Level {level}</span>
      </div>
      <StatBar label="Health" value={health} max={maxHealth} colorClass="bg-rose-700" size="sm" />
      <StatBar label="Energy" value={energy} max={maxEnergy} colorClass="bg-emerald-700" size="sm" />
    </div>
  );
}