import { useAppStore } from '../store/useAppStore';

export function useModal() {
  const modal = useAppStore((s) => s.modal);
  const sendModalMessage = useAppStore((s) => s.sendModalMessage);
  const hideModal = useAppStore((s) => s.hideModal);
  
  return { modal, sendModalMessage, hideModal };
}