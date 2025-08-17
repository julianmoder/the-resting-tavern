// src/engine/pixi/initRigs.ts
import { Assets } from 'pixi.js';
import type { DragonBonesFactoryLike } from './dragonbonesAdapter';
import { loadDragonBonesIntoFactory } from './dragonbonesAdapter';
import { HeroRig } from './heroRig';
import { BossRig } from './bossRig';

function ensureAdd(alias: string, src: string) {
  // Pixi v8: Resolver.hasKey verhindert die „overwriting“-Warnung
  if (!Assets.resolver.hasKey(alias)) {
    Assets.add({ alias, src });
  }
}

export async function createHeroRig(
  factory: DragonBonesFactoryLike,
  assetName: string,
  skeUrl: string,
  texJsonUrl: string,
  texPngUrl: string,
  armatureName: string
): Promise<HeroRig> {
  ensureAdd(`${assetName}_ske`, skeUrl);
  ensureAdd(`${assetName}_tex`, texJsonUrl);
  ensureAdd(`${assetName}_png`, texPngUrl);

  // Einmaliges Laden (Assets.load ist idempotent; geladene Aliase kommen direkt aus dem Cache)
  await Assets.load([`${assetName}_ske`, `${assetName}_tex`, `${assetName}_png`]);

  await loadDragonBonesIntoFactory(factory, {
    name: assetName,
    skeJsonUrl: `${assetName}_ske`,
    texJsonUrl: `${assetName}_tex`,
    texPngUrl: `${assetName}_png`,
  });

  return new HeroRig({ factory, dragonBonesName: assetName, armatureName });
}

export async function createBossRig(
  factory: DragonBonesFactoryLike,
  assetName: string,
  skeUrl: string,
  texJsonUrl: string,
  texPngUrl: string,
  armatureName: string
): Promise<BossRig> {
  ensureAdd(`${assetName}_ske`, skeUrl);
  ensureAdd(`${assetName}_tex`, texJsonUrl);
  ensureAdd(`${assetName}_png`, texPngUrl);

  await Assets.load([`${assetName}_ske`, `${assetName}_tex`, `${assetName}_png`]);

  await loadDragonBonesIntoFactory(factory, {
    name: assetName,
    skeJsonUrl: `${assetName}_ske`,
    texJsonUrl: `${assetName}_tex`,
    texPngUrl: `${assetName}_png`,
  });

  return new BossRig({ factory, dragonBonesName: assetName, armatureName });
}
