/**
 * The Resting Tavern — DragonBones Adapter (Pixi v8)
 * --------------------------------------------------
 * Ziel:
 *  - Einheitliche Schnittstelle für Laden, Armature-Build, Animationssteuerung,
 *    Slot-/Attachment-Replacements und Event-Bridge.
 *  - Pixi v8-konformes Asset-Loading via `Assets.load` (kein PIXI.Loader mehr).
 *  - Kein direkter Import einer konkreten DragonBones-Library: Factory wird injiziert.
 *
 * Hinweise & Quellen:
 *  - Pixi v8: Loader entfernt → `await Assets.load(...)` verwenden. 
 *    (siehe Migration Guide) 
 *  - Beispiel-API (PixiFactory, buildArmatureDisplay, parseDragonBonesData, 
 *    parseTextureAtlasData) aus einer v8-kompatiblen DragonBones-Runtime. 
 *  - DragonBones-Events & FRAME_EVENT/COMPLETE etc. werden via `addEventListener` gehört.
 *
 * Kompatibilität:
 *  - Für unterschiedliche Runtimes (z. B. community "DragonBones-Pixi" oder 
 *    "pixi-dragonbones-runtime") genügt, dass die injizierte Factory und das 
 *    ArmatureDisplay die hier verwendeten Methoden/Signaturen bereitstellen.
 */

import { Assets, Texture } from 'pixi.js';

/* ---------- Minimale Interfaces für Laufzeitobjekte (framework-agnostisch) ---------- */

export interface DragonBonesFactoryLike {
  /** Parsed SKE JSON (dragonBonesData) registrieren */
  parseDragonBonesData(data: any, name?: string): void;

  /** Parsed TEX JSON + PIXI.Texture registrieren */
  parseTextureAtlasData(texData: any, texture: Texture, name?: string): void;

  /** ArmatureDisplay erzeugen */
  buildArmatureDisplay(armatureName: string, dragonBonesName?: string): ArmatureDisplayLike | null;

  /** Slot-Display aus einer (Quell-)DB-Armature in Ziel-Slot ersetzen */
  replaceSlotDisplay(
    sourceDragonBonesName: string,
    sourceArmatureName: string,
    sourceSlotName: string,
    displayName: string,
    targetSlot: any
  ): void;
}

export interface AnimationStateLike {
  /** Spielt eine Animation direkt ab (vereinfachte API) */
  play(animationName: string, playTimes?: number): AnimationStateLike;

  /** Fadet in eine Animation ein (DragonBones: fadeIn(name, fadeInTime, playTimes)) */
  fadeIn?(animationName: string, fadeInTime?: number, playTimes?: number): AnimationStateLike;

  /** Optionales Time-Scaling (nicht in allen Runtimes identisch) */
  timeScale?: number;
}

export interface ArmatureLike {
  /** Zugriff auf Slot nach Name */
  getSlot(slotName: string): any;
}

export interface ArmatureDisplayLike {
  /** Armature-Objekt der Runtime */
  armature: ArmatureLike;

  /** Animations-Controller */
  animation: AnimationStateLike;

  /** Event-Anmeldung (DragonBonesJS: addEventListener(EventObject.X, handler)) */
  addEventListener?(type: string, listener: (evt: any) => void): void;

  /** Event-Abmeldung */
  removeEventListener?(type: string, listener: (evt: any) => void): void;
}

/** Mögliche High-Level-Events, die wir in die Spiel-Logik spiegeln */
export type AdapterEvent = 'start' | 'loopComplete' | 'complete' | 'fadeIn' | 'fadeInComplete' | 'fadeOut' | 'fadeOutComplete' | 'frame';

/** Bridge für Events (Mapping Runtime → Common) */
export interface EventBridge {
  /** Mappt AdapterEvent → Runtime-EventKey (z. B. "start" → EventObject.START) */
  map: Record<AdapterEvent, string>;
}

/* ---------- Default-Bridge für DragonBones-typische Eventnamen ---------- */
/* Viele Runtimes exposen EventObject.START/COMPLETE/...; wir halten die Keys als strings. */
export const DefaultDragonBonesEventBridge: EventBridge = {
  map: {
    start: 'start',
    loopComplete: 'loopComplete',
    complete: 'complete',
    fadeIn: 'fadeIn',
    fadeInComplete: 'fadeInComplete',
    fadeOut: 'fadeOut',
    fadeOutComplete: 'fadeOutComplete',
    frame: 'frameEvent', // FRAME_EVENT
  },
};

/* ---------- Laden & Factory-Setup ---------- */

export interface LoadDragonBonesParams {
  /** Eindeutiger Name für dieses DB-Paket (dragonBonesName) */
  name: string;
  /** URLs zu SKE- und TEX-Daten */
  skeJsonUrl: string;     // skeleton.json (dragonBonesData)
  texJsonUrl: string;     // texture.json  (atlas data)
  texPngUrl: string;      // texture.png   (atlas image)
}

/**
 * Lädt SKE/TEX-Daten via Pixi v8 `Assets.load` und registriert sie in der Factory.
 * Achtung: In Pixi v8 muss die URL vorher `Assets.add`ed sein, wenn ihr Aliase nutzen wollt.
 */
