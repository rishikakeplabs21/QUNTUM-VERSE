import React, { useState, useEffect } from 'react';
import {
  Binary,
  Play,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Code2,
  BarChart3,
  CheckCircle,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { GateStep, GateType, SimulationResult } from '../types/quantum';
import { runCircuitSimulation } from '../lib/quantum';
import { ProbabilityHistogram } from '../components/common/ProbabilityHistogram';

const AVAILABLE_GATES: { type: GateType; label: string; desc: string; color: string }[] = [
  { type: 'H', label: 'H', desc: 'Hadamard (Superposition)', color: 'bg-cyan-600 text-white' },
  { type: 'X', label: 'X', desc: 'Pauli-X (NOT / Bit Flip)', color: 'bg-emerald-600 text-white' },
  { type: 'Y', label: 'Y', desc: 'Pauli-Y (Bit & Phase Flip)', color: 'bg-teal-600 text-white' },
  { type: 'Z', label: 'Z', desc: 'Pauli-Z (Phase Flip)', color: 'bg-indigo-600 text-white' },
  { type: 'S', label: 'S', desc: 'Phase Gate (π/2)', color: 'bg-blue-600 text-white' },
  { type: 'T', label: 'T', desc: 'π/4 Rotation Gate', color: 'bg-purple-600 text-white' },
  { type: 'CNOT', label: 'CX', desc: 'Controlled-NOT (Entangler)', color: 'bg-amber-600 text-white' },
  { type: 'MEASURE', label: 'M', desc: 'Computational Basis Measurement', color: 'bg-rose-700 text-white' },
];

export const CircuitStudioPage: React.FC = () => {
  const { saveCircuit, addExperimentRun } = useQuantum();

  const [numQubits, setNumQubits] = useState<number>(2);
  const [gates, setGates] = useState<GateStep[]>([
    { id: 'g-h0', gate: 'H', target: 0, stepIndex: 0 },
    { id: 'g-cx01', gate: 'CNOT', control: 0, target: 1, stepIndex: 1 }
  ]);
  const [selectedGateType, setSelectedGateType] = useState<GateType>('H');
  const [cnotControl, setCnotControl] = useState<number>(0);
  const [shots, setShots] = useState<number>(1024);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'statevector' | 'qiskit'>('visual');
  const [circuitName, setCircuitName] = useState<string>('My Quantum Circuit');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Maximum time step slots on the wire grid
  const MAX_STEPS = 6;

  // Run simulation whenever circuit gates change or on mount
  useEffect(() => {
    executeSimulation();
  }, [numQubits, gates, shots]);

  const executeSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await runCircuitSimulation(numQubits, gates, shots);
      setSimResult(result);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Add gate to wire at step index
  const handleCellClick = (qubitIdx: number, stepIdx: number) => {
    // If gate already exists at this exact slot, remove it
    const existingIdx = gates.findIndex(
      (g) => (g.target === qubitIdx || g.control === qubitIdx) && g.stepIndex === stepIdx
    );

    if (existingIdx !== -1) {
      setGates(gates.filter((_, idx) => idx !== existingIdx));
      return;
    }

    // Add gate
    if (selectedGateType === 'CNOT') {
      const ctrl = qubitIdx === 0 ? 0 : qubitIdx - 1;
      const tgt = qubitIdx === 0 ? 1 : qubitIdx;
      const newGate: GateStep = {
        id: `gate-${Date.now()}`,
        gate: 'CNOT',
        control: ctrl,
        target: tgt,
        stepIndex: stepIdx
      };
      setGates([...gates, newGate]);
    } else {
      const newGate: GateStep = {
        id: `gate-${Date.now()}`,
        gate: selectedGateType,
        target: qubitIdx,
        stepIndex: stepIdx
      };
      setGates([...gates, newGate]);
    }
  };

  const handleResetCircuit = () => {
    setGates([]);
  };

  // Apply Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'bell') {
      setNumQubits(2);
      setGates([
        { id: 'g1', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'g2', gate: 'CNOT', control: 0, target: 1, stepIndex: 1 }
      ]);
      setCircuitName('Bell State |Φ+⟩');
    } else if (presetName === 'ghz') {
      setNumQubits(3);
      setGates([
        { id: 'g1', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'g2', gate: 'CNOT', control: 0, target: 1, stepIndex: 1 },
        { id: 'g3', gate: 'CNOT', control: 1, target: 2, stepIndex: 2 }
      ]);
      setCircuitName('3-Qubit GHZ State');
    } else if (presetName === 'superposition') {
      setGates(
        Array.from({ length: numQubits }, (_, q) => ({
          id: `h-${q}`,
          gate: 'H',
          target: q,
          stepIndex: 0
        }))
      );
      setCircuitName('Equal Superposition All Qubits');
    }
  };

  const handleSaveCircuit = () => {
    saveCircuit(circuitName, numQubits, gates);
    addExperimentRun({
      experimentId: 'exp-circuit',
      title: `Circuit: ${circuitName}`,
      parameters: { numQubits, gatesCount: gates.length },
      summary: `Synthesized circuit with ${gates.length} gates across ${numQubits} qubits.`
    });
    setStatusMsg('Saved circuit to Portfolio!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Generate Python Qiskit code
  const generateQiskitCode = () => {
    let code = `from qiskit import QuantumCircuit, Aer, execute\n\n`;
    code += `# Initialize ${numQubits}-qubit quantum circuit\n`;
    code += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;

    const sorted = [...gates].sort((a, b) => a.stepIndex - b.stepIndex);
    for (const g of sorted) {
      if (g.gate === 'H') code += `qc.h(${g.target})\n`;
      else if (g.gate === 'X') code += `qc.x(${g.target})\n`;
      else if (g.gate === 'Y') code += `qc.y(${g.target})\n`;
      else if (g.gate === 'Z') code += `qc.z(${g.target})\n`;
      else if (g.gate === 'S') code += `qc.s(${g.target})\n`;
      else if (g.gate === 'T') code += `qc.t(${g.target})\n`;
      else if (g.gate === 'CNOT') code += `qc.cx(${g.control}, ${g.target})\n`;
      else if (g.gate === 'MEASURE') code += `qc.measure(${g.target}, ${g.target})\n`;
    }

    code += `\n# Execute on Statevector Simulator\n`;
    code += `backend = Aer.get_backend('statevector_simulator')\n`;
    code += `job = execute(qc, backend, shots=${shots})\n`;
    code += `result = job.result()\n`;
    code += `print("Statevector:", result.get_statevector())\n`;
    code += `print("Counts:", result.get_counts(qc))\n`;
    return code;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Binary className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Quantum Circuit Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Interactive multi-qubit visual circuit workspace with real-time statevector evolution and Born rule shot sampling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {statusMsg && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium mr-2">
              <CheckCircle className="w-3.5 h-3.5" /> {statusMsg}
            </span>
          )}
          <button
            onClick={handleSaveCircuit}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Circuit</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons & Wire Config */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold uppercase">Presets:</span>
          <button
            onClick={() => applyPreset('bell')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Bell State |Φ+⟩
          </button>
          <button
            onClick={() => applyPreset('ghz')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            3-Qubit GHZ
          </button>
          <button
            onClick={() => applyPreset('superposition')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Equal Superposition
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Qubits:</span>
            <select
              value={numQubits}
              onChange={(e) => setNumQubits(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1"
            >
              <option value={1}>1 Qubit</option>
              <option value={2}>2 Qubits</option>
              <option value={3}>3 Qubits</option>
              <option value={4}>4 Qubits</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Shots:</span>
            <select
              value={shots}
              onChange={(e) => setShots(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1"
            >
              <option value={100}>100</option>
              <option value={1024}>1024</option>
              <option value={4096}>4096</option>
            </select>
          </div>

          <button
            onClick={handleResetCircuit}
            className="p-1.5 rounded bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors"
            title="Reset All Gates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gate Toolbox Palette */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Active Gate Tool (Click a slot on the wire to place):
        </span>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_GATES.map((g) => {
            const isSelected = selectedGateType === g.type;
            return (
              <button
                key={g.type}
                onClick={() => setSelectedGateType(g.type)}
                className={`px-3 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 border-transparent shadow-md'
                    : 'border-slate-700/80 hover:border-slate-500 text-slate-300 bg-slate-900/80'
                }`}
                title={g.desc}
              >
                <span className={`w-5 h-5 rounded flex items-center justify-center ${g.color}`}>
                  {g.label}
                </span>
                <span>{g.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Circuit Canvas (Wire Grid) */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
        <div className="min-w-[620px] space-y-6">
          {Array.from({ length: numQubits }, (_, qIdx) => (
            <div key={qIdx} className="flex items-center gap-4 relative">
              {/* Qubit Label */}
              <div className="w-14 shrink-0 flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                <span>q[{qIdx}]</span>
                <span className="text-slate-500 text-[10px]">|0⟩</span>
              </div>

              {/* Wire Line passing through center of cells */}
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-0 right-0 h-0.5 bg-slate-800 pointer-events-none" />

                {/* Time Step Slots */}
                <div className="w-full flex justify-between relative z-10">
                  {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                    const gateAtSlot = gates.find(
                      (g) =>
                        (g.target === qIdx || g.control === qIdx) &&
                        g.stepIndex === sIdx
                    );

                    let isControl = gateAtSlot?.gate === 'CNOT' && gateAtSlot.control === qIdx;
                    let isTarget = gateAtSlot?.gate === 'CNOT' && gateAtSlot.target === qIdx;

                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleCellClick(qIdx, sIdx)}
                        className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-all group ${
                          gateAtSlot
                            ? isControl
                              ? 'bg-amber-950 border-amber-600 text-amber-300'
                              : isTarget
                              ? 'bg-amber-600 border-amber-400 text-white font-bold'
                              : 'bg-cyan-600 border-cyan-400 text-white font-bold'
                            : 'bg-slate-900/90 border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/60'
                        }`}
                        title={
                          gateAtSlot
                            ? `Gate ${gateAtSlot.gate} (Click to remove)`
                            : `Click to place ${selectedGateType}`
                        }
                      >
                        {gateAtSlot ? (
                          isControl ? (
                            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                          ) : isTarget ? (
                            <span className="font-mono text-sm">⊕</span>
                          ) : (
                            <span className="font-mono text-xs font-bold">
                              {gateAtSlot.gate}
                            </span>
                          )
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs for Results, Statevector, and Qiskit code */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Measurement Histogram</span>
          </button>

          <button
            onClick={() => setActiveTab('statevector')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'statevector'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Statevector Details (2^{numQubits} Basis States)</span>
          </button>

          <button
            onClick={() => setActiveTab('qiskit')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'qiskit'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export to Qiskit (Python)</span>
          </button>
        </div>

        {/* Tab 1: Histogram */}
        {activeTab === 'visual' && simResult && (
          <ProbabilityHistogram
            probabilities={simResult.probabilities}
            shotsCount={simResult.shots_count}
            totalShots={simResult.total_shots}
            height={260}
          />
        )}

        {/* Tab 2: Statevector Table */}
        {activeTab === 'statevector' && simResult && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="pb-2">Computational Basis</th>
                  <th className="pb-2">Real Amplitude</th>
                  <th className="pb-2">Imag Amplitude</th>
                  <th className="pb-2">Magnitude |α|</th>
                  <th className="pb-2">Phase (deg)</th>
                  <th className="pb-2">Probability |α|²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {simResult.statevector.map((item) => (
                  <tr key={item.basis} className="hover:bg-slate-800/30">
                    <td className="py-2 font-bold text-cyan-400">{item.basis}</td>
                    <td className="py-2 text-slate-300">{item.real}</td>
                    <td className="py-2 text-slate-300">{item.imag}j</td>
                    <td className="py-2 text-amber-400 font-semibold">{item.magnitude}</td>
                    <td className="py-2 text-slate-400">{item.phase_deg}°</td>
                    <td className="py-2 text-emerald-400 font-bold">
                      {(item.probability * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Qiskit Code Export */}
        {activeTab === 'qiskit' && (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
              {generateQiskitCode()}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateQiskitCode());
                setStatusMsg('Copied Qiskit code to clipboard!');
                setTimeout(() => setStatusMsg(null), 3000);
              }}
              className="absolute top-3 right-3 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 font-medium border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
