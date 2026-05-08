import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="w-full py-4 px-4 sm:px-6 shadow-md bg-gray-100 dark:bg-gray-900/60 backdrop-blur flex justify-between items-center transition-colors duration-300 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <span aria-hidden>🛰️</span>
        <span>Space &amp; News Dashboard</span>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span aria-hidden>{isDarkMode ? '🌞' : '🌙'}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      </button>
    </nav>
  );
}

