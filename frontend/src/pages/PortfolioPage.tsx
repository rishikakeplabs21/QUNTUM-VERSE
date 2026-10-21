import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  BookOpen,
  FlaskConical,
  Binary,
  Download,
  Copy,
  CheckCircle,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { CURRICULUM_MODULES } from '../data/curriculumData';

export const PortfolioPage: React.FC = () => {
  const {
    completedLessons,
    experimentRuns,
    savedCircuits,
    studentXP,
    studentBadges,
    quizScores
  } = useQuantum();

  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  // Compile export transcript
  const handleExportTranscript = () => {
    const report = `# KEP QuantumVerse — Academic Student Portfolio & Lab Transcript
Date: ${new Date().toLocaleDateString()}
Student: Rishikaa
Program: Quantum Engineering & Technology (Undergraduate Fellow)
Total XP Earned: ${studentXP} XP
Badges Unlocked: ${studentBadges.join(', ')}

## Completed Modules & Lessons:
${completedLessons
  .map((lesId) => {
    const all = CURRICULUM_MODULES.flatMap((m) => m.lessons);
    const les = all.find((l) => l.id === lesId);
    const score = quizScores[lesId] ?? 100;
    return `- ${les ? les.title : lesId} (Quiz Score: ${score}%)`;
  })
  .join('\n')}

## Quantum Experiments Logged (${experimentRuns.length}):
${experimentRuns
  .map(
    (run, i) =>
      `${i + 1}. [${run.timestamp}] ${run.title}\n   Summary: ${run.summary}`
  )
  .join('\n\n')}

## Custom Synthesized Quantum Circuits (${savedCircuits.length}):
${savedCircuits
  .map(
    (c, i) =>
      `${i + 1}. ${c.name} (${c.numQubits} Qubits, ${c.gates.length} Gates)`
  )
  .join('\n')}
`;

    navigator.clipboard.writeText(report);
    setCopyMsg('Full Academic Transcript copied to clipboard!');
    setTimeout(() => setCopyMsg(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Student Quantum Portfolio & Journal
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Official academic record of completed curricula, experiment logs, synthesized circuits, and validated achievements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {copyMsg && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {copyMsg}
            </span>
          )}
          <button
            onClick={handleExportTranscript}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Transcript</span>
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-indigo-950/40 border border-cyan-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 border border-cyan-300/40 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            R
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Rishikaa</h2>
            <p className="text-xs text-slate-300">
              Department of Electrical & Quantum Engineering • KEP Institute of Advanced Technology
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono">
                Undergraduate Fellow
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: <code>rishikaa-qe301-2026</code>
              </span>
            </div>
          </div>
        </div>

        {/* XP Counter */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 pl-0 md:pl-6 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Academic XP</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{studentXP}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{completedLessons.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Labs Logged</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{experimentRuns.length}</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Earned Competency Badges ({studentBadges.length})</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {studentBadges.map((b) => (
            <div
              key={b}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-600/30 flex flex-col items-center text-center gap-2"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">{b}</span>
              <span className="text-[10px] text-slate-400">Verified Mastery</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Completed Lessons & Experiment Logbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Lessons */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Curriculum History</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {completedLessons.length} Completed
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto">
            {completedLessons.map((lesId) => {
              const all = CURRICULUM_MODULES.flatMap((m) => m.lessons);
              const les = all.find((l) => l.id === lesId);
              const score = quizScores[lesId] ?? 100;

              return (
                <div
                  key={lesId}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-200 block truncate">
                        {les ? les.title : lesId}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {les?.duration} • {les?.difficulty}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-400 text-xs font-bold shrink-0">
                    {score}% Score
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experiment Logbook */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Experiment Logbook</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {experimentRuns.length} Entries
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {experimentRuns.map((run) => (
              <div
                key={run.id}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{run.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{run.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{run.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
