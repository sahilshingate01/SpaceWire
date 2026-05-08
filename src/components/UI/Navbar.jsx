import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Bell, Search } from 'lucide-react';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="w-full h-20 px-8 flex justify-between items-center bg-transparent border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search mission database..." 
            className="mission-input pl-10 w-64 bg-white/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#050a14]"></span>
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Commander</div>
            <div className="text-[10px] text-slate-500">Mission Lead</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
            <div className="w-full h-full rounded-[11px] bg-[#050a14] flex items-center justify-center">
              <span className="text-xs font-bold text-white">SA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

