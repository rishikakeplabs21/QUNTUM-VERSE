"""
KEP QuantumVerse - Scientifically Grounded Quantum Simulation Engine
Implements statevector evolution, quantum gates, measurement probabilities,
Bloch sphere representations, Bell states, and quantum protocol simulations.
"""

from typing import List, Dict, Any, Tuple
import numpy as np

# Standard Quantum Gates (2x2)
GATE_I = np.array([[1, 0], [0, 1]], dtype=complex)
GATE_X = np.array([[0, 1], [1, 0]], dtype=complex)  # Pauli-X (NOT)
GATE_Y = np.array([[0, -1j], [1j, 0]], dtype=complex)  # Pauli-Y
GATE_Z = np.array([[1, 0], [0, -1]], dtype=complex)  # Pauli-Z
GATE_H = (1 / np.sqrt(2)) * np.array([[1, 1], [1, -1]], dtype=complex)  # Hadamard
GATE_S = np.array([[1, 0], [0, 1j]], dtype=complex)  # Phase gate (pi/2)
GATE_T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)  # T gate (pi/4)

def rx(theta: float) -> np.ndarray:
    """Rotation around X-axis by angle theta."""
    return np.array([
        [np.cos(theta / 2), -1j * np.sin(theta / 2)],
        [-1j * np.sin(theta / 2), np.cos(theta / 2)]
    ], dtype=complex)

def ry(theta: float) -> np.ndarray:
    """Rotation around Y-axis by angle theta."""
    return np.array([
        [np.cos(theta / 2), -np.sin(theta / 2)],
        [np.sin(theta / 2), np.cos(theta / 2)]
    ], dtype=complex)

def rz(theta: float) -> np.ndarray:
    """Rotation around Z-axis by angle theta."""
    return np.array([
        [np.exp(-1j * theta / 2), 0],
        [0, np.exp(1j * theta / 2)]
    ], dtype=complex)

# Standard Two-Qubit Gates (4x4)
# Computational basis: |00>, |01>, |10>, |11>
CNOT_0_1 = np.array([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0]
], dtype=complex)

SWAP = np.array([
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1]
], dtype=complex)


class QuantumCircuitSimulator:
    """
    N-qubit statevector circuit simulator.
    Tracks statevector evolution through matrix multiplications and computes
    exact probability distributions and shot-based measurements.
    """

    def __init__(self, num_qubits: int = 2):
        if num_qubits < 1 or num_qubits > 6:
            raise ValueError("Supported number of qubits is between 1 and 6 for this simulator.")
        self.num_qubits = num_qubits
        self.dim = 2 ** num_qubits
        # Initialize state |0...0>
        self.state = np.zeros(self.dim, dtype=complex)
        self.state[0] = 1.0 + 0.0j

    def reset(self):
        """Reset circuit state to |00...0>."""
        self.state = np.zeros(self.dim, dtype=complex)
        self.state[0] = 1.0 + 0.0j

    def apply_single_gate(self, gate: np.ndarray, target_qubit: int):
        """
        Apply a 2x2 unitary gate to target_qubit in an N-qubit system.
        Uses Kronecker tensor products. Qubit 0 is the most significant qubit.
        """
        if target_qubit < 0 or target_qubit >= self.num_qubits:
            raise ValueError(f"Target qubit {target_qubit} out of range [0, {self.num_qubits - 1}]")

        full_op = np.array([[1.0]], dtype=complex)
        for q in range(self.num_qubits):
            if q == target_qubit:
                full_op = np.kron(full_op, gate)
            else:
                full_op = np.kron(full_op, GATE_I)

        self.state = full_op @ self.state
        self._normalize()

    def apply_cnot(self, control: int, target: int):
        """
        Apply a Controlled-NOT (CNOT) gate between control and target qubits.
        Constructs the full 2^N x 2^N unitary matrix.
        """
        if control == target:
            raise ValueError("Control and target qubits cannot be identical.")
        if control < 0 or control >= self.num_qubits or target < 0 or target >= self.num_qubits:
            raise ValueError(f"Control ({control}) or Target ({target}) out of range.")

        full_op = np.zeros((self.dim, self.dim), dtype=complex)
        for i in range(self.dim):
            # Check bit value of control qubit
            # Qubit 0 is most significant bit: shift by (num_qubits - 1 - control)
            ctrl_bit = (i >> (self.num_qubits - 1 - control)) & 1
            if ctrl_bit == 1:
                # Flip the target bit
                target_mask = 1 << (self.num_qubits - 1 - target)
                flipped_index = i ^ target_mask
                full_op[flipped_index, i] = 1.0
            else:
                full_op[i, i] = 1.0

        self.state = full_op @ self.state
        self._normalize()

    def _normalize(self):
        """Ensure statevector satisfies sum |c_i|^2 = 1 within numerical tolerance."""
        norm = np.linalg.norm(self.state)
        if norm > 1e-12:
            self.state = self.state / norm

    def get_probabilities(self) -> Dict[str, float]:
        """Return dictionary mapping binary state strings to measurement probabilities."""
        probs = np.abs(self.state) ** 2
        result = {}
        for idx, p in enumerate(probs):
            bit_str = format(idx, f"0{self.num_qubits}b")
            result[bit_str] = float(np.round(p, 6))
        return result

    def get_statevector_info(self) -> List[Dict[str, Any]]:
        """Return full state vector details: amplitude, real, imag, phase, probability."""
        probs = np.abs(self.state) ** 2
        details = []
        for idx in range(self.dim):
            val = self.state[idx]
            amplitude = float(np.abs(val))
            phase = float(np.angle(val))
            bit_str = format(idx, f"0{self.num_qubits}b")
            details.append({
                "basis": f"|{bit_str}⟩",
                "index": idx,
                "real": float(np.round(val.real, 6)),
                "imag": float(np.round(val.imag, 6)),
                "magnitude": float(np.round(amplitude, 6)),
                "phase_rad": float(np.round(phase, 4)),
                "phase_deg": float(np.round(np.degrees(phase), 2)),
                "probability": float(np.round(probs[idx], 6))
            })
        return details

    def run_shots(self, shots: int = 1024) -> Dict[str, int]:
        """Perform simulated shot measurements according to quantum Born's rule."""
        probs = np.abs(self.state) ** 2
        # Correct floating point drift so sum is exactly 1.0
        probs = probs / np.sum(probs)
        indices = np.random.choice(self.dim, size=shots, p=probs)
        counts = {format(i, f"0{self.num_qubits}b"): 0 for i in range(self.dim)}
        for idx in indices:
            bit_str = format(idx, f"0{self.num_qubits}b")
            counts[bit_str] += 1
        return counts


