import { useAppStore } from '../store/useAppStore';

export function useBoss() {
  const boss = useAppStore(s => s.boss);
  const createBoss = useAppStore(s => s.createBoss);
  
  
  return {
    ...boss,
    create: createBoss,
  }
}