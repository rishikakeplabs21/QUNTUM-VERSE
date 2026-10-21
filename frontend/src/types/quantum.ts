export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'MEASURE';

export interface GateStep {
  id: string;
  gate: GateType;
  target: number;
  control?: number;
  stepIndex: number;
}

export interface StateVectorItem {
  basis: string;
  index: number;
  real: number;
  imag: number;
  magnitude: number;
  phase_rad: number;
  phase_deg: number;
  probability: number;
}

export interface SimulationResult {
  num_qubits: number;
  gate_count: number;
  statevector: StateVectorItem[];
  probabilities: Record<string, number>;
  shots_count: Record<string, number>;
  total_shots: number;
}

export interface BlochCoordinates {
  theta_rad: number;
  theta_deg: number;
  phi_rad: number;
  phi_deg: number;
  x: number;
  y: number;
  z: number;
  p0: number;
  p1: number;
}

export interface LessonQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  summary: string;
  theory: string[];
  formula?: string;
  interactiveType: 'bloch' | 'gate' | 'measurement' | 'entanglement' | 'circuit';
  quiz: LessonQuestion[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonCount: number;
  level: string;
  lessons: Lesson[];
}

export interface ExperimentMetadata {
  id: string;
  roadmapIndex: number;
  title: string;
  category: 'Fundamentals' | 'Optics' | 'Qubits' | 'Algorithms' | 'Protocols';
  status: 'implemented' | 'roadmap';
  tagline: string;
  objective: string;
  theory: string;
}

export interface ExperimentRunRecord {
  id: string;
  experimentId: string;
  title: string;
  timestamp: string;
  parameters: Record<string, any>;
  summary: string;
}

export interface BB84Result {
  num_bits: number;
  eavesdropper_present: boolean;
  alice_bits: number[];
  alice_bases: string[];
  bob_bases: string[];
  bob_bits: number[];
  eve_bases?: string[];
  sifted_indices: number[];
  alice_sifted_key: number[];
  bob_sifted_key: number[];
  sifted_key_length: number;
  mismatches: number;
  qber_percentage: number;
  is_channel_secure: boolean;
  explanation: string;
}

export interface RamseySensingResult {
  detuning_mhz: float;
  duration_ns: float;
  accumulated_phase_rad: number;
  prob_excited_p1: number;
  prob_ground_p0: number;
  num_atoms: number;
  standard_quantum_limit: number;
  heisenberg_limit: number;
  quantum_advantage_ratio: number;
}

type float = number;
