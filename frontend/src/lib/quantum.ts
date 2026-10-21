import {
  GateStep,
  SimulationResult,
  StateVectorItem,
  BlochCoordinates,
  BB84Result,
  RamseySensingResult
} from '../types/quantum';

// Complex number helper
export interface Complex {
  re: number;
  im: number;
}

export const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
export const cSub = (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im });
export const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
export const cMag = (c: Complex): number => Math.sqrt(c.re * c.re + c.im * c.im);
export const cAngle = (c: Complex): number => Math.atan2(c.im, c.re);

// 2x2 Unitary Gate Definitions
const INV_SQRT2 = 1 / Math.SQRT2;

export const CLIENT_GATES: Record<string, Complex[][]> = {
  I: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
  ],
  X: [
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
  ],
  Y: [
    [{ re: 0, im: 0 }, { re: 0, im: -1 }],
    [{ re: 0, im: 1 }, { re: 0, im: 0 }],
  ],
  Z: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: -1, im: 0 }],
  ],
  H: [
    [{ re: INV_SQRT2, im: 0 }, { re: INV_SQRT2, im: 0 }],
    [{ re: INV_SQRT2, im: 0 }, { re: -INV_SQRT2, im: 0 }],
  ],
  S: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 0, im: 1 }],
  ],
  T: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: Math.cos(Math.PI / 4), im: Math.sin(Math.PI / 4) }],
  ],
};

// Kronecker Product of two matrices
function kron(A: Complex[][], B: Complex[][]): Complex[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  const result: Complex[][] = Array.from({ length: rowsA * rowsB }, () =>
    Array.from({ length: colsA * colsB }, () => ({ re: 0, im: 0 }))
  );

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      for (let k = 0; k < rowsB; k++) {
        for (let l = 0; l < colsB; l++) {
          result[i * rowsB + k][j * colsB + l] = cMul(A[i][j], B[k][l]);
        }
      }
    }
  }
  return result;
}

// Matrix-Vector multiplication
function matVecMul(M: Complex[][], v: Complex[]): Complex[] {
  const dim = M.length;
  const res: Complex[] = Array.from({ length: dim }, () => ({ re: 0, im: 0 }));
  for (let i = 0; i < dim; i++) {
    let sum: Complex = { re: 0, im: 0 };
    for (let j = 0; j < dim; j++) {
      sum = cAdd(sum, cMul(M[i][j], v[j]));
    }
    res[i] = sum;
  }
  return res;
}

export function simulateCircuitClientSide(
  numQubits: number,
  gates: GateStep[],
  shots: number = 1024
): SimulationResult {
  const dim = Math.pow(2, numQubits);
  let state: Complex[] = Array.from({ length: dim }, (_, i) => ({
    re: i === 0 ? 1 : 0,
    im: 0,
  }));

  // Sort gates by step index
  const sortedGates = [...gates].sort((a, b) => a.stepIndex - b.stepIndex);

  for (const step of sortedGates) {
    if (step.gate === 'MEASURE') continue;

    if (step.gate === 'CNOT') {
      const ctrl = step.control ?? 0;
      const tgt = step.target;
      if (ctrl === tgt) continue;

      const cnotMat: Complex[][] = Array.from({ length: dim }, () =>
        Array.from({ length: dim }, () => ({ re: 0, im: 0 }))
      );

      for (let i = 0; i < dim; i++) {
        const ctrlBit = (i >> (numQubits - 1 - ctrl)) & 1;
        if (ctrlBit === 1) {
          const tgtMask = 1 << (numQubits - 1 - tgt);
          const flipped = i ^ tgtMask;
          cnotMat[flipped][i] = { re: 1, im: 0 };
        } else {
          cnotMat[i][i] = { re: 1, im: 0 };
        }
      }
      state = matVecMul(cnotMat, state);
    } else {
      const gMat = CLIENT_GATES[step.gate] || CLIENT_GATES.I;
      let fullOp: Complex[][] = [[{ re: 1, im: 0 }]];

      for (let q = 0; q < numQubits; q++) {
        if (q === step.target) {
          fullOp = kron(fullOp, gMat);
        } else {
          fullOp = kron(fullOp, CLIENT_GATES.I);
        }
      }
      state = matVecMul(fullOp, state);
    }
  }

  // Calculate probabilities and state info
  const statevector: StateVectorItem[] = [];
  const probabilities: Record<string, number> = {};
  let normSq = 0;

  for (let i = 0; i < dim; i++) {
    const val = state[i];
    const mag = cMag(val);
    const prob = mag * mag;
    normSq += prob;
    const bitStr = i.toString(2).padStart(numQubits, '0');
    probabilities[bitStr] = parseFloat(prob.toFixed(6));

    const phase = cAngle(val);
    statevector.push({
      basis: `|${bitStr}⟩`,
      index: i,
      real: parseFloat(val.re.toFixed(6)),
      imag: parseFloat(val.im.toFixed(6)),
      magnitude: parseFloat(mag.toFixed(6)),
      phase_rad: parseFloat(phase.toFixed(4)),
      phase_deg: parseFloat(((phase * 180) / Math.PI).toFixed(2)),
      probability: parseFloat(prob.toFixed(6)),
    });
  }

  // Shot simulation via cumulative probability distribution
  const shots_count: Record<string, number> = {};
  for (let i = 0; i < dim; i++) {
    const bitStr = i.toString(2).padStart(numQubits, '0');
    shots_count[bitStr] = 0;
  }

  for (let s = 0; s < shots; s++) {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < dim; i++) {
      const bitStr = i.toString(2).padStart(numQubits, '0');
      cum += probabilities[bitStr];
      if (r <= cum || i === dim - 1) {
        shots_count[bitStr] += 1;
        break;
      }
    }
  }

  return {
    num_qubits: numQubits,
    gate_count: gates.length,
    statevector,
    probabilities,
    shots_count,
    total_shots: shots,
  };
}