def calculate_bloch_coordinates(alpha: complex, beta: complex) -> Dict[str, float]:
    """
    Calculate Bloch Sphere angles and Cartesian coordinates for a single qubit state:
    |psi> = alpha |0> + beta |1>
    where alpha = cos(theta/2), beta = e^(i phi) sin(theta/2)
    """
    norm = np.sqrt(abs(alpha)**2 + abs(beta)**2)
    if norm < 1e-12:
        return {"theta": 0.0, "phi": 0.0, "x": 0.0, "y": 0.0, "z": 1.0}
    a = alpha / norm
    b = beta / norm

    # Remove global phase so that alpha is real and non-negative
    phase_alpha = np.angle(a)
    a_real = a * np.exp(-1j * phase_alpha)
    b_relative = b * np.exp(-1j * phase_alpha)

    # Compute theta and phi
    theta = 2 * np.arccos(np.clip(a_real.real, 0.0, 1.0))
    phi = np.angle(b_relative)
    if phi < 0:
        phi += 2 * np.pi

    # Cartesian coordinates on unit sphere
    x = float(np.sin(theta) * np.cos(phi))
    y = float(np.sin(theta) * np.sin(phi))
    z = float(np.cos(theta))

    return {
        "theta_rad": float(np.round(theta, 4)),
        "theta_deg": float(np.round(np.degrees(theta), 2)),
        "phi_rad": float(np.round(phi, 4)),
        "phi_deg": float(np.round(np.degrees(phi), 2)),
        "x": float(np.round(x, 4)),
        "y": float(np.round(y, 4)),
        "z": float(np.round(z, 4)),
        "p0": float(np.round(abs(a)**2, 4)),
        "p1": float(np.round(abs(b)**2, 4)),
    }


def simulate_photon_polarization(num_photons: int, angles_deg: List[float]) -> Dict[str, Any]:
    """
    Simulate photon polarization through a sequence of linear polarizers (Malus' Law).
    Demonstrates quantum projection: initial photon polarized at 0 deg passes through filters.
    """
    # Initial state polarized along 0 degrees: |0> = [1, 0]
    intensity = 1.0
    stage_results = []
    current_angle_deg = 0.0  # Initial light source polarization (horizontal)

    for idx, angle in enumerate(angles_deg):
        delta_theta = np.radians(angle - current_angle_deg)
        transmission_factor = float(np.cos(delta_theta) ** 2)
        intensity *= transmission_factor
        transmitted_photons = int(np.round(num_photons * intensity))
        stage_results.append({
            "filter_index": idx + 1,
            "filter_angle_deg": angle,
            "relative_angle_deg": float(np.round(angle - current_angle_deg, 2)),
            "transmission_fraction": float(np.round(transmission_factor, 4)),
            "cumulative_transmission": float(np.round(intensity, 4)),
            "detected_photons": transmitted_photons
        })
        current_angle_deg = angle

    return {
        "initial_photons": num_photons,
        "final_transmission_pct": float(np.round(intensity * 100, 2)),
        "final_detected_photons": int(np.round(num_photons * intensity)),
        "stages": stage_results,
        "quantum_insight": (
            "Each polarizer acts as a quantum measurement projector. "
            "A photon either passes and collapses into the polarizer's eigenstate, or is absorbed."
        )
    }


