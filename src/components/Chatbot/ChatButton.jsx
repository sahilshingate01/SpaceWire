import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useChatbot from '../../hooks/useChatbot';
import ChatWindow from './ChatWindow';
import { MessageSquare, X, Cpu } from 'lucide-react';

export default function ChatButton({ dashboardContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const prevCountRef = useRef(0);
  const { messages, sendMessage, clearChat, isTyping } = useChatbot();

  // Track unread messages when window is closed
  useEffect(() => {
    const assistantMsgs = messages.filter((m) => m.role === 'assistant').length;
    if (!isOpen && assistantMsgs > prevCountRef.current) {
      setUnread((u) => u + (assistantMsgs - prevCountRef.current));
    }
    prevCountRef.current = assistantMsgs;
  }, [messages, isOpen]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const handleSend = (text) => {
    sendMessage(text, dashboardContext);
  };

  const handleClear = () => {
    clearChat();
    toast.success('Communication stream cleared');
  };

  return (
    <>
      {/* Floating chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            onClear={handleClear}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 group shadow-2xl ${
          isOpen 
            ? 'bg-slate-800 border border-white/10 text-white' 
            : 'bg-cyan-500 text-[#003642] shadow-[0_0_30px_rgba(0,212,255,0.4)]'
        }`}
        title={isOpen ? 'Close Stream' : 'Initialize AI Link'}
      >
        {isOpen ? (
          <X size={24} className="animate-in fade-in zoom-in duration-300" />
        ) : (
          <div className="relative">
            <Cpu size={28} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-lg border-4 border-[#050a14] flex items-center justify-center animate-bounce">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
