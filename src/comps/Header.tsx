function Header() {
  return (
    <header className="w-full px-6 flex flex-row items-center justify-start">
      <div className="flex items-center space-x-3">
        <div className="h-15 w-15 bg-stone-900 rounded-full flex items-center justify-center text-white font-bold text-4xl">
          R
        </div>
        <span className="text-2xl font-semibold text-white tracking-wide">
          The Resting Tavern
        </span>
      </div>
    </header>
  );
}

export default Header;