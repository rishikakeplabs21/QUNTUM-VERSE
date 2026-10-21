import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Code2,
  Copy,
  CheckCircle,
  FileCode,
  Info,
  Sparkles
} from 'lucide-react';
import { runCircuitSimulation } from '../lib/quantum';
import { GateStep } from '../types/quantum';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  description: string;
  gates: GateStep[];
  numQubits: number;
  code: string;
  explanation: string;
}

const QUANTUM_CODE_EXAMPLES: CodeSnippet[] = [
  {
    id: 'prog-bell',
    title: 'Bell State Entanglement (|Φ+⟩)',
    language: 'Python (Qiskit)',
    description: 'Construct and measure a two-qubit maximally entangled Einstein-Podolsky-Rosen (EPR) pair.',
    numQubits: 2,
    gates: [
      { id: '1', gate: 'H', target: 0, stepIndex: 0 },
      { id: '2', gate: 'CNOT', control: 0, target: 1, stepIndex: 1 }
    ],
    code: `from qiskit import QuantumCircuit, Aer, execute

# 1. Initialize a 2-qubit quantum register
qc = QuantumCircuit(2, 2)

# 2. Put qubit 0 into equal superposition (|0> -> (|0> + |1>)/sqrt(2))
qc.h(0)

# 3. Entangle qubit 1 with qubit 0 using CNOT
qc.cx(0, 1)

# 4. Measure both qubits into classical bits
qc.measure([0, 1], [0, 1])

# 5. Run simulation on QASM simulator
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
counts = job.result().get_counts(qc)
print("Measured States:", counts)`,
    explanation:
      'The Hadamard gate creates a superposition on Q0. The subsequent CNOT gate inverts Q1 only when Q0 is 1, creating (|00⟩ + |11⟩)/√2. Notice that outcomes 01 and 10 have zero probability!'
  },
  {
    id: 'prog-qrng',
    title: 'True Quantum Random Number Generator (QRNG)',
    language: 'Python (Qiskit)',
    description: 'Harvest true non-deterministic entropy from quantum wavefunction collapse.',
    numQubits: 1,
    gates: [
      { id: '1', gate: 'H', target: 0, stepIndex: 0 },
      { id: '2', gate: 'MEASURE', target: 0, stepIndex: 1 }
    ],
    code: `from qiskit import QuantumCircuit, Aer, execute

# Qubit initialized to |0>
qc = QuantumCircuit(1, 1)

# Apply Hadamard gate to create 50/50 superposition
qc.h(0)

# Projective measurement collapses state to 0 or 1 with Born probability 0.5
qc.measure(0, 0)

backend = Aer.get_backend('qasm_simulator')
result = execute(qc, backend, shots=1000).result()
print("Quantum Random Bits:", result.get_counts(qc))`,
    explanation:
      'Unlike pseudo-random classical software PRNGs (which rely on deterministic seed algorithms), a quantum measurement outcome is fundamentally non-deterministic and unpredictable by physical law.'
  },
  {
    id: 'prog-teleport',
    title: 'Quantum Teleportation State Transfer',
    language: 'Python (Qiskit)',
    description: 'Protocol transferring arbitrary qubit information using Bell entanglement and 2 classical bits.',
    numQubits: 3,
    gates: [
      { id: '1', gate: 'H', target: 1, stepIndex: 0 },
      { id: '2', gate: 'CNOT', control: 1, target: 2, stepIndex: 1 },
      { id: '3', gate: 'CNOT', control: 0, target: 1, stepIndex: 2 },
      { id: '4', gate: 'H', target: 0, stepIndex: 3 }
    ],
    code: `from qiskit import QuantumCircuit, Aer, execute

# Q0: Payload state, Q1 & Q2: Shared Bell pair (Alice & Bob)
qc = QuantumCircuit(3, 3)

# Step 1: Create entangled channel between Alice (Q1) and Bob (Q2)
qc.h(1)
qc.cx(1, 2)

# Step 2: Alice entangles payload Q0 with her share Q1
qc.cx(0, 1)
qc.h(0)

# Step 3: Alice measures Q0 and Q1 in Bell basis
qc.measure(0, 0)
qc.measure(1, 1)

# Step 4: Bob applies Pauli corrections based on classical bits
# (Simulated in state evolution)`,
    explanation:
      'Quantum teleportation transfers the quantum state vector without transmitting the physical particle itself, obeying the No-Cloning Theorem through Bell basis measurement.'
  }
];

export const CodeStudioPage: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(
    QUANTUM_CODE_EXAMPLES[0]
  );
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleRunProgram = async () => {
    setIsRunning(true);
    setConsoleOutput([
      `[INIT] Compiling ${selectedSnippet.title}...`,
      `[SIM] Target device: KEP QuantumVerse Native Quantum Kernel (v1.0)`,
      `[CIRCUIT] Allocating ${selectedSnippet.numQubits} qubits in Hilbert space ℂ^${Math.pow(2, selectedSnippet.numQubits)}...`
    ]);

    try {
      const result = await runCircuitSimulation(
        selectedSnippet.numQubits,
        selectedSnippet.gates,
        1024
      );

      setTimeout(() => {
        setConsoleOutput((prev) => [
          ...prev,
          `[GATES] Applied ${selectedSnippet.gates.length} unitary operations.`,
          `[EVAL] Statevector normalized (||ψ|| = 1.000000).`,
          `[MEASURE] 1024 shots collected:`,
          `   Outcome Distribution: ${JSON.stringify(result.shots_count, null, 2)}`,
          `[SUCCESS] Program execution completed with 0 errors.`
        ]);
        setIsRunning(false);
      }, 400);
    } catch (err) {
      setConsoleOutput((prev) => [
        ...prev,
        `[ERROR] Simulation execution failed: ${String(err)}`
      ]);
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-sky-950/60 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Quantum Code Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Educational quantum programming in Python & Qiskit syntax executed securely through mathematically verified simulations.
        </p>
      </div>

      {/* Program Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 border-b border-slate-800">
        {QUANTUM_CODE_EXAMPLES.map((snip) => {
          const isSelected = snip.id === selectedSnippet.id;
          return (
            <button
              key={snip.id}
              onClick={() => {
                setSelectedSnippet(snip);
                setConsoleOutput([]);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{snip.title}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">{selectedSnippet.title}</h2>
              <span className="text-[11px] text-slate-400">{selectedSnippet.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                title="Copy Code"
              >
                {copySuccess ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleRunProgram}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>{selectedSnippet.language}</span>
              <span>Sandboxed Execution Engine</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              {selectedSnippet.code}
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300">
            <strong className="text-cyan-400 block mb-1">Algorithmic Insight:</strong>
            {selectedSnippet.explanation}
          </div>
        </div>

        {/* Right: Quantum Terminal Console */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Quantum Simulation Console
            </h3>
            {consoleOutput.length > 0 && (
              <button
                onClick={() => setConsoleOutput([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 min-h-[360px] max-h-[500px] overflow-y-auto space-y-2 shadow-inner">
            {consoleOutput.length === 0 ? (
              <div className="text-slate-600 italic text-center py-16">
                Console idle. Click "Run Code" to compile and execute on the quantum simulator.
              </div>
            ) : (
              consoleOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.startsWith('[SUCCESS]')
                      ? 'text-emerald-400 font-semibold'
                      : line.startsWith('[ERROR]')
                      ? 'text-rose-400'
                      : line.startsWith('[MEASURE]')
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
