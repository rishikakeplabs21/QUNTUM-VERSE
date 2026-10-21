import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Send,
  Award,
  AlertCircle,
  Plus,
  BookOpen
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  description: string;
}

export const ClassroomPage: React.FC = () => {
  const { activeRole, setActiveRole } = useQuantum();

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'asg-1',
      title: 'Lab 1: Superposition & Statevector Verification',
      dueDate: 'Monday, 23:59 IST',
      points: 100,
      status: 'submitted',
      score: 96,
      description: 'Prepare the state |+⟩ using Hadamard gate on Q0. Verify analytical statevector and compare with 1,024 shot measurements.'
    },
    {
      id: 'asg-2',
      title: 'Lab 2: Bell State Entanglement & Non-Locality',
      dueDate: 'Oct 30, 23:59 IST',
      points: 100,
      status: 'pending',
      description: 'Construct the circuit for |Φ+⟩ = (|00⟩+|11⟩)/√2. Demonstrate that joint measurement outcomes 01 and 10 have zero probability.'
    },
    {
      id: 'asg-3',
      title: 'Lab 3: BB84 Quantum Key Distribution Simulation',
      dueDate: 'Nov 05, 23:59 IST',
      points: 100,
      status: 'pending',
      description: 'Run the BB84 protocol with and without Eve. Calculate the Quantum Bit Error Rate (QBER) and evaluate channel security.'
    }
  ]);

  const [selectedAsg, setSelectedAsg] = useState<Assignment>(assignments[1]);
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAsg.id
          ? { ...a, status: 'submitted', score: 95 }
          : a
      )
    );
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              QuantumVerse Academic Classroom
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Course assignments, virtual lab submissions, and peer assessments for undergraduate engineering cohorts.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveRole('student')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeRole === 'student'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student View
          </button>
          <button
            onClick={() => setActiveRole('faculty')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeRole === 'faculty'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faculty View
          </button>
        </div>
      </div>

      {/* Local Prototype Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Institutional Preview:</strong> Operating in local academic demo mode. Institutional Single Sign-On (SSO) and LDAP integration will connect in the next phase.
          </span>
        </div>
        <span className="font-mono text-cyan-400 text-[11px]">Academic Pilot</span>
      </div>

      {/* Course Overview Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-900 border border-sky-800/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            QE-301 • 4 Credits
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> 42 Enrolled Engineering Fellows
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Quantum Computing & Information for Engineers
        </h2>
        <p className="text-xs text-slate-300">
          Faculty Instructor: <strong>Dr. A. Sharma (Quantum Systems Lab)</strong> • Department of Electrical & Quantum Engineering, KEP Institute of Advanced Technology.
        </p>
      </div>

      {/* Student View Workspace */}
      {activeRole === 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment List */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Assigned Lab Practicals
            </h3>
            <div className="space-y-2">
              {assignments.map((asg) => {
                const isSelected = asg.id === selectedAsg.id;
                return (
                  <button
                    key={asg.id}
                    onClick={() => setSelectedAsg(asg)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{asg.title}</span>
                      {asg.status === 'graded' || asg.status === 'submitted' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                          {asg.score}/100
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400">Due Soon</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Due: {asg.dueDate}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Pane */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedAsg.title}</h3>
                <span className="text-xs text-slate-400">Due: {selectedAsg.dueDate} • {selectedAsg.points} Points</span>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                  selectedAsg.status === 'submitted'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                }`}
              >
                {selectedAsg.status === 'submitted' ? 'Submitted & Graded' : 'Action Required'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedAsg.description}
            </p>

            {selectedAsg.status === 'submitted' ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Lab Report Evaluated: {selectedAsg.score}/100 Marks Awarded</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <strong>Instructor Feedback:</strong> "Theoretical Born rule distribution matched the 1024 shot measurements within 1σ confidence interval. Clean circuit synthesis."
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Lab Notes & Analytical Observations:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter your calculation steps, circuit wire description, or measurement findings..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Linked to student session ID: <code>rishikaa-qe301-2026</code>
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Lab Assignment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Faculty View */
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Enrolled Cohort</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">42</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Submissions Received</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">39 / 42</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Cohort Average Score</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">94.2%</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Student Submissions Roster
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Roll No.</th>
                    <th className="py-2">Assignment</th>
                    <th className="py-2">Submission Date</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-white">Rishikaa (You)</td>
                    <td className="py-2.5 text-slate-400">QE-2026-042</td>
                    <td className="py-2.5 text-cyan-300">Lab 1: Superposition</td>
                    <td className="py-2.5 text-slate-400">Oct 21, 10:14 IST</td>
                    <td className="py-2.5 text-emerald-400 font-semibold">Evaluated</td>
                    <td className="py-2.5 font-bold text-amber-400">96 / 100</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-slate-300">Aarav Mehta</td>
                    <td className="py-2.5 text-slate-400">QE-2026-018</td>
                    <td className="py-2.5 text-cyan-300">Lab 1: Superposition</td>
                    <td className="py-2.5 text-slate-400">Oct 20, 21:05 IST</td>
                    <td className="py-2.5 text-emerald-400 font-semibold">Evaluated</td>
                    <td className="py-2.5 font-bold text-amber-400">92 / 100</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-slate-300">Pooja Venkatesh</td>
                    <td className="py-2.5 text-slate-400">QE-2026-029</td>
                    <td className="py-2.5 text-cyan-300">Lab 1: Superposition</td>
                    <td className="py-2.5 text-slate-400">Oct 21, 08:30 IST</td>
                    <td className="py-2.5 text-emerald-400 font-semibold">Evaluated</td>
                    <td className="py-2.5 font-bold text-amber-400">98 / 100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
