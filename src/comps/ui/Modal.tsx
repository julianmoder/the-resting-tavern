import { useModal } from '../../hooks/useModal';

export default function Modal() {
  const { modal, hideModal } = useModal();
  if (!modal.showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold text-white mb-2">{modal.title}</h2>
        <p className="text-gray-300 mb-4">{modal.message}</p>
        <button onClick={hideModal} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">
          Okay
        </button>
      </div>
    </div>
  );
}