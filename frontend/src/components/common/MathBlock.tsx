import React from 'react';

interface MathBlockProps {
  formula: string;
  inline?: boolean;
}

export const MathBlock: React.FC<MathBlockProps> = ({ formula, inline = false }) => {
  if (inline) {
    return (
      <code className="font-mono text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-950/80 text-xs">
        {formula}
      </code>
    );
  }

  return (
    <div className="my-2.5 p-3 rounded-lg bg-slate-950/90 border border-sky-950/70 overflow-x-auto text-center font-mono text-sm text-cyan-200 select-all tracking-wide">
      {formula}
    </div>
  );
};