def simulate_bb84_protocol(num_bits: int = 16, eavesdropper_present: bool = False) -> Dict[str, Any]:
    """
    Simulate the BB84 Quantum Key Distribution (QKD) protocol.
    Bases: 0 = Computational (Z: 0->|0>, 1->|1>), 1 = Hadamard (X: 0->|+>, 1->|->).
    When Eve measures in the wrong basis, she introduces ~25% QBER in matching bases.
    """
    np.random.seed(None)
    alice_bits = np.random.randint(0, 2, size=num_bits).tolist()
    alice_bases = np.random.choice(["Z", "X"], size=num_bits).tolist()
    bob_bases = np.random.choice(["Z", "X"], size=num_bits).tolist()

    transmitted_bits = list(alice_bits)
    eve_bases = []
    eve_bits = []

    if eavesdropper_present:
        eve_bases = np.random.choice(["Z", "X"], size=num_bits).tolist()
        for i in range(num_bits):
            if eve_bases[i] == alice_bases[i]:
                # Eve measures in same basis as Alice: no disturbance
                eve_measured = alice_bits[i]
            else:
                # Eve measures in conjugate basis: random outcome 50/50 collapse
                eve_measured = int(np.random.randint(0, 2))
            eve_bits.append(eve_measured)
            # The photon state collapses to Eve's measurement basis!
            transmitted_bits[i] = eve_measured

    # Bob measures the received photon in his chosen basis
    bob_bits = []
    for i in range(num_bits):
        received_basis = eve_bases[i] if eavesdropper_present else alice_bases[i]
        received_bit = transmitted_bits[i]

        if bob_bases[i] == received_basis:
            bob_bits.append(received_bit)
        else:
            # 50% chance of 0 or 1 due to quantum collapse in complementary basis
            bob_bits.append(int(np.random.randint(0, 2)))

    # Basis reconciliation (Sifting)
    sifted_indices = [i for i in range(num_bits) if alice_bases[i] == bob_bases[i]]
    alice_sifted = [alice_bits[i] for i in sifted_indices]
    bob_sifted = [bob_bits[i] for i in sifted_indices]

    # Calculate Quantum Bit Error Rate (QBER)
    mismatches = sum(1 for a, b in zip(alice_sifted, bob_sifted) if a != b)
    sifted_len = len(sifted_indices)
    qber = (mismatches / sifted_len) if sifted_len > 0 else 0.0

    return {
        "num_bits": num_bits,
        "eavesdropper_present": eavesdropper_present,
        "alice_bits": alice_bits,
        "alice_bases": alice_bases,
        "bob_bases": bob_bases,
        "bob_bits": bob_bits,
        "eve_bases": eve_bases if eavesdropper_present else None,
        "sifted_indices": sifted_indices,
        "alice_sifted_key": alice_sifted,
        "bob_sifted_key": bob_sifted,
        "sifted_key_length": sifted_len,
        "mismatches": mismatches,
        "qber_percentage": float(np.round(qber * 100, 2)),
        "is_channel_secure": qber < 0.11,  # Threshold ~11% for BB84 security
        "explanation": (
            "Channel is compromised by Eve's measurements!" if eavesdropper_present and qber > 0.08
            else "Channel is secure. Key sifting successful with matching bases."
        )
    }


def simulate_ramsey_sensing(detuning_mhz: float, duration_ns: float, num_atoms: int = 100) -> Dict[str, Any]:
    """
    Simulate Ramsey interferometry for quantum magnetometry / atomic clock sensing.
    P(|1>) = sin^2(2*pi*delta*t / 2) = 0.5 * (1 - cos(2*pi*delta*t))
    Calculates Phase precision comparing Standard Quantum Limit (SQL 1/sqrt(N)) vs Heisenberg Limit (1/N).
    """
    omega = 2 * np.pi * (detuning_mhz * 1e6)
    t = duration_ns * 1e-9
    phase = omega * t
    p1 = 0.5 * (1 - np.cos(phase))
    p0 = 1.0 - p1

    sql = 1.0 / np.sqrt(num_atoms)
    heisenberg_limit = 1.0 / num_atoms

    return {
        "detuning_mhz": detuning_mhz,
        "duration_ns": duration_ns,
        "accumulated_phase_rad": float(np.round(phase % (2 * np.pi), 4)),
        "prob_excited_p1": float(np.round(p1, 4)),
        "prob_ground_p0": float(np.round(p0, 4)),
        "num_atoms": num_atoms,
        "standard_quantum_limit": float(np.round(sql, 5)),
        "heisenberg_limit": float(np.round(heisenberg_limit, 5)),
        "quantum_advantage_ratio": float(np.round(sql / heisenberg_limit, 2))
    }
