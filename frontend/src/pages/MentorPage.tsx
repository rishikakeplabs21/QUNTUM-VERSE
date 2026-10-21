import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Info,
  User,
  RotateCcw,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { getClientMentorResponse } from '../lib/mentor';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
  mode?: string;
  notice?: string;
}

const SUGGESTED_QUERIES = [
  'Explain Superposition mathematically',
  'How does CNOT create Entanglement?',
  'What is QBER in the BB84 protocol?',
  'Explain the Bloch Sphere representation',
  'Why does quantum measurement collapse the state?',
  'What is the difference between SQL and Heisenberg Limit?'
];

export const MentorPage: React.FC = () => {
  const { backendOnline } = useQuantum();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hello! I am your KEP QuantumVerse Learning Assistant. You can ask me any question regarding quantum gates, linear algebra, superposition, entanglement, BB84 cryptography, or how to set up circuits.',
      timestamp: 'Just now',
      provider: 'KEP Curriculum Tutor'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (questionToSend?: string) => {
    const q = questionToSend || inputText;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionToSend) setInputText('');
    setIsLoading(true);

    if (!API_BASE) {
      setTimeout(() => {
        const fallbackData = getClientMentorResponse(q);
        const fallbackMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: fallbackData.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: fallbackData.provider,
          mode: fallbackData.mode,
          notice: fallbackData.notice
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/api/mentor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      if (resp.ok) {
        const data = await resp.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider,
          mode: data.mode,
          notice: data.notice
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Intelligent curriculum knowledge-base fallback response
      const fallbackData = getClientMentorResponse(q);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackData.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: fallbackData.provider,
        mode: fallbackData.mode,
        notice: fallbackData.notice
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-sky-950/60 pb-4 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              QuantumVerse AI Mentor
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Pedagogical AI tutor for quantum computing and physics concepts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
            Curriculum Grounded
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {SUGGESTED_QUERIES.map((query, i) => (
          <button
            key={i}
            onClick={() => handleSend(query)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-950/70 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/50 text-[11px] text-slate-300 whitespace-nowrap shrink-0 transition-colors"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Message Chat Pane */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-slate-950'
                  : 'bg-indigo-600/80 border border-cyan-400/40 text-cyan-300'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-cyan-950/70 border border-cyan-700/50 text-cyan-100'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.notice && (
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                  ℹ️ {m.notice}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>{m.provider || 'Quantum Tutor'}</span>
                <span>{m.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 italic pl-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Consulting quantum mechanics knowledge base...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask a quantum physics or circuit question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
