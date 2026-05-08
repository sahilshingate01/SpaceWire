import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, X, Bot, User, Cpu } from 'lucide-react';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl w-fit border border-white/5">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">Processing Data…</span>
    </div>
  );
}

export default function ChatWindow({ messages, isTyping, onSend, onClear, onClose }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-[380px] h-[550px] glass-panel bg-[#050a14]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-widest font-display">Orbital AI</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors rounded-lg"
            title="Clear Stream"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
              <Bot size={32} className="text-slate-600" />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest font-display">System Initialized</p>
              <p className="text-slate-500 text-xs mt-2 font-mono px-8 leading-relaxed">
                Awaiting mission parameters. I can analyze ISS telemetry, news streams, and orbital vectors.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest ${isUser ? 'text-slate-500' : 'text-cyan-500/70'}`}>
                  {isUser ? <><span className="mt-0.5">Commander</span> <User size={10} /></> : <><Bot size={10} /> <span className="mt-0.5">Orbital AI</span></>}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-500 text-[#003642] font-medium rounded-tr-none shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <div className="text-[9px] font-mono text-slate-600 font-bold">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Execute command…"
              disabled={isTyping}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="w-12 h-12 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-[#003642] rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
