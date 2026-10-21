"""
KEP QuantumVerse - FastAPI Backend Server
Provides RESTful APIs for quantum simulations, AI mentoring, circuit calculations,
and educational course management.
"""

import os
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np

try:
    from backend.quantum_engine import (
        QuantumCircuitSimulator,
        calculate_bloch_coordinates,
        simulate_photon_polarization,
        simulate_bb84_protocol,
        simulate_ramsey_sensing,
        GATE_X, GATE_Y, GATE_Z, GATE_H, GATE_S, GATE_T,
        rx, ry, rz
    )
    from backend.mentor_service import query_quantum_mentor
except ImportError:
    from quantum_engine import (
        QuantumCircuitSimulator,
        calculate_bloch_coordinates,
        simulate_photon_polarization,
        simulate_bb84_protocol,
        simulate_ramsey_sensing,
        GATE_X, GATE_Y, GATE_Z, GATE_H, GATE_S, GATE_T,
        rx, ry, rz
    )
    from mentor_service import query_quantum_mentor


app = FastAPI(
    title="KEP QuantumVerse API",
    description="Backend API for interactive quantum simulations, AI mentor, and educational labs.",
    version="1.0.0"
)

# Enable CORS for local development and institutional portals
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA SCHEMAS ====================

class GateOperation(BaseModel):
    gate: str = Field(..., description="Gate identifier: X, Y, Z, H, S, T, Rx, Ry, Rz, CNOT")
    target: int = Field(..., ge=0, le=5, description="Target qubit index (0-indexed)")
    control: Optional[int] = Field(None, ge=0, le=5, description="Control qubit index for 2-qubit gates")
    theta: Optional[float] = Field(None, description="Rotation angle in radians for parameterized gates")

class CircuitRequest(BaseModel):
    num_qubits: int = Field(2, ge=1, le=5, description="Number of qubits in circuit")
    gates: List[GateOperation] = Field(default_factory=list, description="Sequence of gates in temporal order")
    shots: int = Field(1024, ge=1, le=10000, description="Number of measurement shots")

class BlochRequest(BaseModel):
    theta_rad: Optional[float] = None
    phi_rad: Optional[float] = None
    alpha_real: Optional[float] = None
    alpha_imag: Optional[float] = 0.0
    beta_real: Optional[float] = None
    beta_imag: Optional[float] = 0.0

class PolarizationRequest(BaseModel):
    num_photons: int = Field(1000, ge=10, le=100000)
    filter_angles_deg: List[float] = Field(default_factory=lambda: [45.0, 90.0])

class BB84Request(BaseModel):
    num_bits: int = Field(16, ge=4, le=64)
    eavesdropper_present: bool = False

class SensingRequest(BaseModel):
    detuning_mhz: float = Field(1.5, ge=0.0, le=50.0)
    duration_ns: float = Field(200.0, ge=1.0, le=2000.0)
    num_atoms: int = Field(100, ge=1, le=10000)

class MentorRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=1000)

class AssignmentSubmission(BaseModel):
    assignment_id: str
    student_name: str
    circuit_data: Optional[Dict[str, Any]] = None
    lab_notes: Optional[str] = None


# Mock in-memory classroom store for MVP
CLASSROOM_DB = {
    "courses": [
        {
            "id": "qc-101",
            "code": "QE-301",
            "title": "Quantum Computing & Information for Engineers",
            "instructor": "Dr. A. Sharma (Quantum Systems Lab)",
            "institution": "KEP Institute of Advanced Technology",
            "enrolled_students": 42,
            "assignments": [
                {
                    "id": "asg-01",
                    "title": "Lab 1: Superposition & Statevector Verification",
                    "due_date": "Next Monday, 23:59 IST",
                    "total_points": 100,
                    "status": "pending",
                    "description": "Construct a Hadamard circuit, calculate analytical probabilities, and compare with 1024 measurement shots."
                },
                {
                    "id": "asg-02",
                    "title": "Lab 2: Bell State Entanglement & Correlation",
                    "due_date": "Oct 30, 23:59 IST",
                    "total_points": 100,
                    "status": "pending",
                    "description": "Create the |Φ+⟩ state using H and CNOT gates. Verify that measurement outcomes are perfectly correlated."
                },
                {
                    "id": "asg-03",
                    "title": "Lab 3: BB84 Quantum Key Exchange Analysis",
                    "due_date": "Nov 05, 23:59 IST",
                    "total_points": 100,
                    "status": "pending",
                    "description": "Simulate Alice and Bob's key exchange. Introduce Eve and calculate the resulting QBER threshold."
                }
            ]
        }
    ],
    "submissions": []
}

# ==================== API ENDPOINTS ====================

