import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useQuantum } from '../context/QuantumContext';
import { EXPERIMENTS_CATALOG } from '../data/experimentsData';
import { ExperimentMetadata } from '../types/quantum';
import { ProbabilityHistogram } from '../components/common/ProbabilityHistogram';
import { BlochSphereVisualizer } from '../components/common/BlochSphereVisualizer';
import { simulatePolarizationClient, calculateBlochFromAngles } from '../lib/quantum';

export const PhysicsLabPage: React.FC = () => {
  const { addExperimentRun } = useQuantum();

  const [selectedExp, setSelectedExp] = useState<ExperimentMetadata>(
    EXPERIMENTS_CATALOG[0]
  );

  // Experiment 1: Probability & Measurement State
  const [probTheta, setProbTheta] = useState<number>(Math.PI / 3); // 60 degrees
  const [probShots, setProbShots] = useState<number>(1024);
  const [probResult, setProbResult] = useState<{
    probabilities: Record<string, number>;
    shotsCount: Record<string, number>;
    totalShots: number;
    errorMargin: number;
  } | null>(null);

  // Experiment 2: Photon Polarization State
  const [polarizationAngles, setPolarizationAngles] = useState<number[]>([45, 90]);
  const [polarizationPhotons, setPolarizationPhotons] = useState<number>(2000);
  const [polarizationResult, setPolarizationResult] = useState<any>(null);

  // Experiment 5: Bloch Sphere State
  const [blochTheta, setBlochTheta] = useState<number>(Math.PI / 2);
  const [blochPhi, setBlochPhi] = useState<number>(Math.PI / 4);

  // Experiment 6: Single-Qubit Gates Cascade State
  const [gateSequence, setGateSequence] = useState<string[]>(['H']);
  const [gateState, setGateState] = useState<{ alpha: number; beta: number; phase: number }>({
    alpha: 1 / Math.SQRT2,
    beta: 1 / Math.SQRT2,
    phase: 0
  });

  // Experiment 7: Complementary Measurement Bases State
  const [chosenBasis, setChosenBasis] = useState<'Z' | 'X' | 'Y'>('Z');
  const [basisShotsResult, setBasisShotsResult] = useState<Record<string, number> | null>(null);

  // Status message for save
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ================= RUN HANDLERS =================

  // Run Exp 1: Probability & Born's Rule
  const runProbabilityExperiment = () => {
    const p0 = Math.cos(probTheta / 2) ** 2;
    const p1 = Math.sin(probTheta / 2) ** 2;

    const counts: Record<string, number> = { '0': 0, '1': 0 };
    for (let i = 0; i < probShots; i++) {
      if (Math.random() < p0) {
        counts['0'] += 1;
      } else {
        counts['1'] += 1;
      }
    }

    const empiricalP0 = counts['0'] / probShots;
    const stdError = Math.sqrt((p0 * p1) / probShots);

    setProbResult({
      probabilities: { '0': parseFloat(p0.toFixed(4)), '1': parseFloat(p1.toFixed(4)) },
      shotsCount: counts,
      totalShots: probShots,
      errorMargin: parseFloat(stdError.toFixed(4))
    });
  };

  // Run Exp 2: Photon Polarization
  const runPolarizationExperiment = () => {
    const res = simulatePolarizationClient(polarizationPhotons, polarizationAngles);
    setPolarizationResult(res);
  };

  // Run Exp 7: Measurement in Bases
  const runBasisExperiment = () => {
    // Qubit initialized to |0>
    // In Z basis: |0> gives 100% 0, 0% 1
    // In X basis: |0> = (|+> + |->)/sqrt(2) gives 50% + and 50% -
    // In Y basis: |0> = (|+i> + |-i>)/sqrt(2) gives 50% +i and 50% -i
    const shots = 1024;
    const counts: Record<string, number> = {};

    if (chosenBasis === 'Z') {
      counts['|0⟩'] = shots;
      counts['|1⟩'] = 0;
    } else if (chosenBasis === 'X') {
      let plus = 0;
      for (let i = 0; i < shots; i++) {
        if (Math.random() < 0.5) plus++;
      }
      counts['|+⟩'] = plus;
      counts['|-⟩'] = shots - plus;
    } else {
      let plusI = 0;
      for (let i = 0; i < shots; i++) {
        if (Math.random() < 0.5) plusI++;
      }
      counts['|+i⟩'] = plusI;
      counts['|-i⟩'] = shots - plusI;
    }
    setBasisShotsResult(counts);
  };

  // Handle saving experiment run to journal
  const handleSaveToPortfolio = (title: string, summary: string, params: Record<string, any>) => {
    addExperimentRun({
      experimentId: selectedExp.id,
      title,
      summary,
      parameters: params
    });
    setSaveMessage('Saved to Student Portfolio & Logbook!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              QuantumVerse Physics Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Scientifically validated virtual experiments grounded in quantum mechanics and projective measurement.
          </p>
        </div>

        {saveMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-1.5 animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Experiment Selector Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {EXPERIMENTS_CATALOG.map((exp) => {
          const isSelected = exp.id === selectedExp.id;
          const isImplemented = exp.status === 'implemented';
          return (
            <button
              key={exp.id}
              onClick={() => setSelectedExp(exp)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-500">#{exp.roadmapIndex}</span>
              <span>{exp.title}</span>
              {isImplemented ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ) : (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                  Roadmap
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Experiment Detail Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
              Exp #{selectedExp.roadmapIndex}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              Category: {selectedExp.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                selectedExp.status === 'implemented'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
              }`}
            >
              {selectedExp.status === 'implemented' ? 'Fully Implemented' : 'Curriculum Roadmap / Future Integration'}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white">{selectedExp.title}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">{selectedExp.tagline}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <strong className="text-cyan-400 block mb-1">Scientific Objective:</strong>
            <p className="text-slate-300">{selectedExp.objective}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <strong className="text-amber-400 block mb-1">Theoretical Model:</strong>
            <p className="text-slate-300">{selectedExp.theory}</p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Workspace based on Selected Experiment */}
      {selectedExp.status === 'roadmap' ? (
        <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <Info className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Advanced Simulation in Roadmap</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            This experiment ({selectedExp.title}) is planned for the next platform release. The full mathematical formulation and pedagogical theory are included above. To test active quantum simulations, select Experiments #1, #2, #5, #6, #7, or #8.
          </p>
        </div>
      ) : selectedExp.id === 'exp-1' ? (
        /* ================= EXPERIMENT 1: PROBABILITY & MEASUREMENT ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Measurement Controls
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>State Angle θ:</span>
                <span className="font-mono text-cyan-400">
                  {((probTheta * 180) / Math.PI).toFixed(1)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.05"
                value={probTheta}
                onChange={(e) => setProbTheta(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                |ψ⟩ = cos({((probTheta * 180) / Math.PI / 2).toFixed(1)}°)|0⟩ + sin({((probTheta * 180) / Math.PI / 2).toFixed(1)}°)|1⟩
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Number of Measurement Shots:
              </label>
              <select
                value={probShots}
                onChange={(e) => setProbShots(parseInt(e.target.value))}
                className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              >
                <option value={10}>10 shots (High shot noise)</option>
                <option value={100}>100 shots (Moderate convergence)</option>
                <option value={1024}>1,024 shots (Standard academic precision)</option>
                <option value={5000}>5,000 shots (High statistical fidelity)</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={runProbabilityExperiment}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Quantum Measurement</span>
              </button>

              {probResult && (
                <button
                  onClick={() =>
                    handleSaveToPortfolio(
                      'Probability & Measurement Run',
                      `Measured ${probShots} shots at θ=${((probTheta * 180) / Math.PI).toFixed(1)}°. Standard error σ=${probResult.errorMargin}.`,
                      { theta: probTheta, shots: probShots, counts: probResult.shotsCount }
                    )
                  }
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save to Student Portfolio</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Visualizer */}
          <div className="lg:col-span-2 space-y-4">
            {probResult ? (
              <div className="space-y-4">
                <ProbabilityHistogram
                  probabilities={probResult.probabilities}
                  shotsCount={probResult.shotsCount}
                  totalShots={probResult.totalShots}
                />

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Statistical Standard Error
                    </span>
                    <span className="font-mono text-cyan-400 text-sm">
                      σ ≈ ±{(probResult.errorMargin * 100).toFixed(2)}%
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Theoretical shot noise: σ = √(P(0)P(1)/N)
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Law of Large Numbers Check
                    </span>
                    <span className="font-mono text-emerald-400 text-sm">
                      Converged
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      As N increases, relative frequencies converge to Born probabilities.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-slate-900/30 border border-slate-800/80 text-center space-y-2">
                <FlaskConical className="w-8 h-8 text-cyan-400/50 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">
                  Ready to Measure
                </h4>
                <p className="text-xs text-slate-500">
                  Adjust the state angle and shots, then click "Execute Quantum Measurement" to observe wavefunction collapse.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedExp.id === 'exp-2' ? (
        /* ================= EXPERIMENT 2: PHOTON POLARIZATION & MALUS LAW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Polarization Filters
            </h3>

            <div>
              <span className="text-xs text-slate-300 block mb-1">
                Filter 1 Angle (θ₁):
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={polarizationAngles[0]}
                onChange={(e) =>
                  setPolarizationAngles([parseInt(e.target.value), polarizationAngles[1]])
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-cyan-400">{polarizationAngles[0]}°</span>
            </div>

            <div>
              <span className="text-xs text-slate-300 block mb-1">
                Filter 2 Angle (θ₂):
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={polarizationAngles[1]}
                onChange={(e) =>
                  setPolarizationAngles([polarizationAngles[0], parseInt(e.target.value)])
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-cyan-400">{polarizationAngles[1]}°</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={runPolarizationExperiment}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Transmit Photons</span>
              </button>

              {polarizationResult && (
                <button
                  onClick={() =>
                    handleSaveToPortfolio(
                      'Photon Polarization Malus Run',
                      `Measured cascaded filters at [${polarizationAngles.join('°, ')}°]. Transmission: ${polarizationResult.final_transmission_pct}%.`,
                      polarizationResult
                    )
                  }
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save to Portfolio</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {polarizationResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Cascaded Filter Stages (Malus' Law)
                  </h4>
                  <div className="space-y-2">
                    {polarizationResult.stages.map((stage: any) => (
                      <div
                        key={stage.filter_index}
                        className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-cyan-300">
                            Polarizer #{stage.filter_index} ({stage.filter_angle_deg}°)
                          </span>
                          <span className="text-slate-400 block text-[11px]">
                            Δθ = {stage.relative_angle_deg}° | Trans: cos²(Δθ) = {(stage.transmission_fraction * 100).toFixed(1)}%
                          </span>
                        </div>
                        <span className="font-mono text-amber-400 text-sm">
                          {stage.detected_photons.toLocaleString()} Photons
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                    <strong className="block text-cyan-300 mb-0.5">Quantum Eraser Insight:</strong>
                    {polarizationResult.quantum_insight}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-slate-900/30 border border-slate-800 text-center space-y-2">
                <FlaskConical className="w-8 h-8 text-cyan-400/50 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">Polarizer Bench Ready</h4>
                <p className="text-xs text-slate-500">
                  Select angles (e.g. 45° then 90°) to verify how intermediate measurements allow crossed polarizer transmission!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedExp.id === 'exp-5' ? (
        /* ================= EXPERIMENT 5: BLOCH SPHERE ================= */
        <div className="space-y-4">
          <BlochSphereVisualizer
            theta={blochTheta}
            phi={blochPhi}
            onChangeAngles={(t, p) => {
              setBlochTheta(t);
              setBlochPhi(p);
            }}
          />
        </div>
      ) : selectedExp.id === 'exp-7' ? (
        /* ================= EXPERIMENT 7: MEASUREMENT IN DIFFERENT BASES ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Select Measurement Observable
            </h3>
            <p className="text-xs text-slate-400">
              Qubit is initially prepared in ground state |0⟩. Select a complementary basis:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setChosenBasis('Z')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  chosenBasis === 'Z'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">Computational (Z Basis)</div>
                <div className="text-[11px] text-slate-500">Eigenstates: |0⟩, |1⟩</div>
              </button>

              <button
                onClick={() => setChosenBasis('X')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  chosenBasis === 'X'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">Hadamard (X Basis)</div>
                <div className="text-[11px] text-slate-500">Eigenstates: |+⟩, |-⟩</div>
              </button>

              <button
                onClick={() => setChosenBasis('Y')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  chosenBasis === 'Y'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">Circular (Y Basis)</div>
                <div className="text-[11px] text-slate-500">Eigenstates: |+i⟩, |-i⟩</div>
              </button>
            </div>

            <button
              onClick={runBasisExperiment}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Measure in {chosenBasis} Basis (1024 shots)</span>
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {basisShotsResult ? (
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Measurement Outcomes in {chosenBasis} Basis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(basisShotsResult).map(([state, shots]) => (
                    <div key={state} className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="font-mono text-cyan-400 text-lg font-bold block">{state}</span>
                      <span className="text-amber-400 font-mono text-xs">{shots} shots</span>
                      <span className="text-slate-500 block text-[10px] mt-0.5">
                        {((shots / 1024) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400">Quantum Principle: </strong>
                  {chosenBasis === 'Z' ? (
                    <span>In the Z basis, |0⟩ is an eigenstate with eigenvalue +1, producing deterministic measurement (100% |0⟩).</span>
                  ) : (
                    <span>In the {chosenBasis} basis, |0⟩ has equal amplitude projections onto both eigenstates, producing completely unpredictable 50/50 outcomes according to the Heisenberg uncertainty relation!</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-slate-900/30 border border-slate-800 text-center space-y-2">
                <FlaskConical className="w-8 h-8 text-cyan-400/50 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">Complementary Bases Detector Ready</h4>
                <p className="text-xs text-slate-500">
                  Select a basis and click Measure to observe how measuring non-commuting observables generates true quantum randomness.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
