import type { StateCreator } from 'zustand';
import type { Modal } from '../types/base';
import { ModalType } from '../types/base';

export interface ModalSlice {
  modal: Modal;
  sendModalMessage: (title: string, message: string, type?: ModalType, onClose?: () => void) => void;
  hideModal: () => void;
}

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = (set) => ({
  modal: {
    showModal: false,
    title: '',
    message: '',
    type: ModalType.Default,
    onClose: undefined,
  },
  sendModalMessage: (newTitle: string, newMessage: string, newType: ModalType = ModalType.Default, onClose) => {
    set(() => ({
      modal: { 
        showModal: true,
        title: newTitle, 
        message: newMessage,
        type: newType,
        onClose: onClose,
      },
    }))
  },
  hideModal: () => {
    set((state) => {
      const { onClose } = state.modal;
      const resetModal = { showModal: false, title: '', message: '', type: ModalType.Default, onClose: undefined };
      if (onClose) {
        setTimeout(() => onClose(), 0);
      }
      return { modal: resetModal };
    })
  },
});