// Bloch sphere coordinate calculation
export function calculateBlochFromAngles(theta: number, phi: number): BlochCoordinates {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  const p0 = Math.cos(theta / 2) ** 2;
  const p1 = Math.sin(theta / 2) ** 2;

  return {
    theta_rad: parseFloat(theta.toFixed(4)),
    theta_deg: parseFloat(((theta * 180) / Math.PI).toFixed(2)),
    phi_rad: parseFloat(phi.toFixed(4)),
    phi_deg: parseFloat(((phi * 180) / Math.PI).toFixed(2)),
    x: parseFloat(x.toFixed(4)),
    y: parseFloat(y.toFixed(4)),
    z: parseFloat(z.toFixed(4)),
    p0: parseFloat(p0.toFixed(4)),
    p1: parseFloat(p1.toFixed(4)),
  };
}

// Client-side Photon Polarization Simulation
export function simulatePolarizationClient(
  numPhotons: number,
  anglesDeg: number[]
) {
  let intensity = 1.0;
  let currentAngle = 0.0;
  const stages = [];

  for (let idx = 0; idx < anglesDeg.length; idx++) {
    const angle = anglesDeg[idx];
    const deltaRad = ((angle - currentAngle) * Math.PI) / 180;
    const factor = Math.cos(deltaRad) ** 2;
    intensity *= factor;
    const detected = Math.round(numPhotons * intensity);

    stages.push({
      filter_index: idx + 1,
      filter_angle_deg: angle,
      relative_angle_deg: parseFloat((angle - currentAngle).toFixed(2)),
      transmission_fraction: parseFloat(factor.toFixed(4)),
      cumulative_transmission: parseFloat(intensity.toFixed(4)),
      detected_photons: detected,
    });
    currentAngle = angle;
  }

  return {
    initial_photons: numPhotons,
    final_transmission_pct: parseFloat((intensity * 100).toFixed(2)),
    final_detected_photons: Math.round(numPhotons * intensity),
    stages,
    quantum_insight:
      "Each polarizer performs projective quantum measurement. " +
      "The state collapses to the axis of the polarizer, illustrating Malus' law and state projection.",
  };
}

