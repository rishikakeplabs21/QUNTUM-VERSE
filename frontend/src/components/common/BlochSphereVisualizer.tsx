import React, { useMemo } from 'react';
import { calculateBlochFromAngles } from '../../lib/quantum';

interface BlochVisualizerProps {
  theta: number; // in radians
  phi: number;   // in radians
  onChangeAngles?: (theta: number, phi: number) => void;
  showControls?: boolean;
}

export const BlochSphereVisualizer: React.FC<BlochVisualizerProps> = ({
  theta,
  phi,
  onChangeAngles,
  showControls = true,
}) => {
  const coords = useMemo(() => calculateBlochFromAngles(theta, phi), [theta, phi]);

  // 3D Isometric projection parameters
  // Sphere center at (150, 150), radius R = 100
  const cx = 150;
  const cy = 150;
  const R = 100;

  // Isometric projection angle (30 deg tilt)
  const isoAngle = Math.PI / 6;

  // Project 3D (x, y, z) into 2D SVG canvas
  // Standard math: Z is up, X is forward/right, Y is depth/left
  // 2D: px = cx + R * (x * cos(isoAngle) - y * sin(isoAngle))
  //     py = cy - R * (z - (x * sin(isoAngle) + y * cos(isoAngle)) * 0.4)
  const project = (x3: number, y3: number, z3: number) => {
    const px = cx + R * (x3 * Math.cos(isoAngle) - y3 * Math.cos(isoAngle));
    const py = cy - R * (z3 - (x3 * Math.sin(isoAngle) + y3 * Math.sin(isoAngle)) * 0.45);
    return { x: px, y: py };
  };

  const center = { x: cx, y: cy };
  const northPole = project(0, 0, 1);    // |0>
  const southPole = project(0, 0, -1);   // |1>
  const posX = project(1, 0, 0);         // |+>
  const negX = project(-1, 0, 0);        // |->
  const posY = project(0, 1, 0);         // |+i>
  const stateVectorTip = project(coords.x, coords.y, coords.z);

  const presets = [
    { label: '|0⟩', theta: 0, phi: 0, desc: 'Ground state (North pole)' },
    { label: '|1⟩', theta: Math.PI, phi: 0, desc: 'Excited state (South pole)' },
    { label: '|+⟩', theta: Math.PI / 2, phi: 0, desc: 'Equal Superposition (+X)' },
    { label: '|-⟩', theta: Math.PI / 2, phi: Math.PI, desc: 'Negative Superposition (-X)' },
    { label: '|+i⟩', theta: Math.PI / 2, phi: Math.PI / 2, desc: 'Circular (+Y)' },
    { label: '|-i⟩', theta: Math.PI / 2, phi: (3 * Math.PI) / 2, desc: 'Circular (-Y)' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
      {/* 3D SVG Render Area */}
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 300 300"
          className="w-64 h-64 select-none drop-shadow-md"
        >
          {/* Subtle Outer Glow / Background Sphere */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            className="fill-sky-950/20 stroke-sky-800/40"
            strokeWidth="1.5"
          />

          {/* Equator Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={R}
            ry={R * 0.35}
            className="fill-none stroke-cyan-500/25 stroke-dasharray-2"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* Prime Meridian Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={R * 0.35}
            ry={R}
            className="fill-none stroke-indigo-500/25"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* Z Axis Line (North to South) */}
          <line
            x1={northPole.x}
            y1={northPole.y}
            x2={southPole.x}
            y2={southPole.y}
            className="stroke-slate-600"
            strokeWidth="1.2"
          />

          {/* X Axis Line */}
          <line
            x1={negX.x}
            y1={negX.y}
            x2={posX.x}
            y2={posX.y}
            className="stroke-slate-700"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Center Origin Dot */}
          <circle cx={center.x} cy={center.y} r="2.5" className="fill-slate-500" />

          {/* State Vector Line */}
          <line
            x1={center.x}
            y1={center.y}
            x2={stateVectorTip.x}
            y2={stateVectorTip.y}
            className="stroke-cyan-400"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* State Vector Arrow Tip */}
          <circle
            cx={stateVectorTip.x}
            cy={stateVectorTip.y}
            r="5"
            className="fill-cyan-300 stroke-cyan-500 shadow-lg"
            strokeWidth="2"
          />

          {/* Basis State Labels */}
          <text
            x={northPole.x}
            y={northPole.y - 8}
            textAnchor="middle"
            className="fill-cyan-300 font-mono text-[11px] font-bold"
          >
            |0⟩ (+Z)
          </text>
          <text
            x={southPole.x}
            y={southPole.y + 14}
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[10px]"
          >
            |1⟩ (-Z)
          </text>
          <text
            x={posX.x + 8}
            y={posX.y + 4}
            textAnchor="start"
            className="fill-amber-400 font-mono text-[10px]"
          >
            |+⟩ (+X)
          </text>
          <text
            x={posY.x - 8}
            y={posY.y + 12}
            textAnchor="end"
            className="fill-indigo-300 font-mono text-[10px]"
          >
            |+i⟩ (+Y)
          </text>
        </svg>

        <span className="text-[11px] text-slate-400 font-mono">
          |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
        </span>
      </div>

      {/* Interactive Controls & Mathematical Readouts */}
      <div className="flex-1 space-y-4">
        {/* Preset States */}
        {showControls && onChangeAngles && (
          <div>
            <span className="text-xs font-semibold text-slate-300 mb-2 block">
              Quick Preset States:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onChangeAngles(p.theta, p.phi)}
                  className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/50 border border-slate-700 text-slate-200 transition-colors"
                  title={p.desc}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sliders */}
        {showControls && onChangeAngles && (
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Polar Angle θ (colatitude):</span>
                <span className="font-mono text-cyan-400">{coords.theta_deg}° ({coords.theta_rad} rad)</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.02"
                value={theta}
                onChange={(e) => onChangeAngles(parseFloat(e.target.value), phi)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Azimuthal Angle φ (phase):</span>
                <span className="font-mono text-cyan-400">{coords.phi_deg}° ({coords.phi_rad} rad)</span>
              </div>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.02"
                value={phi}
                onChange={(e) => onChangeAngles(theta, parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Real-time Scientific Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Cartesian Coordinates
            </span>
            <span className="font-mono text-slate-200">
              x: <span className="text-amber-400">{coords.x}</span>, y: <span className="text-indigo-400">{coords.y}</span>, z: <span className="text-cyan-400">{coords.z}</span>
            </span>
          </div>

          <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Born Rule Probabilities
            </span>
            <span className="font-mono text-slate-200">
              P(0): <span className="text-cyan-400">{(coords.p0 * 100).toFixed(1)}%</span> | P(1): <span className="text-slate-300">{(coords.p1 * 100).toFixed(1)}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
