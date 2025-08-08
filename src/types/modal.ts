export interface Modal {
  showModal: boolean;
  title: string;
  message: string;
  type?: ModalType,
  onClose?: () => void,
};

export enum ModalType {
  Default = 'default',
  Warning = 'warning',
  Alert = 'alert',
}