import type { StateCreator } from 'zustand'
import { Stage } from '../types/types';

export interface StageSlice {
  stage: Stage;
  setStage: (s: Stage) => void;
}

export const createStageSlice: StateCreator<StageSlice, [], [], StageSlice> = (set) => ({
  stage: Stage.Landing,
  setStage: (stage: Stage) => set({ stage }),
});