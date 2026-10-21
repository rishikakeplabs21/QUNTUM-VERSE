export interface MentorAnswer {
  answer: string;
  provider: string;
  mode: string;
  matched_topic?: string;
  notice: string;
}

export const CLIENT_QUANTUM_KB: Record<
  string,
  {
    title: string;
    summary: string;
    math: string;
    key_takeaways: string[];
    suggested_actions: string[];
  }
> = {
  superposition: {
    title: 'Quantum Superposition Principle',
    summary:
      'Unlike a classical bit which is strictly 0 or 1, a qubit can exist in a linear combination of basis states.',
    math: '|ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ and |α|² + |β|² = 1',
    key_takeaways: [
      'Measurement forces the superposition to irreversibly collapse to either |0⟩ or |1⟩ with probability |α|² or |β|² respectively.',
      'Superposition allows quantum algorithms to process exponentially large state spaces simultaneously (quantum parallelism).',
      'Applying a Hadamard gate (H) to |0⟩ creates equal superposition: (|0⟩ + |1⟩)/√2.'
    ],
    suggested_actions: [
      'Open Physics Lab > Qubit Visualization',
      'Open Circuit Studio and apply an H gate'
    ]
  },
  entanglement: {
    title: 'Quantum Entanglement & Non-Locality',
    summary:
      'A phenomenon where two or more qubits form a unified quantum state that cannot be factored into individual qubit states.',
    math: '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2 ≠ |ψ_A⟩ ⊗ |ψ_B⟩',
    key_takeaways: [
      'Measuring one entangled qubit instantaneously determines the measurement outcome of the other, regardless of spatial separation.',
      'Entanglement does NOT allow faster-than-light communication because local outcomes remain purely random without classical communication (No-Signaling Theorem).',
      'Created using a Hadamard gate followed by a Controlled-NOT (CNOT) gate.'
    ],
    suggested_actions: [
      'Open Circuit Studio > Presets > Bell State',
      'Run Bell State measurement shots'
    ]
  },
  measurement: {
    title: 'Quantum Measurement & Wavefunction Collapse',
    summary:
      'The act of observing a quantum system projects its continuous state vector into one of the eigenstates of the measurement operator.',
    math: 'P(m) = ⟨ψ|M_m† M_m|ψ⟩ (Born\'s Rule)',
    key_takeaways: [
      'Quantum measurement is fundamentally probabilistic and non-deterministic.',
      'Repeated measurements on identically prepared states yield statistical distributions matching Born\'s rule.',
      'Measuring in a non-orthogonal basis (e.g. X basis vs Z basis) causes complementary uncertainty (Heisenberg uncertainty principle).'
    ],
    suggested_actions: ['Open Physics Lab > Probability & Measurement Experiment']
  },
  bloch_sphere: {
    title: 'The Bloch Sphere Geometric Representation',
    summary:
      'A unit sphere representation of any two-level quantum state, mapping complex amplitudes to spherical angles (θ, φ).',
    math: '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩; x = sinθ cosφ, y = sinθ sinφ, z = cosθ',
    key_takeaways: [
      'North pole corresponds to |0⟩, South pole corresponds to |1⟩.',
      'Equator corresponds to equal superpositions with different relative phases (e.g. |+⟩, |-⟩, |+i⟩, |-i⟩).',
      'Single-qubit unitary quantum gates correspond to rigid rotations of the sphere.'
    ],
    suggested_actions: ['Open Physics Lab > Bloch Sphere Visualizer']
  },
  bb84: {
    title: 'BB84 Quantum Key Distribution Protocol',
    summary:
      'The first quantum cryptographic protocol, invented by Charles Bennett and Gilles Brassard in 1984.',
    math: 'QBER = (Mismatches in matching bases) / (Total matching bases)',
    key_takeaways: [
      'Information is encoded in single photons using conjugate bases (Rectilinear Z and Diagonal X).',
      'According to the No-Cloning Theorem and measurement collapse, any eavesdropper (Eve) introduces detectable errors (~25% error rate on intercepted bits).',
      'If QBER is below threshold (~11%), Alice and Bob can perform privacy amplification to extract an unconditionally secure secret key.'
    ],
    suggested_actions: ['Open Communication Lab > BB84 Protocol Simulator']
  },
  sensing: {
    title: 'Quantum Sensing & Metrology',
    summary:
      'Using quantum coherence and entanglement to measure physical quantities (magnetic fields, gravity, time) with unprecedented sensitivity.',
    math: 'Standard Quantum Limit: Δφ ~ 1/√N; Heisenberg Limit: Δφ ~ 1/N',
    key_takeaways: [
      'Classical sensors are bounded by shot noise (1/√N).',
      'Quantum sensors using entangled states (GHZ or squeezed states) achieve the ultimate Heisenberg limit (1/N).',
      'Key implementations include NV centers in diamond, trapped ions, and atomic vapor cells.'
    ],
    suggested_actions: ['Open Sensing Lab > Ramsey Interferometer Simulator']
  },
  hadamard: {
    title: 'Hadamard Gate (H)',
    summary:
      'A fundamental single-qubit gate that maps computational basis states into equal superposition states.',
    math: 'H = (1/√2) [[1, 1], [1, -1]]; H|0⟩ = |+⟩, H|1⟩ = |-⟩',
    key_takeaways: [
      'H is unitary (H† = H) and Hermitian, meaning H² = I (applying it twice returns the original state).',
      'Geometrically, it performs a 180° rotation around the (X + Z)/√2 axis on the Bloch sphere.',
      'It is the foundation of almost all quantum algorithms (Shor, Grover, QFT, VQE).'
    ],
    suggested_actions: ['Open Circuit Studio > Add H Gate on Q0']
  }
};

