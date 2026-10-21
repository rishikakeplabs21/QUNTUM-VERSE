import { LearningModule } from '../types/quantum';

export const CURRICULUM_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    title: 'Fundamentals of Quantum Information',
    description: 'Understand the transition from classical binary logic to quantum state vectors and Hilbert spaces.',
    icon: 'Atom',
    lessonCount: 2,
    level: 'Beginner',
    lessons: [
      {
        id: 'les-101',
        moduleId: 'mod-1',
        title: 'Introduction to Quantum Information Science',
        duration: '12 min',
        difficulty: 'Beginner',
        objectives: [
          'Differentiate classical computers from quantum information processors.',
          'Define Hilbert spaces and state vectors.',
          'Recognize physical quantum systems (photons, trapped ions, superconductors).'
        ],
        summary: 'Classical computation processes information using voltages representing 0 or 1. Quantum information exploits microscopic quantum mechanics.',
        theory: [
          'Classical information is measured in bits (binary digits), which assume either value 0 or 1 with mathematical certainty.',
          'Quantum information theory expresses information using two-level quantum mechanical systems called qubits (quantum bits).',
          'While a classical register of n bits holds exactly one sequence of n binary digits, an n-qubit register exists in a superposition of all 2ⁿ possible bitstrings simultaneously.'
        ],
        formula: '|\\psi\\rangle = \\sum_{i=0}^{2^n-1} c_i |i\\rangle, \\quad \\sum |c_i|^2 = 1',
        interactiveType: 'bloch',
        quiz: [
          {
            id: 'q-101-1',
            question: 'How many complex amplitudes are required to describe a state in an n-qubit quantum register?',
            options: ['n amplitudes', '2n amplitudes', '2ⁿ amplitudes', 'n² amplitudes'],
            correctIndex: 2,
            explanation: 'The dimension of the Hilbert space for n qubits is 2ⁿ, requiring 2ⁿ complex amplitudes.'
          },
          {
            id: 'q-101-2',
            question: 'What physical principle restricts copying an unknown quantum state?',
            options: ['Heisenberg Uncertainty', 'No-Cloning Theorem', 'Pauli Exclusion Principle', 'Born Rule'],
            correctIndex: 1,
            explanation: 'Wootters and Zurek (1982) proved the No-Cloning Theorem: an arbitrary unknown quantum state cannot be cloned identically.'
          }
        ]
      },
      {
        id: 'les-102',
        moduleId: 'mod-1',
        title: 'Classical Bits vs. Quantum Bits (Qubits)',
        duration: '15 min',
        difficulty: 'Beginner',
        objectives: [
          'Formulate the mathematical state of a qubit in Dirac notation.',
          'Understand normalization conditions in complex vector space.',
          'Map state probabilities to Born\'s rule.'
        ],
        summary: 'A qubit is represented by a normalized vector in a two-dimensional complex Hilbert space ℂ² spanned by orthonormal basis states |0⟩ and |1⟩.',
        theory: [
          'We denote the orthonormal computational basis states as |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ.',
          'A general qubit state is written as |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes.',
          'Normalization guarantees that the total probability of measurement outcomes equals 1: |α|² + |β|² = 1.'
        ],
        formula: '|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle, \\quad P(0) = |\\alpha|^2, \\; P(1) = |\\beta|^2',
        interactiveType: 'bloch',
        quiz: [
          {
            id: 'q-102-1',
            question: 'If |ψ⟩ = (1/2)|0⟩ + β|1⟩ is a normalized state, what is |β|²?',
            options: ['1/2', '1/4', '3/4', '1'],
            correctIndex: 2,
            explanation: '|α|² + |β|² = 1. Since |α|² = (1/2)² = 1/4, |β|² = 1 - 1/4 = 3/4.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Superposition & Measurement',
    description: 'Master the core mechanics of quantum coherence, Born rule probabilities, and wavefunction collapse.',
    icon: 'Radio',
    lessonCount: 2,
    level: 'Beginner',
    lessons: [
      {
        id: 'les-201',
        moduleId: 'mod-2',
        title: 'The Superposition Principle',
        duration: '15 min',
        difficulty: 'Beginner',
        objectives: [
          'Visualize superposition on the Bloch sphere equator.',
          'Understand constructive and destructive interference of quantum amplitudes.',
          'Examine the Hadamard transformation.'
        ],
        summary: 'Superposition allows a quantum system to hold linear combinations of basis states, enabling quantum parallelism and interference.',
        theory: [
          'Superposition is fundamentally distinct from classical probability: amplitudes can have relative phases (θ, φ).',
          'When amplitudes interfere, relative phase causes constructive interference (enhancing desired states) or destructive interference (canceling incorrect states).',
          'Applying the Hadamard gate H to |0⟩ creates the symmetric superposition state |+⟩ = (|0⟩ + |1⟩)/√2.'
        ],
        formula: 'H|0\\rangle = |+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)',
        interactiveType: 'gate',
        quiz: [
          {
            id: 'q-201-1',
            question: 'What happens when a Hadamard gate is applied to the state |1⟩?',
            options: ['|0⟩', '|1⟩', '(|0⟩ - |1⟩)/√2', '(|0⟩ + |1⟩)/√2'],
            correctIndex: 2,
            explanation: 'H|1⟩ = (|0⟩ - |1⟩)/√2, denoted as the |-⟩ state.'
          }
        ]
      },
      {
        id: 'les-202',
        moduleId: 'mod-2',
        title: 'Quantum Measurement & Wavefunction Collapse',
        duration: '18 min',
        difficulty: 'Intermediate',
        objectives: [
          'State Born\'s rule mathematically using projective operators.',
          'Distinguish non-destructive phase evolution from projective measurement.',
          'Investigate measurement in the Z, X, and Y bases.'
        ],
        summary: 'Measurement is a non-unitary operation that projects the continuous quantum state vector onto one of the measurement operator eigenvectors.',
        theory: [
          'Projective measurement operators for the computational basis are P₀ = |0⟩⟨0| and P₁ = |1⟩⟨1|.',
          'The probability of obtaining outcome m is given by Born\'s rule: P(m) = ⟨ψ|Pₘ|ψ⟩.',
          'After measurement, the state immediately collapses into the corresponding eigenstate. Repeated immediate measurements always yield that same outcome.'
        ],
        formula: 'P(m) = \\langle\\psi| M_m^\\dagger M_m |\\psi\\rangle, \\quad |\\psi\'\\rangle = \\frac{M_m |\\psi\\rangle}{\\sqrt{P(m)}}',
        interactiveType: 'measurement',
        quiz: [
          {
            id: 'q-202-1',
            question: 'If |ψ⟩ = (|0⟩ + |1⟩)/√2 is measured in the Z-basis and yields 0, what is the state immediately following measurement?',
            options: ['(|0⟩ + |1⟩)/√2', '|0⟩', '|1⟩', '0'],
            correctIndex: 1,
            explanation: 'Wavefunction collapse projects the state into the measured eigenstate |0⟩.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Quantum Logic Gates',
    description: 'Explore unitary operators, Pauli matrices, phase rotations, and multi-qubit CNOT operations.',
    icon: 'Cpu',
    lessonCount: 2,
    level: 'Intermediate',
    lessons: [
      {
        id: 'les-301',
        moduleId: 'mod-3',
        title: 'Single-Qubit Unitary Gates',
        duration: '20 min',
        difficulty: 'Intermediate',
        objectives: [
          'Prove that all quantum gates are represented by unitary matrices (U†U = I).',
          'Calculate transformations using Pauli matrices X, Y, Z.',
          'Understand phase shift gates S and T.'
        ],
        summary: 'All isolated quantum operations preserve state normalization, which requires that their transformation matrices be unitary.',
        theory: [
          'Unitary condition U†U = I ensures conservation of probability: ⟨Uψ|Uψ⟩ = ⟨ψ|U†U|ψ⟩ = ⟨ψ|ψ⟩ = 1.',
          'Pauli-X behaves as a quantum NOT gate: X|0⟩ = |1⟩ and X|1⟩ = |0⟩.',
          'Pauli-Z applies a π phase shift to |1⟩: Z|0⟩ = |0⟩ and Z|1⟩ = -|1⟩.',
          'The T gate applies a π/4 phase rotation: T = diag(1, e^{iπ/4}).'
        ],
        formula: 'U^\\dagger U = I, \\quad X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\; Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
        interactiveType: 'gate',
        quiz: [
          {
            id: 'q-301-1',
            question: 'What is the matrix product X · X for the Pauli-X gate?',
            options: ['0', 'I (Identity matrix)', '-I', 'Z'],
            correctIndex: 1,
            explanation: 'Pauli gates are self-inverse: X² = Y² = Z² = I.'
          }
        ]
      },
      {
        id: 'les-302',
        moduleId: 'mod-3',
        title: 'Multi-Qubit Gates & Controlled Operations',
        duration: '22 min',
        difficulty: 'Intermediate',
        objectives: [
          'Construct multi-qubit states using the Kronecker tensor product (⊗).',
          'Analyze the Controlled-NOT (CNOT) operation matrix.',
          'Explain why universal quantum computation requires at least one entangling 2-qubit gate.'
        ],
        summary: 'Multi-qubit operations enable interaction between qubits, generating entanglement and executing conditional logic.',
        theory: [
          'The state space of two qubits is the tensor product ℂ² ⊗ ℂ² = ℂ⁴.',
          'The CNOT gate flips the target qubit if and only if the control qubit is in state |1⟩.',
          'Any quantum algorithm can be compiled into single-qubit rotations plus CNOT gates (Solovay-Kitaev / Barenco universality theorem).'
        ],
        formula: '\\text{CNOT} = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}',
        interactiveType: 'circuit',
        quiz: [
          {
            id: 'q-302-1',
            question: 'What is the output of CNOT applied to input state |10⟩ (control = 1, target = 0)?',
            options: ['|10⟩', '|11⟩', '|00⟩', '|01⟩'],
            correctIndex: 1,
            explanation: 'Since the control qubit is 1, the target qubit flips from 0 to 1, producing |11⟩.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-4',
    title: 'Entanglement & Quantum Communication',
    description: 'Investigate Einstein-Podolsky-Rosen paradox, Bell states, and quantum key distribution.',
    icon: 'Share2',
    lessonCount: 2,
    level: 'Advanced',
    lessons: [
      {
        id: 'les-401',
        moduleId: 'mod-4',
        title: 'Bell States and Quantum Entanglement',
        duration: '25 min',
        difficulty: 'Advanced',
        objectives: [
          'Derive the four maximally entangled Bell basis states.',
          'Contrast quantum correlations with classical hidden variables (Bell\'s Theorem).',
          'Demonstrate that entanglement obeys the No-Signaling Theorem.'
        ],
        summary: 'Entanglement produces correlations between measurement outcomes that cannot be explained by any local realistic theory.',
        theory: [
          'The four Bell states form an orthonormal basis for two qubits: |Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩.',
          'The state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 is created by applying H on qubit 0, followed by CNOT(0, 1).',
          'Measuring qubit 0 immediately determines qubit 1, even across cosmic distances, yet transmits zero information without classical correlation data.'
        ],
        formula: '|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}, \\quad |\\Psi^-\\rangle = \\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}}',
        interactiveType: 'entanglement',
        quiz: [
          {
            id: 'q-401-1',
            question: 'Why doesn\'t quantum entanglement allow instantaneous faster-than-light communication?',
            options: [
              'Because speed of light is infinite in vacuum.',
              'Because individual measurement outcomes are completely random without classical decoding.',
              'Because qubits decohere instantly.',
              'Because only photons can be entangled.'
            ],
            correctIndex: 1,
            explanation: 'The No-Signaling Theorem proves local density matrices are independent of remote measurement choices.'
          }
        ]
      },
      {
        id: 'les-402',
        moduleId: 'mod-4',
        title: 'BB84 Quantum Key Distribution Protocol',
        duration: '25 min',
        difficulty: 'Advanced',
        objectives: [
          'Trace the stages of the BB84 protocol (Transmission, Sifting, Error Estimation).',
          'Explain why eavesdropping inevitably increases the Quantum Bit Error Rate (QBER).',
          'Analyze security bounds and privacy amplification.'
        ],
        summary: 'BB84 exploits quantum measurement collapse to establish provably secure cryptographic keys between two parties.',
        theory: [
          'Alice sends single photons encoded randomly in Rectilinear (Z) or Diagonal (X) bases.',
          'Bob measures each photon in an independently chosen basis (Z or X).',
          'Alice and Bob publicly compare only their chosen bases and discard mismatched instances (Sifting).',
          'Any eavesdropper (Eve) who intercepts photons collapses their state, introducing ~25% error on intercepted bits, immediately exposing their presence.'
        ],
        formula: '\\text{QBER} = \\frac{\\text{Mismatches in matching bases}}{\\text{Total matching bases}} < 11\\%',
        interactiveType: 'circuit',
        quiz: [
          {
            id: 'q-402-1',
            question: 'What is the theoretical QBER threshold for BB84 above which the channel is deemed compromised?',
            options: ['1%', '5%', '11%', '50%'],
            correctIndex: 2,
            explanation: 'The Shor-Preskill security proof establishes an ~11% QBER threshold for extracting secure keys.'
          }
        ]
      }
    ]
  }
];
