export interface InteractionCtx {
  now: number,
  deadline: number,
  onSuccess: () => void,
  onFail: () => void,
  hostEl: HTMLElement;
  worldToScreen: (x: number, y: number) => { left: number; top: number };
  bossPos: { x: number; y: number };
}

export interface Interaction {
  name: InteractionName,
  start(ctx: InteractionCtx): void,
  handleInput(e: KeyboardEvent | MouseEvent): void,
  update(dt: number, now: number): void,
  cleanup(): void,
  getPrompt(): string,
}

export enum InteractionName {
  ReactionClick = 'reaction-click',
  KeyMash = 'key-mash',
  DodgeDirection = 'dodge-direction',
}