// Client-side BB84 Protocol Simulation
export function simulateBB84Client(numBits: number = 16, eavesdropper: boolean = false): BB84Result {
  const aliceBits: number[] = [];
  const aliceBases: string[] = [];
  const bobBases: string[] = [];
  const bobBits: number[] = [];
  const eveBases: string[] = [];
  const eveBits: number[] = [];
  const transmittedBits: number[] = [];

  for (let i = 0; i < numBits; i++) {
    const bit = Math.random() < 0.5 ? 0 : 1;
    const base = Math.random() < 0.5 ? 'Z' : 'X';
    aliceBits.push(bit);
    aliceBases.push(base);
    transmittedBits.push(bit);
  }

  if (eavesdropper) {
    for (let i = 0; i < numBits; i++) {
      const eBase = Math.random() < 0.5 ? 'Z' : 'X';
      eveBases.push(eBase);
      let eBit: number;
      if (eBase === aliceBases[i]) {
        eBit = aliceBits[i];
      } else {
        eBit = Math.random() < 0.5 ? 0 : 1; // 50% collapse
      }
      eveBits.push(eBit);
      transmittedBits[i] = eBit; // Collapsed state sent to Bob
    }
  }

  for (let i = 0; i < numBits; i++) {
    const bBase = Math.random() < 0.5 ? 'Z' : 'X';
    bobBases.push(bBase);

    const receivedBase = eavesdropper ? eveBases[i] : aliceBases[i];
    const receivedBit = transmittedBits[i];

    if (bBase === receivedBase) {
      bobBits.push(receivedBit);
    } else {
      bobBits.push(Math.random() < 0.5 ? 0 : 1);
    }
  }

  const siftedIndices: number[] = [];
  const aliceSifted: number[] = [];
  const bobSifted: number[] = [];

  for (let i = 0; i < numBits; i++) {
    if (aliceBases[i] === bobBases[i]) {
      siftedIndices.push(i);
      aliceSifted.push(aliceBits[i]);
      bobSifted.push(bobBits[i]);
    }
  }

  let mismatches = 0;
  for (let j = 0; j < aliceSifted.length; j++) {
    if (aliceSifted[j] !== bobSifted[j]) {
      mismatches += 1;
    }
  }

  const qber = aliceSifted.length > 0 ? (mismatches / aliceSifted.length) * 100 : 0;

  return {
    num_bits: numBits,
    eavesdropper_present: eavesdropper,
    alice_bits: aliceBits,
    alice_bases: aliceBases,
    bob_bases: bobBases,
    bob_bits: bobBits,
    eve_bases: eavesdropper ? eveBases : undefined,
    sifted_indices: siftedIndices,
    alice_sifted_key: aliceSifted,
    bob_sifted_key: bobSifted,
    sifted_key_length: aliceSifted.length,
    mismatches,
    qber_percentage: parseFloat(qber.toFixed(2)),
    is_channel_secure: qber < 11.0,
    explanation: eavesdropper && qber > 10
      ? 'High Quantum Bit Error Rate (QBER > 11%) detected! Channel is compromised by Eve.'
      : 'Low QBER within secure bounds. Secret quantum key successfully sifted!',
  };
}

// Client-side Ramsey Sensing Simulation
export function simulateRamseyClient(
  detuningMhz: number,
  durationNs: number,
  numAtoms: number = 100
): RamseySensingResult {
  const omega = 2 * Math.PI * (detuningMhz * 1e6);
  const t = durationNs * 1e-9;
  const phase = omega * t;
  const p1 = 0.5 * (1 - Math.cos(phase));
  const p0 = 1.0 - p1;

  const sql = 1.0 / Math.sqrt(numAtoms);
  const heisenberg = 1.0 / numAtoms;

  return {
    detuning_mhz: detuningMhz,
    duration_ns: durationNs,
    accumulated_phase_rad: parseFloat((phase % (2 * Math.PI)).toFixed(4)),
    prob_excited_p1: parseFloat(p1.toFixed(4)),
    prob_ground_p0: parseFloat(p0.toFixed(4)),
    num_atoms: numAtoms,
    standard_quantum_limit: parseFloat(sql.toFixed(5)),
    heisenberg_limit: parseFloat(heisenberg.toFixed(5)),
    quantum_advantage_ratio: parseFloat((sql / heisenberg).toFixed(2)),
  };
}

// Unified API caller with client fallback
export async function runCircuitSimulation(
  numQubits: number,
  gates: GateStep[],
  shots: number = 1024
): Promise<SimulationResult> {
  try {
    const formattedGates = gates.map((g) => ({
      gate: g.gate,
      target: g.target,
      control: g.control,
    }));

    const API_BASE = import.meta.env.VITE_API_URL || '';
    const resp = await fetch(`${API_BASE}/api/simulate/circuit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num_qubits: numQubits,
        gates: formattedGates,
        shots,
      }),
    });

    if (resp.ok) {
      return await resp.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using verified client-side quantum simulation engine.');
  }

  return simulateCircuitClientSide(numQubits, gates, shots);
}
