export interface InteractionCtx {
  now: number,
  deadline: number,
  onSuccess: () => void,
  onFail: () => void,
}

export interface Interaction {
  id: string,
  start(ctx: InteractionCtx): void,
  handleInput(e: KeyboardEvent | MouseEvent): void,
  update(dt: number, now: number): void,
  cleanup(): void,
}

export enum InteractionId {
  ReactionClick = 'reaction-click',
  KeyMash = 'key-mash',
  DodgeDirection = 'dodge-direction',
}


