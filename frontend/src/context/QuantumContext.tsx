import React, { createContext, useContext, useState, useEffect } from 'react';
import { GateStep, ExperimentRunRecord } from '../types/quantum';

interface SavedCircuit {
  id: string;
  name: string;
  numQubits: number;
  gates: GateStep[];
  createdAt: string;
}

interface QuantumContextType {
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  quizScores: Record<string, number>;
  recordQuizScore: (lessonId: string, score: number) => void;
  experimentRuns: ExperimentRunRecord[];
  addExperimentRun: (data: { experimentId: string; title: string; parameters: Record<string, any>; summary: string }) => void;
  savedCircuits: SavedCircuit[];
  saveCircuit: (name: string, numQubits: number, gates: GateStep[]) => void;
  deleteCircuit: (id: string) => void;
  studentXP: number;
  studentBadges: string[];
  backendOnline: boolean;
  activeRole: 'student' | 'faculty';
  setActiveRole: (role: 'student' | 'faculty') => void;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export const QuantumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kv_completed_lessons');
      return saved ? JSON.parse(saved) : ['les-101'];
    } catch {
      return ['les-101'];
    }
  });

  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('kv_quiz_scores');
      return saved ? JSON.parse(saved) : { 'les-101': 100 };
    } catch {
      return { 'les-101': 100 };
    }
  });

  const [experimentRuns, setExperimentRuns] = useState<ExperimentRunRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kv_experiment_runs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'run-init-1',
          experimentId: 'exp-1',
          title: 'Quantum Probability & Measurement',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          parameters: { shots: 1024, state: '|0⟩' },
          summary: 'Verified Born rule convergence. Outcome distribution: 100% |0⟩ with zero standard deviation.'
        }
      ];
    } catch {
      return [];
    }
  });

  const [savedCircuits, setSavedCircuits] = useState<SavedCircuit[]>(() => {
    try {
      const saved = localStorage.getItem('kv_saved_circuits');
      return saved ? JSON.parse(saved) : [
        {
          id: 'circ-default-bell',
          name: 'Bell State |Φ+⟩',
          numQubits: 2,
          gates: [
            { id: 'g1', gate: 'H', target: 0, stepIndex: 0 },
            { id: 'g2', gate: 'CNOT', control: 0, target: 1, stepIndex: 1 }
          ],
          createdAt: 'Built-in Preset'
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>('student');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Check backend health periodically if an API base is configured
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    if (!API_BASE) {
      setBackendOnline(false);
      return;
    }
    const checkHealth = async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/health`);
        if (resp.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      } catch {
        setBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kv_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('kv_quiz_scores', JSON.stringify(quizScores));
  }, [quizScores]);

  useEffect(() => {
    localStorage.setItem('kv_experiment_runs', JSON.stringify(experimentRuns));
  }, [experimentRuns]);

  useEffect(() => {
    localStorage.setItem('kv_saved_circuits', JSON.stringify(savedCircuits));
  }, [savedCircuits]);

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
  };

  const recordQuizScore = (lessonId: string, score: number) => {
    setQuizScores((prev) => ({ ...prev, [lessonId]: score }));
    markLessonComplete(lessonId);
  };

  const addExperimentRun = (data: {
    experimentId: string;
    title: string;
    parameters: Record<string, any>;
    summary: string;
  }) => {
    const newRecord: ExperimentRunRecord = {
      id: `run-${Date.now()}`,
      experimentId: data.experimentId,
      title: data.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parameters: data.parameters,
      summary: data.summary
    };
    setExperimentRuns((prev) => [newRecord, ...prev]);
  };

  const saveCircuit = (name: string, numQubits: number, gates: GateStep[]) => {
    const newCircuit: SavedCircuit = {
      id: `circ-${Date.now()}`,
      name,
      numQubits,
      gates,
      createdAt: new Date().toLocaleDateString()
    };
    setSavedCircuits((prev) => [newCircuit, ...prev]);
  };

  const deleteCircuit = (id: string) => {
    setSavedCircuits((prev) => prev.filter((c) => c.id !== id));
  };

  // Derive XP & Badges
  const studentXP = completedLessons.length * 150 + experimentRuns.length * 80 + savedCircuits.length * 50;

  const studentBadges: string[] = [];
  if (completedLessons.length >= 1) studentBadges.push('Quantum Initiate');
  if (completedLessons.length >= 3) studentBadges.push('Superposition Explorer');
  if (experimentRuns.length >= 2) studentBadges.push('Lab Experimentalist');
  if (savedCircuits.length >= 2) studentBadges.push('Circuit Architect');
  if (completedLessons.length >= 5) studentBadges.push('Entanglement Pioneer');

  return (
    <QuantumContext.Provider
      value={{
        completedLessons,
        markLessonComplete,
        quizScores,
        recordQuizScore,
        experimentRuns,
        addExperimentRun,
        savedCircuits,
        saveCircuit,
        deleteCircuit,
        studentXP,
        studentBadges,
        backendOnline,
        activeRole,
        setActiveRole
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => {
  const ctx = useContext(QuantumContext);
  if (!ctx) throw new Error('useQuantum must be used within QuantumProvider');
  return ctx;
};
