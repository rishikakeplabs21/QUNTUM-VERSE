import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  FlaskConical,
  Binary,
  Radio,
  Compass,
  Cpu,
  Bot,
  ArrowRight,
  CheckCircle2,
  Play,
  Clock,
  Award,
  Layers
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { EXPERIMENTS_CATALOG } from '../data/experimentsData';

export const DashboardPage: React.FC = () => {
  const { completedLessons, experimentRuns, savedCircuits, studentXP, studentBadges, backendOnline } = useQuantum();

  const totalLessons = CURRICULUM_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const progressPct = Math.round((completedLessons.length / totalLessons) * 100);

  // Recommended next lesson: first uncompleted lesson
  const allLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons);
  const nextLesson = allLessons.find((l) => !completedLessons.includes(l.id)) || allLessons[0];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/60 border border-sky-800/30 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Quantum Computing Platform</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">KEP QuantumVerse</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Bridge physical quantum mechanics, linear algebra, interactive circuit simulation, and quantum communication protocols through verified mathematical modeling.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <NavLink
              to="/circuit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-cyan-950/50"
            >
              <Binary className="w-4 h-4" />
              <span>Launch Circuit Studio</span>
            </NavLink>
            <NavLink
              to="/lab"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>Explore Physics Lab</span>
            </NavLink>
          </div>
        </div>

        {/* Decorative Grid Graphic in Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <div className="w-full h-full quantum-grid-bg" />
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Curriculum Progress</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {progressPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {completedLessons.length} of {totalLessons} Lessons Completed
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Lab Experiments Run</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {experimentRuns.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Logged in Student Journal
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Saved Circuits</span>
            <Binary className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {savedCircuits.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Custom Gate Configurations
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Student XP</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {studentXP}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {studentBadges.length} Academic Badges Earned
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Recommended Activity & Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Next Lesson Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 border border-cyan-800/40 relative">
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1 block">
              Recommended Next Activity
            </span>
            <h3 className="text-lg font-bold text-white mb-1">
              {nextLesson.title}
            </h3>
            <p className="text-xs text-slate-300 mb-4 line-clamp-2">
              {nextLesson.summary}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {nextLesson.duration}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                  {nextLesson.difficulty}
                </span>
              </div>
              <NavLink
                to={`/learn`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
              >
                <span>Continue Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>

          {/* Quick Learning Modules Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Quantum Modules
              </h3>
              <NavLink to="/learn" className="text-xs text-cyan-400 hover:underline">
                View All
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CURRICULUM_MODULES.map((mod) => {
                const completedInMod = mod.lessons.filter((l) =>
                  completedLessons.includes(l.id)
                ).length;
                return (
                  <NavLink
                    key={mod.id}
                    to="/learn"
                    className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-800/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="font-mono text-cyan-400 text-[11px]">{mod.level}</span>
                        <span>{completedInMod}/{mod.lessons.length} Completed</span>
                      </div>
                      <h4 className="font-semibold text-slate-200 text-sm group-hover:text-cyan-300 transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all"
                        style={{ width: `${(completedInMod / mod.lessons.length) * 100}%` }}
                      />
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Launch Studio & Recent Logs */}
        <div className="space-y-6">
          {/* Quick Access Grid */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Simulation Studios
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <NavLink
                to="/circuit"
                className="p-3 rounded-lg bg-slate-800/60 hover:bg-sky-950/40 border border-slate-700/60 hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center gap-1.5 text-slate-200"
              >
                <Binary className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Circuit Studio</span>
              </NavLink>

              <NavLink
                to="/lab"
                className="p-3 rounded-lg bg-slate-800/60 hover:bg-sky-950/40 border border-slate-700/60 hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center gap-1.5 text-slate-200"
              >
                <FlaskConical className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Physics Lab</span>
              </NavLink>

              <NavLink
                to="/communication"
                className="p-3 rounded-lg bg-slate-800/60 hover:bg-sky-950/40 border border-slate-700/60 hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center gap-1.5 text-slate-200"
              >
                <Radio className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">BB84 QKD</span>
              </NavLink>

              <NavLink
                to="/mentor"
                className="p-3 rounded-lg bg-slate-800/60 hover:bg-sky-950/40 border border-slate-700/60 hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center gap-1.5 text-slate-200"
              >
                <Bot className="w-5 h-5 text-amber-400" />
                <span className="font-medium">AI Mentor</span>
              </NavLink>
            </div>
          </div>

          {/* Recent Experiment Journal */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Recent Lab Runs
              </h3>
              <NavLink to="/portfolio" className="text-xs text-cyan-400 hover:underline">
                Logbook
              </NavLink>
            </div>

            {experimentRuns.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No experiments run yet in this session.</p>
            ) : (
              <div className="space-y-2">
                {experimentRuns.slice(0, 3).map((run) => (
                  <div
                    key={run.id}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200 truncate">{run.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{run.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{run.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
