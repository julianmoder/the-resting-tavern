import { useAppStore } from '../store/useAppStore';

export function useSettings() {
  const settings = useAppStore(s => s.settings);
  const setInvCellSize = useAppStore(s => s.setInvCellSize);
  
  return {
    ...settings,
    inventory: {
      ...settings.inventory,
      setCellSize: setInvCellSize,
    }
  }
}