import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface HistogramProps {
  probabilities: Record<string, number>;
  shotsCount?: Record<string, number>;
  totalShots?: number;
  height?: number;
}

export const ProbabilityHistogram: React.FC<HistogramProps> = ({
  probabilities,
  shotsCount,
  totalShots,
  height = 240
}) => {
  const chartData = Object.keys(probabilities).map((basis) => {
    const theoreticalProb = probabilities[basis];
    const shots = shotsCount ? shotsCount[basis] || 0 : 0;
    const empiricalProb = totalShots && totalShots > 0 ? shots / totalShots : theoreticalProb;

    return {
      state: `|${basis}⟩`,
      Theoretical: parseFloat((theoreticalProb * 100).toFixed(2)),
      Empirical: parseFloat((empiricalProb * 100).toFixed(2)),
      shots
    };
  });

  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          State Measurement Probabilities
        </h4>
        {totalShots && (
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Shots: {totalShots.toLocaleString()}
          </span>
        )}
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="state"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="font-mono font-bold text-cyan-300">{data.state}</p>
                      <p className="text-slate-300">
                        Theoretical: <span className="text-cyan-400 font-semibold">{data.Theoretical}%</span>
                      </p>
                      {shotsCount && (
                        <p className="text-slate-300">
                          Measured: <span className="text-amber-400 font-semibold">{data.Empirical}%</span> ({data.shots} shots)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Bar
              dataKey="Theoretical"
              name="Analytical |α|²"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
            />
            {shotsCount && (
              <Bar
                dataKey="Empirical"
                name="Measured Shots"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
