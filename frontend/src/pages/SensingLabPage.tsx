import React, { useState } from 'react';
import {
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Activity,
  Zap
} from 'lucide-react';
import { simulateRamseyClient } from '../lib/quantum';
import { RamseySensingResult } from '../types/quantum';
import { useQuantum } from '../context/QuantumContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const SensingLabPage: React.FC = () => {
  const { addExperimentRun } = useQuantum();

  const [detuning, setDetuning] = useState<number>(2.0); // MHz
  const [duration, setDuration] = useState<number>(250.0); // ns
  const [atoms, setAtoms] = useState<number>(200);
  const [sensingResult, setSensingResult] = useState<RamseySensingResult | null>(() =>
    simulateRamseyClient(2.0, 250.0, 200)
  );

  const handleSimulate = () => {
    const res = simulateRamseyClient(detuning, duration, atoms);
    setSensingResult(res);
    addExperimentRun({
      experimentId: 'exp-sensing',
      title: 'Ramsey Quantum Sensing Metrology',
      parameters: { detuning, duration, atoms },
      summary: `Phase: ${res.accumulated_phase_rad} rad. SQL: ${res.standard_quantum_limit}, Heisenberg: ${res.heisenberg_limit}. Advantage: ${res.quantum_advantage_ratio}x.`
    });
  };

  // Generate comparison data points for scaling chart: N from 10 to 1000
  const scalingData = [10, 50, 100, 200, 500, 1000].map((n) => ({
    N: n,
    SQL: parseFloat((1 / Math.sqrt(n)).toFixed(4)),
    Heisenberg: parseFloat((1 / n).toFixed(4)),
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-sky-950/60 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Quantum Sensing & Metrology Lab
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Numerical simulations of Ramsey interferometry and atomic phase sensitivity comparing the Standard Quantum Limit against the ultimate Heisenberg limit.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Interferometer Controls
          </h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Detuning Frequency Δ:</span>
              <span className="font-mono text-cyan-400">{detuning} MHz</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={detuning}
              onChange={(e) => setDetuning(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Proportional to external magnetic / RF field
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Interaction Time τ:</span>
              <span className="font-mono text-cyan-400">{duration} ns</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Free precession duration</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Sensor Atom Ensemble (N):</span>
              <span className="font-mono text-cyan-400">{atoms}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={atoms}
              onChange={(e) => setAtoms(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSimulate}
            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Compute Interferometric Phase</span>
          </button>
        </div>

        {/* Results Readout & Metric Cards */}
        <div className="lg:col-span-2 space-y-4">
          {sensingResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Accumulated Phase
                  </span>
                  <span className="font-mono text-base font-bold text-cyan-400">
                    {sensingResult.accumulated_phase_rad} rad
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    φ = 2πΔτ
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Transition Prob P(1)
                  </span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    {(sensingResult.prob_excited_p1 * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    sin²(φ/2)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Standard Quantum Limit
                  </span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {sensingResult.standard_quantum_limit}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Δφ_SQL = 1/√N
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Heisenberg Limit
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {sensingResult.heisenberg_limit}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Δφ_HL = 1/N ({sensingResult.quantum_advantage_ratio}x boost)
                  </span>
                </div>
              </div>

              {/* Sensitivity Scaling Chart */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Phase Uncertainty: Classical Shot-Noise Limit vs. Quantum Heisenberg Limit
                </h4>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={scalingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="N" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="SQL"
                        name="Classical SQL (1/√N)"
                        stroke="#94a3b8"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Heisenberg"
                        name="Quantum Heisenberg Limit (1/N)"
                        stroke="#38bdf8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sensor Modalities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase">NV-Center Magnetometers</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nitrogen-vacancy defects in synthetic diamond crystals act as isolated spin triplets operating at room temperature, sensing nanotesla magnetic fields.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase">Optical Atomic Clocks</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strontium and ytterbium optical lattice clocks reach fractional frequency uncertainties below 10⁻¹⁸, losing less than one second in 30 billion years.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase">Cold Atom Gravimeters</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Laser-cooled rubidium clouds dropped in high vacuum undergo atom interferometry to measure local gravitational acceleration g with microgal precision.
          </p>
        </div>
      </div>
    </div>
  );
};
