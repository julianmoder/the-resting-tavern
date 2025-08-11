import React from 'react';
import type { Hero, Boss } from '../../types/base';
import StatBar from './StatBar';

type UnitPlateProps = {
  unit: Hero | Boss;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
};

export default function UnitPlate({ unit, align = 'left', size = 'sm' }: UnitPlateProps) {
  const alignClass = align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl bg-stone-900/70 backdrop-blur-sm border border-stone-700 ${alignClass}`}>
      <div className="flex items-baseline gap-2">
        <h3 className="text-base font-semibold text-white">{unit.name}</h3>
        <span className="text-sm tracking-wide text-stone-300">Level {unit.level}</span>
      </div>
      <StatBar label="Health" value={unit.health} max={unit.maxHealth} colorClass="bg-rose-700" size="sm" />
      <StatBar label="Energy" value={unit.energy} max={unit.maxEnergy} colorClass="bg-emerald-700" size="sm" />
    </div>
  );
}