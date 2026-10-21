import React, { useState } from 'react';
import {
  Radio,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Key,
  Info,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { simulateBB84Client } from '../lib/quantum';
import { BB84Result } from '../types/quantum';
import { useQuantum } from '../context/QuantumContext';

export const CommunicationLabPage: React.FC = () => {
  const { addExperimentRun } = useQuantum();

  const [numBits, setNumBits] = useState<number>(16);
  const [eavesdropper, setEavesdropper] = useState<boolean>(false);
  const [bb84Result, setBb84Result] = useState<BB84Result | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateBB84Client(numBits, eavesdropper);
      setBb84Result(res);
      setIsSimulating(false);
      addExperimentRun({
        experimentId: 'exp-bb84',
        title: `BB84 Protocol (${eavesdropper ? 'With Eve' : 'Secure Channel'})`,
        parameters: { bits: numBits, eve: eavesdropper },
        summary: `Sifted key: ${res.sifted_key_length} bits. QBER: ${res.qber_percentage}%. Status: ${res.is_channel_secure ? 'Secure' : 'Compromised'}`
      });
    }, 300);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Lab Header */}
      <div className="border-b border-sky-950/60 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Quantum Communication Lab (BB84 Protocol)
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Educational simulation of Bennett & Brassard (1984) Quantum Key Distribution (QKD) demonstrating the No-Cloning theorem and disturbance from measurement.
        </p>
      </div>

      {/* Protocol Configuration Bar */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Photons Sent (Bits):</span>
            <select
              value={numBits}
              onChange={(e) => setNumBits(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
            >
              <option value={8}>8 Photons</option>
              <option value={16}>16 Photons (Standard)</option>
              <option value={24}>24 Photons</option>
              <option value={32}>32 Photons (High Sample)</option>
            </select>
          </div>

          {/* Eavesdropper Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEavesdropper(!eavesdropper)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-colors ${
                eavesdropper
                  ? 'bg-rose-950/80 border-rose-600/80 text-rose-300 shadow-md shadow-rose-950/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {eavesdropper ? <Eye className="w-4 h-4 text-rose-400" /> : <EyeOff className="w-4 h-4" />}
              <span>{eavesdropper ? 'Eavesdropper (Eve) Active' : 'No Eavesdropper'}</span>
            </button>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Transmitting Photons...' : 'Run BB84 Protocol'}</span>
        </button>
      </div>

      {/* Protocol Walkthrough Stages */}
      {bb84Result && (
        <div className="space-y-6">
          {/* Security Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              bb84Result.is_channel_secure
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {bb84Result.is_channel_secure ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h3 className="text-sm font-bold">
                  {bb84Result.is_channel_secure
                    ? 'Channel Verified Secure — Key Established!'
                    : 'Quantum Eavesdropping Detected — Channel Compromised!'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{bb84Result.explanation}</p>
              </div>
            </div>

            <div className="text-right shrink-0 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Quantum Bit Error Rate (QBER)</span>
              <span
                className={`text-xl font-bold ${
                  bb84Result.is_channel_secure ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {bb84Result.qber_percentage}%
              </span>
              <span className="text-[10px] text-slate-400 block">(Threshold ~11%)</span>
            </div>
          </div>

          {/* Sifted Key Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-cyan-300">Alice's Sifted Secret Key</span>
                <span className="font-mono">{bb84Result.sifted_key_length} bits extracted</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm tracking-widest text-cyan-400 flex items-center justify-center">
                {bb84Result.alice_sifted_key.join(' ') || 'No matching bases'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-amber-300">Bob's Sifted Key</span>
                <span className="font-mono">
                  {bb84Result.mismatches > 0 ? (
                    <span className="text-rose-400">{bb84Result.mismatches} mismatches</span>
                  ) : (
                    <span className="text-emerald-400">100% agreement</span>
                  )}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm tracking-widest text-amber-400 flex items-center justify-center">
                {bb84Result.bob_sifted_key.join(' ') || 'No matching bases'}
              </div>
            </div>
          </div>

          {/* Full Quantum Exchange Transmission Table */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Photon-by-Photon Transmission Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 text-left">Photon #</th>
                    {Array.from({ length: bb84Result.num_bits }, (_, i) => (
                      <th key={i} className="py-2 px-1 text-slate-500 font-normal">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {/* Alice Bits */}
                  <tr>
                    <td className="py-2 text-left font-semibold text-cyan-400">Alice Bits</td>
                    {bb84Result.alice_bits.map((b, i) => (
                      <td key={i} className="py-2 px-1 text-slate-200">
                        {b}
                      </td>
                    ))}
                  </tr>

                  {/* Alice Bases */}
                  <tr>
                    <td className="py-2 text-left text-slate-400">Alice Basis</td>
                    {bb84Result.alice_bases.map((base, i) => (
                      <td key={i} className="py-2 px-1 text-cyan-300">
                        {base}
                      </td>
                    ))}
                  </tr>

                  {/* Eve (if active) */}
                  {bb84Result.eavesdropper_present && bb84Result.eve_bases && (
                    <tr className="bg-rose-950/20">
                      <td className="py-2 text-left text-rose-400 font-semibold">Eve Basis</td>
                      {bb84Result.eve_bases.map((base, i) => (
                        <td key={i} className="py-2 px-1 text-rose-300">
                          {base}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Bob Bases */}
                  <tr>
                    <td className="py-2 text-left text-slate-400">Bob Basis</td>
                    {bb84Result.bob_bases.map((base, i) => (
                      <td key={i} className="py-2 px-1 text-amber-300">
                        {base}
                      </td>
                    ))}
                  </tr>

                  {/* Bob Measured Bits */}
                  <tr>
                    <td className="py-2 text-left font-semibold text-amber-400">Bob Bit</td>
                    {bb84Result.bob_bits.map((b, i) => (
                      <td key={i} className="py-2 px-1 text-slate-200">
                        {b}
                      </td>
                    ))}
                  </tr>

                  {/* Basis Match Status */}
                  <tr>
                    <td className="py-2 text-left text-slate-400">Matching Basis?</td>
                    {Array.from({ length: bb84Result.num_bits }, (_, i) => {
                      const match = bb84Result.alice_bases[i] === bb84Result.bob_bases[i];
                      return (
                        <td key={i} className="py-2 px-1">
                          {match ? (
                            <span className="text-emerald-400 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-600">✗</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 text-xs text-slate-400 space-y-1">
        <strong className="text-cyan-400 block flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Academic Simulation Notice:
        </strong>
        <p>
          This is an educational simulation illustrating the quantum mechanical principles of the BB84 protocol. It demonstrates how quantum measurement collapse introduces detectable errors when an eavesdropper intercepts qubits. It is not an implementation of a production cryptographic key distribution service.
        </p>
      </div>
    </div>
  );
};
