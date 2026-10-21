"""
Unit tests for KEP QuantumVerse quantum simulation engine.
Validates normalization, unitary gates, entanglement creation, and measurement probabilities.
"""

import pytest
import numpy as np
from quantum_engine import (
    QuantumCircuitSimulator,
    calculate_bloch_coordinates,
    simulate_photon_polarization,
    simulate_bb84_protocol,
    simulate_ramsey_sensing,
    GATE_H,
    GATE_X,
    GATE_Y,
    GATE_Z
)


def test_initial_state_normalization():
    sim = QuantumCircuitSimulator(num_qubits=2)
    assert len(sim.state) == 4
    assert np.isclose(np.linalg.norm(sim.state), 1.0)
    assert np.isclose(sim.state[0], 1.0)
    assert np.allclose(sim.state[1:], 0.0)


def test_pauli_x_flip():
    sim = QuantumCircuitSimulator(num_qubits=1)
    # Apply X on |0> -> should become |1>
    sim.apply_single_gate(GATE_X, target_qubit=0)
    assert np.isclose(sim.state[0], 0.0)
    assert np.isclose(sim.state[1], 1.0)
    probs = sim.get_probabilities()
    assert np.isclose(probs["0"], 0.0)
    assert np.isclose(probs["1"], 1.0)


def test_hadamard_superposition():
    sim = QuantumCircuitSimulator(num_qubits=1)
    sim.apply_single_gate(GATE_H, target_qubit=0)
    # State should be (|0> + |1>) / sqrt(2)
    expected = 1 / np.sqrt(2)
    assert np.isclose(sim.state[0], expected)
    assert np.isclose(sim.state[1], expected)
    probs = sim.get_probabilities()
    assert np.isclose(probs["0"], 0.5)
    assert np.isclose(probs["1"], 0.5)


def test_bell_state_entanglement():
    sim = QuantumCircuitSimulator(num_qubits=2)
    # Apply H on qubit 0
    sim.apply_single_gate(GATE_H, target_qubit=0)
    # Apply CNOT with control=0, target=1
    sim.apply_cnot(control=0, target=1)

    # State is (|00> + |11>) / sqrt(2)
    expected_amp = 1 / np.sqrt(2)
    assert np.isclose(np.abs(sim.state[0]), expected_amp)  # |00>
    assert np.isclose(np.abs(sim.state[1]), 0.0)           # |01>
    assert np.isclose(np.abs(sim.state[2]), 0.0)           # |10>
    assert np.isclose(np.abs(sim.state[3]), expected_amp)  # |11>

    probs = sim.get_probabilities()
    assert np.isclose(probs["00"], 0.5)
    assert np.isclose(probs["01"], 0.0)
    assert np.isclose(probs["10"], 0.0)
    assert np.isclose(probs["11"], 0.5)


def test_shot_sampling_distribution():
    sim = QuantumCircuitSimulator(num_qubits=1)
    sim.apply_single_gate(GATE_H, target_qubit=0)
    shots = 2000
    counts = sim.run_shots(shots=shots)
    assert counts["0"] + counts["1"] == shots
    # By Law of Large Numbers, proportion should be within 40% - 60%
    ratio_0 = counts["0"] / shots
    assert 0.40 <= ratio_0 <= 0.60


def test_bloch_coordinates():
    # |0> state
    b0 = calculate_bloch_coordinates(1.0, 0.0)
    assert np.isclose(b0["z"], 1.0)
    assert np.isclose(b0["theta_deg"], 0.0)

    # |1> state
    b1 = calculate_bloch_coordinates(0.0, 1.0)
    assert np.isclose(b1["z"], -1.0)
    assert np.isclose(b1["theta_deg"], 180.0)

    # |+> state: (|0> + |1>)/sqrt(2) -> lies on +X axis
    b_plus = calculate_bloch_coordinates(1/np.sqrt(2), 1/np.sqrt(2))
    assert np.isclose(b_plus["x"], 1.0, atol=1e-3)
    assert np.isclose(b_plus["z"], 0.0, atol=1e-3)


def test_photon_polarization_malus_law():
    # 0 deg source, passing through 45 deg filter: cos^2(45) = 0.5
    res = simulate_photon_polarization(num_photons=1000, angles_deg=[45.0])
    assert np.isclose(res["final_transmission_pct"], 50.0)
    assert res["final_detected_photons"] == 500

    # Three polarizers: 0 deg source -> 45 deg -> 90 deg
    # Normal 0 to 90 gives 0%. But with 45 in between: 0.5 * 0.5 = 25% transmission!
    res_three = simulate_photon_polarization(num_photons=1000, angles_deg=[45.0, 90.0])
    assert np.isclose(res_three["final_transmission_pct"], 25.0)
    assert res_three["final_detected_photons"] == 250


def test_bb84_protocol_fidelity():
    # Without eavesdropper: matching bases must have 0% error
    res_clean = simulate_bb84_protocol(num_bits=32, eavesdropper_present=False)
    assert res_clean["mismatches"] == 0
    assert res_clean["qber_percentage"] == 0.0
    assert res_clean["is_channel_secure"] is True


def test_ramsey_sensing_limits():
    res = simulate_ramsey_sensing(detuning_mhz=1.0, duration_ns=250.0, num_atoms=100)
    assert res["standard_quantum_limit"] > res["heisenberg_limit"]
    assert np.isclose(res["quantum_advantage_ratio"], 10.0)
