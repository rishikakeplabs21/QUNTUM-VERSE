import React, { useState } from 'react';
import {
  Search,
  Activity,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useQuantum } from '../../context/QuantumContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { backendOnline, activeRole, setActiveRole, studentXP } = useQuantum();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('bloch') || q.includes('state') || q.includes('probability')) {
      navigate('/lab');
    } else if (q.includes('circuit') || q.includes('bell') || q.includes('gate')) {
      navigate('/circuit');
    } else if (q.includes('bb84') || q.includes('key') || q.includes('crypt')) {
      navigate('/communication');
    } else if (q.includes('sens') || q.includes('ramsey')) {
      navigate('/sensing');
    } else if (q.includes('code') || q.includes('qiskit') || q.includes('python')) {
      navigate('/code');
    } else {
      navigate('/learn');
    }
    setSearchQuery('');
  };

  return (
    <header className="h-16 border-b border-sky-950/60 bg-[#070b14]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Title & Context */}
      <div>
        <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          {title || 'KEP QuantumVerse'}
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
            v1.0 MVP
          </span>
        </h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center relative w-72">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search lessons, gates, labs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 text-xs text-slate-200 pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Backend Status Indicator */}
        <div
          title={backendOnline ? 'FastAPI + NumPy Engine Connected' : 'Running on Client Math Engine'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            backendOnline
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/50 text-amber-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-[11px] font-mono">
            {backendOnline ? 'Engine: Online' : 'Client-Side Mode'}
          </span>
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{activeRole} View</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-xs">
              <button
                onClick={() => {
                  setActiveRole('student');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 ${
                  activeRole === 'student' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Student Mode</span>
                {activeRole === 'student' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  setActiveRole('faculty');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 ${
                  activeRole === 'faculty' ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Faculty Mode</span>
                {activeRole === 'faculty' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* User Profile Area */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            R
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 leading-none">Rishikaa</span>
            <span className="text-[10px] text-slate-400 leading-tight">Quantum Engineering</span>
          </div>
        </div>
      </div>
    </header>
  );
};
