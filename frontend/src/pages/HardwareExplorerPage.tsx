import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Thermometer,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface CryoStage {
  temp: string;
  name: string;
  components: string[];
  description: string;
}

const CRYO_STAGES: CryoStage[] = [
  {
    temp: '300 K (Room Temp)',
    name: 'Room Temperature Flange',
    components: ['FPGA Pulse Generators', 'Arbitrary Waveform Generators (AWG)', 'DC Bias Sources'],
    description: 'Generates room-temperature microwave pulses (~5 GHz) and digital control clocks calibrated to nanosecond precision.'
  },
  {
    temp: '50 K',
    name: 'First Cryogenic Stage',
    components: ['Thermal Anchors', 'Stainless Steel Coaxial Lines', 'High-thermal-conductivity copper shields'],
    description: 'Intercepts incoming conduction heat along the wiring harnesses and reduces blackbody radiation.'
  },
  {
    temp: '4 K',
    name: 'Pulse Tube Cooler Stage',
    components: ['Liquid Helium Condensation Plate', 'HEMT Low-Noise Amplifiers', 'Attenuators (20 dB)'],
    description: 'Reaches the superconducting transition temperature for niobium. Amplifies faint microwave readout signals from the chip.'
  },
  {
    temp: '800 mK',
    name: 'Still Evaporation Plate',
    components: ['He-3 Vapor Separation', 'Thermal heat exchangers'],
    description: 'Maintains steady-state evaporative distillation of Helium-3 to power the continuous dilution cycle.'
  },
  {
    temp: '100 mK',
    name: 'Cold Plate',
    components: ['Sintered silver heat exchangers', 'Cryogenic microwave attenuators'],
    description: 'Pre-cools the concentrated Helium-3 before it enters the final dilution mixing chamber.'
  },
  {
    temp: '15 mK (-273.135 °C)',
    name: 'Mixing Chamber (Base Stage)',
    components: ['Superconducting QPU Chip Package', 'Josephson Junction Array', 'Dispersive Readout Cavities', 'Mu-metal Magnetic Shield'],
    description: 'Colder than deep interstellar space (2.7 K). Eliminates thermal excitation photons (k_B·T ≪ ℏω) so transmons remain stably in ground state |0⟩.'
  }
];

interface Architecture {
  name: string;
  company: string;
  qubitType: string;
  temp: string;
  coherenceT1: string;
  twoQubitFidelity: string;
  scalingChallenge: string;
}

const ARCHITECTURES: Architecture[] = [
  {
    name: 'Superconducting Transmon',
    company: 'IBM Quantum, Google Quantum AI, Rigetti',
    qubitType: 'Non-linear LC circuit with Josephson Junctions',
    temp: '~15 mK',
    coherenceT1: '50 - 300 µs',
    twoQubitFidelity: '99.5% - 99.8%',
    scalingChallenge: 'Cryogenic wiring bottlenecks & 2D nearest-neighbor coupling limitations.'
  },
  {
    name: 'Trapped Ions',
    company: 'IonQ, Quantinuum',
    qubitType: 'Hyperfine states in laser-trapped Ytterbium/Barium ions',
    temp: 'Room temp to 4 K',
    coherenceT1: '> 10 seconds to minutes',
    twoQubitFidelity: '99.8% - 99.9%',
    scalingChallenge: 'Laser shuttling speed, gate latency (~µs), and micro-trap array scaling.'
  },
  {
    name: 'Neutral Atoms',
    company: 'QuEra, Harvard, Pasqal',
    qubitType: 'Rydberg atom arrays trapped in optical tweezers',
    temp: '~10 µK (laser cooled)',
    coherenceT1: '~1 - 5 seconds',
    twoQubitFidelity: '99.5%',
    scalingChallenge: 'Atom recapture loss rate and real-time optical tweezer rearrangement.'
  },
  {
    name: 'Photonic Qubits',
    company: 'Xanadu, PsiQuantum',
    qubitType: 'Polarization or squeezed light states in optical waveguides',
    temp: 'Room temp (detectors at 4K)',
    coherenceT1: 'Nanoseconds (travels at speed of light)',
    twoQubitFidelity: '99.0% - 99.5%',
    scalingChallenge: 'Probabilistic photon entangling gates and optical switch loss.'
  },
  {
    name: 'Silicon Spin Qubits',
    company: 'Intel, UNSW, Diraq',
    qubitType: 'Single electron spin in semiconductor quantum dot',
    temp: '~1 K',
    coherenceT1: '1 - 100 ms',
    twoQubitFidelity: '99.0% - 99.6%',
    scalingChallenge: 'Extreme sensitivity to material defects and gate crosstalk in dense nanometer arrays.'
  }
];

export const HardwareExplorerPage: React.FC = () => {
  const [selectedCryoIndex, setSelectedCryoIndex] = useState<number>(5);

  const activeCryo = CRYO_STAGES[selectedCryoIndex];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-sky-950/60 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Quantum Hardware Explorer
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Comparative physical hardware architectures, dilution refrigeration thermodynamics, and control electronics engineering.
        </p>
      </div>

      {/* Dilution Refrigerator Interactive Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Interactive Cryostat Thermal Stages (Dilution Refrigerator)</span>
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/40">
            Selected: {activeCryo.temp}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vertical Refrigerator Diagram & Stage Selector */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Thermal Hierarchy (Warm to Base):
            </span>
            <div className="space-y-1.5">
              {CRYO_STAGES.map((stage, idx) => {
                const isSelected = idx === selectedCryoIndex;
                return (
                  <button
                    key={stage.temp}
                    onClick={() => setSelectedCryoIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-200 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-bold">{stage.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-400">{stage.temp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detailed Breakdown */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-900 border border-cyan-800/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Cryogenic Thermal Physics
                </span>
                <h3 className="text-lg font-bold text-white">{activeCryo.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-300 font-mono text-sm border border-cyan-700/50">
                {activeCryo.temp}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCryo.description}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Installed Engineering Components:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCryo.components.map((comp, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Architectures Comparison Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Physical Qubit Technologies Comparison</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/80">
                <th className="p-3">Platform</th>
                <th className="p-3">Leading Industry / Labs</th>
                <th className="p-3">Operating Temp</th>
                <th className="p-3">Coherence T₁</th>
                <th className="p-3">2-Qubit Gate Fidelity</th>
                <th className="p-3">Primary Scaling Challenge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {ARCHITECTURES.map((arch) => (
                <tr key={arch.name} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white">
                    {arch.name}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {arch.qubitType}
                    </span>
                  </td>
                  <td className="p-3 text-cyan-300">{arch.company}</td>
                  <td className="p-3 font-mono text-amber-400">{arch.temp}</td>
                  <td className="p-3 font-mono">{arch.coherenceT1}</td>
                  <td className="p-3 font-mono font-semibold text-emerald-400">
                    {arch.twoQubitFidelity}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{arch.scalingChallenge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparency Callout */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Integrity Note:</strong> KEP QuantumVerse does not claim direct real-time hardware execution access in this MVP version. All data presented in this explorer reflects peer-reviewed scientific literature and manufacturer benchmarks.
        </p>
      </div>
    </div>
  );
};
