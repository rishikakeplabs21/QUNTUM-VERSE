import { ExperimentMetadata } from '../types/quantum';

export const EXPERIMENTS_CATALOG: ExperimentMetadata[] = [
  {
    id: 'exp-1',
    roadmapIndex: 1,
    title: 'Quantum Probability & Measurement',
    category: 'Fundamentals',
    status: 'implemented',
    tagline: 'Simulate projective wavefunction collapse and statistical convergence to Born\'s rule.',
    objective: 'Demonstrate how repeated projective measurements on an identical quantum state converge to theoretical Born probabilities across varying shot numbers.',
    theory: 'Given |ψ⟩ = α|0⟩ + β|1⟩, measurement yields outcome 0 with probability P(0) = |α|² and 1 with probability P(1) = |β|². By the Law of Large Numbers, relative frequencies converge to P(m) as shots N → ∞ with standard error σ ~ 1/√N.'
  },
  {
    id: 'exp-2',
    roadmapIndex: 2,
    title: 'Photon Polarization & Malus\' Law',
    category: 'Optics',
    status: 'implemented',
    tagline: 'Observe photon transmission through cascaded linear polarizers and the quantum eraser paradox.',
    objective: 'Verify Malus\' law and discover why inserting a 45° polarizer between crossed (90°) polarizers allows light to pass (quantum measurement projection).',
    theory: 'A linearly polarized photon passing through a filter tilted at angle θ transmits with probability cos²(θ). When horizontal (0°) and vertical (90°) polarizers are crossed, 0% transmits. Adding a 45° filter resets the state to |45°⟩, yielding (1/2) * (1/2) = 25% transmission!'
  },
  {
    id: 'exp-3',
    roadmapIndex: 3,
    title: 'Single-Photon Interference (Mach-Zehnder)',
    category: 'Optics',
    status: 'roadmap',
    tagline: 'Wave-particle duality visualized in a balanced Mach-Zehnder interferometer.',
    objective: 'Explore how single photons interfere with themselves, and how placing a "which-way" detector destroys the interference fringes.',
    theory: 'Photons pass through beam splitters creating superposition of path A and path B. Constructive and destructive interference directs 100% of photons to one detector until phase shifts or path-monitoring occurs.'
  },
  {
    id: 'exp-4',
    roadmapIndex: 4,
    title: 'Quantum Tunnelling Through Finite Barrier',
    category: 'Fundamentals',
    status: 'roadmap',
    tagline: 'Particle wavefunction penetration through an energy barrier higher than total kinetic energy.',
    objective: 'Calculate transmission and reflection coefficients T and R for a wavepacket impinging on a rectangular potential barrier.',
    theory: 'In classical physics, E < V₀ means 100% reflection. Quantum wavefunctions exponentially decay inside the barrier: ψ(x) ~ e^{-κx}, giving a non-zero transmission probability T ≈ 16(E/V₀)(1 - E/V₀)e^{-2κL}.'
  },
  {
    id: 'exp-5',
    roadmapIndex: 5,
    title: 'Qubit States & The Bloch Sphere',
    category: 'Qubits',
    status: 'implemented',
    tagline: 'Interactive 3D representation mapping complex amplitudes to spherical coordinates (θ, φ).',
    objective: 'Manipulate spherical angles θ and φ to navigate anywhere on the Bloch sphere and observe changes in amplitude and phase.',
    theory: 'Any single qubit state can be written as |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩. The Bloch vector is r = [sinθ cosφ, sinθ sinφ, cosθ]. Pure states lie on the unit surface (|r| = 1).'
  },
  {
    id: 'exp-6',
    roadmapIndex: 6,
    title: 'Single-Qubit Unitary Quantum Gates',
    category: 'Qubits',
    status: 'implemented',
    tagline: 'Step-by-step matrix transformations with Pauli-X, Y, Z, Hadamard, and Phase gates.',
    objective: 'Apply sequence of gates to |0⟩, inspect mathematical statevector evolution, and observe corresponding rotations on the Bloch sphere.',
    theory: 'Unitary matrices preserve the inner product: U†U = I. Gate application corresponds to matrix-vector multiplication: |ψ\'⟩ = U|ψ⟩.'
  },
  {
    id: 'exp-7',
    roadmapIndex: 7,
    title: 'Measurement in Complementary Bases',
    category: 'Qubits',
    status: 'implemented',
    tagline: 'Observe quantum complementarity: measuring in computational Z vs Hadamard X vs circular Y bases.',
    objective: 'Understand why a qubit in state |0⟩ yields deterministic outcomes in Z basis but completely random 50/50 outcomes in X basis.',
    theory: 'The computational basis Z has eigenvectors |0⟩, |1⟩. The Hadamard basis X has eigenvectors |+⟩, |-⟩. Measuring |0⟩ in the X basis gives P(+) = |⟨+|0⟩|² = 1/2, illustrating complementary observables [X, Z] ≠ 0.'
  },
  {
    id: 'exp-8',
    roadmapIndex: 8,
    title: 'Bell-State Preparation & Non-Local Correlations',
    category: 'Algorithms',
    status: 'implemented',
    tagline: 'Prepare the entangled state |Φ⁺⟩ and observe perfect correlations in 1024 measurement shots.',
    objective: 'Construct the circuit H(0) followed by CNOT(0, 1) and demonstrate that measuring Q0 instantaneously specifies the state of Q1 without local hidden variables.',
    theory: 'The state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 yields only outcomes 00 and 11 each with 50% probability. The joint probability satisfies P(00) + P(11) = 1 while P(01) = P(10) = 0.'
  },
  {
    id: 'exp-9',
    roadmapIndex: 9,
    title: 'Quantum Teleportation Protocol',
    category: 'Protocols',
    status: 'roadmap',
    tagline: 'Transfer an unknown quantum state using Bell entanglement and two classical bits.',
    objective: 'Simulate the 3-qubit teleportation protocol: Alice entangles the source qubit with a shared Bell pair, performs Bell measurement, and sends 2 classical bits to Bob.',
    theory: 'Alice and Bob share |Φ⁺⟩₂₃. Alice interacts state |ψ⟩₁ with qubit 2, measures both in Bell basis, transmitting 2 classical bits. Bob applies appropriate Pauli corrections (I, X, Z, or ZX) to recover exact state |ψ⟩ on qubit 3.'
  },
  {
    id: 'exp-10',
    roadmapIndex: 10,
    title: 'Grover\'s Quantum Search Algorithm',
    category: 'Algorithms',
    status: 'roadmap',
    tagline: 'Quadratic speedup search over an unsorted database using amplitude amplification.',
    objective: 'Understand how oracle phase inversion and the diffusion operator iteratively amplify the probability amplitude of marked items in O(√N) queries.',
    theory: 'Classical unstructured search requires O(N) operations. Grover\'s algorithm initializes equal superposition and alternates between phase oracle O_f and diffusion operator D = 2|s⟩⟨s| - I, rotating the state toward the target in π/4 · √N iterations.'
  }
];
