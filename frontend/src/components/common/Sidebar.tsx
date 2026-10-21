import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Binary,
  Terminal,
  Radio,
  Compass,
  Cpu,
  Bot,
  GraduationCap,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useQuantum } from '../../context/QuantumContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Learn', path: '/learn', icon: BookOpen },
  { name: 'Physics Lab', path: '/lab', icon: FlaskConical, badge: 'Active' },
  { name: 'Circuit Studio', path: '/circuit', icon: Binary },
  { name: 'Code Studio', path: '/code', icon: Terminal },
  { name: 'Communication Lab', path: '/communication', icon: Radio },
  { name: 'Sensing Lab', path: '/sensing', icon: Compass },
  { name: 'Hardware Explorer', path: '/hardware', icon: Cpu },
  { name: 'AI Mentor', path: '/mentor', icon: Bot, badge: 'AI' },
  { name: 'Classroom', path: '/classroom', icon: GraduationCap },
  { name: 'Student Portfolio', path: '/portfolio', icon: Award }
];

export const Sidebar: React.FC = () => {
  const { studentXP, completedLessons } = useQuantum();

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-sky-950/60 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-sky-950/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-amber-500/20 border border-cyan-400/30 flex items-center justify-center p-1.5 shadow-sm">
          <img src="/logo.svg" alt="KEP QuantumVerse" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            KEP <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">QuantumVerse</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Academic Quantum Engine
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Student Quick Status Card */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-cyan-900/40">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{studentXP} XP</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {completedLessons.length} Lessons done
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((completedLessons.length / 8) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">Rishikaa (Undergrad)</span>
          <NavLink to="/portfolio" className="text-cyan-400 hover:underline flex items-center">
            Portfolio <ChevronRight className="w-3 h-3 inline" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
