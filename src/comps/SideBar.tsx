import { useUI } from '../hooks/useUI';

export default function SideBar() {
  const ui = useUI();

  const buttonClasses = (active: boolean) =>
    `w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold ` +
    (active
      ? 'bg-orange-600 text-white'
      : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white');

  return (
    <nav
      className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col space-y-3 p-2 z-30"
      aria-label="Sidebar navigation"
    >
      <button
        aria-label="Toggle character overview"
        className={buttonClasses(ui.sidebar.showCharacter)}
        onClick={ui.sidebar.toggleCharacter}
      >
        C
      </button>
    </nav>
  );
}