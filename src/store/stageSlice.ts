import type { StateCreator } from 'zustand'

export interface StageSlice {
  stage: string;
  setStage: (s: string) => void;
}

export const createStageSlice: StateCreator<StageSlice, [], [], StageSlice> = (set) => ({
  stage: 'landing',
  setStage: (stage: string) => set({ stage }),
});