import type { StateCreator } from 'zustand';

export interface ModalSlice {
  modal: {
    showModal: boolean;
    title: string;
    message: string;
  };
  sendModalMessage: (title: string, message: string) => void;
  hideModal: () => void;
  onClose?: () => void;
}

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = (set, get) => ({
  modal: {
    showModal: false,
    title: '',
    message: '',
    type: 'default',
    onClose: undefined,
  },
  sendModalMessage: (newTitle: string, newMessage: string, newType: 'default' | 'warning' | 'alert' = 'default', onClose) => {
    set((state) => ({
      modal: { 
        ...state.modal,
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
      const resetModal = { showModal: false, title: '', message: '', type: 'default', onClose: undefined };
      if (onClose) {
        setTimeout(() => onClose(), 0);
      }
      return { modal: resetModal };
    })
  },
});