export async function loadDragonBonesIntoFactory(
  factory: DragonBonesFactoryLike,
  params: LoadDragonBonesParams
): Promise<void> {
  const { name, skeJsonUrl, texJsonUrl, texPngUrl } = params;

  // Pixi v8 Assets: JSON & PNG laden (beide via Assets.load möglich).
  const [skeData, texData, texImage] = await Promise.all([
    Assets.load(skeJsonUrl),
    Assets.load(texJsonUrl),
    Assets.load(texPngUrl),
  ]);

  // Texture aus dem geladenen Image erstellen (Assets gibt i. d. R. direkt Texture zurück, 
  // hängt vom Asset-Resolver ab)
  const texture = texImage as Texture;

  // In die Factory schieben
  factory.parseDragonBonesData(skeData, name);
  factory.parseTextureAtlasData(texData, texture, name);
}

/* ---------- Armature-Erzeugung ---------- */

export interface BuildArmatureParams {
  /** Name der Armature im SKE */
  armatureName: string;
  /** Optional: dragonBonesName (Paketschlüssel), falls mehrere registriert sind */
  dragonBonesName?: string;
}

/** Baut ein ArmatureDisplay (DisplayObject/Container-ähnlich je Runtime) */
export function buildArmatureDisplay(
  factory: DragonBonesFactoryLike,
  { armatureName, dragonBonesName }: BuildArmatureParams
): ArmatureDisplayLike {
  const display = factory.buildArmatureDisplay(armatureName, dragonBonesName || undefined);
  if (!display) throw new Error(`[DB] buildArmatureDisplay failed for armature="${armatureName}"`);
  return display;
}

/* ---------- Animationen ---------- */

export interface PlayOptions {
  /** Crossfade/FadeIn-Sekunden (falls Runtime fadeIn unterstützt) */
  mix?: number;
  /** Loopen? true→unendlich, false→einmal */
  loop?: boolean;
  /** Optionales Time-Scaling */
  timeScale?: number;
}

/**
 * Spielt eine Animation ab; nutzt bevorzugt `fadeIn`, fällt sonst auf `play` zurück.
 * DragonBones-Konvention: playTimes = 0 → unendlich; = 1 → einmal.
 */
export function playAnimation(
  display: ArmatureDisplayLike,
  anim: string,
  { mix = 0.2, loop = false, timeScale }: PlayOptions = {}
): void {
  const playTimes = loop ? 0 : 1;

  if (typeof display.animation.fadeIn === 'function') {
    display.animation.fadeIn!(anim, mix, playTimes);
  } else {
    display.animation.play(anim, playTimes);
  }

  if (timeScale !== undefined) {
    display.animation.timeScale = timeScale;
  }
}

/* ---------- Slot-/Attachment-Replacements ---------- */

export interface ReplaceAttachmentOptions {
  /**
   * Falls das Display (Attachment) aus einem anderen DB-Paket/Armature stammt, 
   * hier die Quelle angeben. Ansonsten wird standardmäßig das aktuell registrierte
   * dragonBonesName/armatureName als Quelle angenommen.
   */
  sourceDragonBonesName?: string;
  sourceArmatureName?: string;
}

/**
 * Ersetzt das Display in einem Slot. 
 * - `attachmentKey` entspricht in DB meist dem `displayName` im Atlas/SKE.
 * - Intern wird `factory.replaceSlotDisplay(...)` genutzt (empfohlener Weg).
 */
export function replaceSlotDisplay(
  factory: DragonBonesFactoryLike,
  display: ArmatureDisplayLike,
  slotName: string,
  attachmentKey: string,
  dragonBonesName: string,
  armatureName: string,
  opts: ReplaceAttachmentOptions = {}
): void {
  const slot = display.armature.getSlot(slotName);
  if (!slot) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[DB] Slot not found: ${slotName}`);
    }
    return;
  }

  const sourceDB = opts.sourceDragonBonesName ?? dragonBonesName;
  const sourceArm = opts.sourceArmatureName ?? armatureName;

  factory.replaceSlotDisplay(sourceDB, sourceArm, slotName, attachmentKey, slot);
}

/* ---------- Event-Bridge ---------- */

export type EventHandler = (evt: any) => void;

/**
 * Registriert einen Handler auf einem ArmatureDisplay-Event.
 * `type` ist ein AdapterEvent (z. B. 'complete'), das via Bridge auf die Runtime-Event-ID gemappt wird.
 */
export function onEvent(
  display: ArmatureDisplayLike,
  type: AdapterEvent,
  handler: EventHandler,
  bridge: EventBridge = DefaultDragonBonesEventBridge
): void {
  const runtimeType = bridge.map[type];
  display.addEventListener?.(runtimeType, handler);
}

/** Entfernt einen registrierten Event-Handler */
export function offEvent(
  display: ArmatureDisplayLike,
  type: AdapterEvent,
  handler: EventHandler,
  bridge: EventBridge = DefaultDragonBonesEventBridge
): void {
  const runtimeType = bridge.map[type];
  display.removeEventListener?.(runtimeType, handler);
}

/* ---------- Hilfen für Pixi v8 ---------- */

/**
 * Pixi v8 lädt Assets über `Assets.load`; wenn ihr Aliase wollt, zunächst registrieren:
 * 
 * await Assets.add({ alias: 'hero_ske', src: '/assets/hero/skeleton.json' });
 * await Assets.add({ alias: 'hero_tex', src: '/assets/hero/texture.json' });
 * await Assets.add({ alias: 'hero_png', src: '/assets/hero/texture.png' });
 * 
 * // Dann wie gewohnt:
 * await loadDragonBonesIntoFactory(factory, { name: 'hero', skeJsonUrl: 'hero_ske', texJsonUrl: 'hero_tex', texPngUrl: 'hero_png' });
 */
export const PixiV8Note = true; // nur als Marker/Kontext
