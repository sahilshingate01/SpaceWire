import React from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Map as MapIcon,
  Settings,
  HelpCircle,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Mission Control', icon: <LayoutDashboard size={20} /> },
    { id: 'iss', label: 'ISS Tracking', icon: <MapIcon size={20} /> },
    { id: 'news', label: 'News Center', icon: <Newspaper size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-screen w-64 glass-panel rounded-none border-y-0 border-l-0 z-[60] flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center gap-3">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]"
          >
            <Globe className="text-[#003642]" size={24} />
          </motion.div>
          <span className="text-xl font-bold font-display tracking-tight text-white">SpaceWire</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {menuItems.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle size={20} />
            <span className="font-medium text-sm">Support</span>
          </button>
        </div>

        <div className="p-6">
          <div className="glass-panel p-4 bg-cyan-500/5 border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Live Telemetry</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connected to orbital network. Latency: 24ms
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
