import React, { useState } from 'react';
import {
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Binary,
  Layers
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { Lesson } from '../types/quantum';
import { MathBlock } from '../components/common/MathBlock';
import { BlochSphereVisualizer } from '../components/common/BlochSphereVisualizer';

export const LearnPage: React.FC = () => {
  const { completedLessons, markLessonComplete, recordQuizScore, quizScores } = useQuantum();

  // Selected lesson state
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    CURRICULUM_MODULES[0].lessons[0]
  );

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Mini-interactive Bloch state for lessons
  const [blochTheta, setBlochTheta] = useState<number>(Math.PI / 2);
  const [blochPhi, setBlochPhi] = useState<number>(0);

  const isCompleted = completedLessons.includes(selectedLesson.id);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;
    let score = 0;
    selectedLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 100 / selectedLesson.quiz.length;
      }
    });
    setQuizSubmitted(true);
    recordQuizScore(selectedLesson.id, Math.round(score));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleSwitchLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left Navigation: Modules & Lessons Index */}
      <div className="w-full lg:w-80 border-r border-sky-950/60 bg-[#080d1a] p-4 overflow-y-auto space-y-4 shrink-0">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Course Syllabus</span>
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/40">
            {completedLessons.length} Done
          </span>
        </div>

        <div className="space-y-4">
          {CURRICULUM_MODULES.map((mod, modIdx) => (
            <div key={mod.id} className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-2">
                Module {modIdx + 1}: {mod.title}
              </span>
              <div className="space-y-1">
                {mod.lessons.map((les) => {
                  const done = completedLessons.includes(les.id);
                  const isCurrent = les.id === selectedLesson.id;
                  return (
                    <button
                      key={les.id}
                      onClick={() => handleSwitchLesson(les)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {done ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{les.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {les.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Pane: Lesson Viewer */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl mx-auto space-y-8">
        {/* Lesson Header */}
        <div className="space-y-2 border-b border-slate-800/80 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono uppercase">
              {selectedLesson.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium ml-auto">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {selectedLesson.title}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedLesson.summary}
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Learning Objectives
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {selectedLesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mathematical Formulation */}
        {selectedLesson.formula && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Formal Mathematical Representation
            </h3>
            <MathBlock formula={selectedLesson.formula} />
          </div>
        )}

        {/* Detailed Theory Sections */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Detailed Concepts & Rigorous Theory
          </h3>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            {selectedLesson.theory.map((para, i) => (
              <p key={i} className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Interactive Exploration Widget */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Binary className="w-4 h-4" />
            Interactive Concept Exploration
          </h3>
          <p className="text-xs text-slate-400">
            Manipulate the quantum state vector live to observe amplitude, phase, and measurement projection:
          </p>
          <BlochSphereVisualizer
            theta={blochTheta}
            phi={blochPhi}
            onChangeAngles={(t, p) => {
              setBlochTheta(t);
              setBlochPhi(p);
            }}
          />
        </div>

        {/* Knowledge Check Quiz */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-900 border border-sky-800/40 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Knowledge Check & Assessment</span>
              </h3>
              <p className="text-xs text-slate-400">
                Test your understanding to earn XP and verify your mastery.
              </p>
            </div>
            {quizSubmitted && (
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Quiz
              </button>
            )}
          </div>

          <div className="space-y-6">
            {selectedLesson.quiz.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              return (
                <div key={q.id} className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-200 block">
                    {qIndex + 1}. {q.question}
                  </span>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'bg-emerald-950/50 border-emerald-600/80 text-emerald-200';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          optionStyle = 'bg-rose-950/50 border-rose-600/80 text-rose-200';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs border transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-cyan-400">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < selectedLesson.quiz.length}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-950/40"
            >
              Submit Answers & Verify Mastery
            </button>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Score Recorded: {quizScores[selectedLesson.id] ?? 100}% (+150 XP)
              </span>
              <button
                onClick={() => markLessonComplete(selectedLesson.id)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Mark Lesson as Finished
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
