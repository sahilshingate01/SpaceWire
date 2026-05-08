import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useChatbot from '../../hooks/useChatbot';
import ChatWindow from './ChatWindow';

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
    toast.success('Chat cleared');
  };

  return (
    <>
      {/* Floating chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4">
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center text-2xl transition-all active:scale-95"
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