export function getClientMentorResponse(question: string): MentorAnswer {
  const qLower = question.toLowerCase();
  let matchedKey = 'superposition';

  if (qLower.includes('superposition') || qLower.includes('state') || qLower.includes('qubit') || qLower.includes('linear')) {
    matchedKey = 'superposition';
  } else if (qLower.includes('entangle') || qLower.includes('bell') || qLower.includes('spooky') || qLower.includes('teleport')) {
    matchedKey = 'entanglement';
  } else if (qLower.includes('measure') || qLower.includes('collapse') || qLower.includes('born') || qLower.includes('probabilit')) {
    matchedKey = 'measurement';
  } else if (qLower.includes('bloch') || qLower.includes('sphere') || qLower.includes('theta') || qLower.includes('phi')) {
    matchedKey = 'bloch_sphere';
  } else if (qLower.includes('bb84') || qLower.includes('cryptograph') || qLower.includes('qkd') || qLower.includes('security') || qLower.includes('eve')) {
    matchedKey = 'bb84';
  } else if (qLower.includes('sens') || qLower.includes('ramsey') || qLower.includes('metrology') || qLower.includes('heisenberg')) {
    matchedKey = 'sensing';
  } else if (qLower.includes('hadamard') || qLower.includes('gate') || qLower.includes('matrix')) {
    matchedKey = 'hadamard';
  }

  const entry = CLIENT_QUANTUM_KB[matchedKey];
  const formatted =
    `### ${entry.title}\n\n` +
    `${entry.summary}\n\n` +
    `**Mathematical Formulation:**\n\`\`\`math\n${entry.math}\n\`\`\`\n\n` +
    `**Key Quantum Principles:**\n` +
    entry.key_takeaways.map((item) => `- ${item}`).join('\n') +
    `\n\n**Recommended Exploration in KEP QuantumVerse:**\n` +
    entry.suggested_actions.map((act) => `👉 ${act}`).join('\n');

  return {
    answer: formatted,
    provider: 'Curated Quantum Curriculum (Client-Side)',
    mode: 'offline_curated',
    matched_topic: matchedKey,
    notice: 'Running in Standalone Client Mode. Answers are generated from the verified KEP QuantumVerse physics curricula.'
  };
}