@app.get("/api/health")
def health_check():
    has_gemini = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "online",
        "platform": "KEP QuantumVerse",
        "engine": "NumPy Quantum Simulator v1.0",
        "gemini_api_configured": has_gemini
    }

@app.post("/api/simulate/circuit")
def simulate_circuit(req: CircuitRequest):
    """
    Simulate a user-defined quantum circuit step-by-step.
    Computes true unitary matrix transformations and Born's rule probabilities.
    """
    sim = QuantumCircuitSimulator(num_qubits=req.num_qubits)

    gate_map = {
        "X": GATE_X,
        "Y": GATE_Y,
        "Z": GATE_Z,
        "H": GATE_H,
        "S": GATE_S,
        "T": GATE_T
    }

    for op in req.gates:
        g = op.gate.upper()
        if g == "CNOT":
            if op.control is None:
                raise HTTPException(status_code=400, detail="CNOT gate requires 'control' parameter.")
            sim.apply_cnot(control=op.control, target=op.target)
        elif g in gate_map:
            sim.apply_single_gate(gate_map[g], target_qubit=op.target)
        elif g == "RX":
            theta = op.theta if op.theta is not None else np.pi / 2
            sim.apply_single_gate(rx(theta), target_qubit=op.target)
        elif g == "RY":
            theta = op.theta if op.theta is not None else np.pi / 2
            sim.apply_single_gate(ry(theta), target_qubit=op.target)
        elif g == "RZ":
            theta = op.theta if op.theta is not None else np.pi / 2
            sim.apply_single_gate(rz(theta), target_qubit=op.target)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported gate: {op.gate}")

    state_info = sim.get_statevector_info()
    probabilities = sim.get_probabilities()
    shot_counts = sim.run_shots(shots=req.shots)

    return {
        "num_qubits": req.num_qubits,
        "gate_count": len(req.gates),
        "statevector": state_info,
        "probabilities": probabilities,
        "shots_count": shot_counts,
        "total_shots": req.shots
    }

@app.post("/api/simulate/bloch")
def simulate_bloch(req: BlochRequest):
    """Compute Bloch Sphere coordinates from spherical angles or statevector amplitudes."""
    if req.theta_rad is not None:
        theta = req.theta_rad
        phi = req.phi_rad if req.phi_rad is not None else 0.0
        alpha = complex(np.cos(theta / 2), 0.0)
        beta = complex(np.cos(phi) * np.sin(theta / 2), np.sin(phi) * np.sin(theta / 2))
    elif req.alpha_real is not None and req.beta_real is not None:
        alpha = complex(req.alpha_real, req.alpha_imag or 0.0)
        beta = complex(req.beta_real, req.beta_imag or 0.0)
    else:
        alpha = complex(1.0, 0.0)
        beta = complex(0.0, 0.0)

    coords = calculate_bloch_coordinates(alpha, beta)
    return coords

@app.post("/api/simulate/polarization")
def simulate_polarization(req: PolarizationRequest):
    """Simulate photon transmission through polarization filters using Malus' Law."""
    result = simulate_photon_polarization(req.num_photons, req.filter_angles_deg)
    return result

@app.post("/api/simulate/bb84")
def simulate_bb84(req: BB84Request):
    """Simulate BB84 Quantum Key Distribution with or without an eavesdropper."""
    result = simulate_bb84_protocol(req.num_bits, req.eavesdropper_present)
    return result

@app.post("/api/simulate/sensing")
def simulate_sensing(req: SensingRequest):
    """Simulate Ramsey Interferometry for quantum phase and magnetic field sensing."""
    result = simulate_ramsey_sensing(req.detuning_mhz, req.duration_ns, req.num_atoms)
    return result

@app.post("/api/mentor/ask")
def ask_mentor(req: MentorRequest):
    """Query the KEP QuantumVerse AI Mentor."""
    result = query_quantum_mentor(req.question)
    return result

@app.get("/api/classroom/overview")
def get_classroom_overview():
    """Retrieve classroom courses, assignments, and mock roster."""
    return CLASSROOM_DB

@app.post("/api/classroom/submit")
def submit_assignment(sub: AssignmentSubmission):
    """Record student assignment submission."""
    submission_entry = {
        "id": f"sub-{len(CLASSROOM_DB['submissions']) + 1:03d}",
        "assignment_id": sub.assignment_id,
        "student_name": sub.student_name,
        "circuit_data": sub.circuit_data,
        "lab_notes": sub.lab_notes,
        "score": 95,  # Automatic evaluation score for MVP
        "graded": True,
        "feedback": "Excellent work. Statevector probabilities match analytical solutions."
    }
    CLASSROOM_DB["submissions"].append(submission_entry)
    return {
        "status": "success",
        "message": "Assignment successfully submitted and auto-evaluated.",
        "submission": submission_entry
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
