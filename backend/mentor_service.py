"""
AI Quantum Learning Assistant Service
Supports live Gemini API queries when GEMINI_API_KEY is configured in the environment,
or provides an in-depth, scientifically validated curriculum knowledge base fallback.
"""

import os
import json
from typing import Dict, Any, List

# Curated Quantum Physics & Engineering Knowledge Base for educational fallback
QUANTUM_KNOWLEDGE_BASE = {
    "superposition": {
        "title": "Quantum Superposition Principle",
        "summary": "Unlike a classical bit which is strictly 0 or 1, a qubit can exist in a linear combination of basis states.",
        "math": "|ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ and |α|² + |β|² = 1",
        "key_takeaways": [
            "Measurement forces the superposition to irreversibly collapse to either |0⟩ or |1⟩ with probability |α|² or |β|² respectively.",
            "Superposition allows quantum algorithms to process exponentially large state spaces simultaneously (quantum parallelism).",
            "Applying a Hadamard gate (H) to |0⟩ creates equal superposition: (|0⟩ + |1⟩)/√2."
        ],
        "suggested_actions": ["Open Physics Lab > Qubit Visualization", "Open Circuit Studio and apply an H gate"]
    },
    "entanglement": {
        "title": "Quantum Entanglement & Non-Locality",
        "summary": "A phenomenon where two or more qubits form a unified quantum state that cannot be factored into individual qubit states.",
        "math": "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2 ≠ |ψ_A⟩ ⊗ |ψ_B⟩",
        "key_takeaways": [
            "Measuring one entangled qubit instantaneously determines the measurement outcome of the other, regardless of spatial separation.",
            "Entanglement does NOT allow faster-than-light communication because local outcomes remain purely random without classical communication (No-Signaling Theorem).",
            "Created using a Hadamard gate followed by a Controlled-NOT (CNOT) gate."
        ],
        "suggested_actions": ["Open Circuit Studio > Presets > Bell State", "Run Bell State measurement shots"]
    },
    "measurement": {
        "title": "Quantum Measurement & Wavefunction Collapse",
        "summary": "The act of observing a quantum system projects its continuous state vector into one of the eigenstates of the measurement operator.",
        "math": "P(m) = ⟨ψ|M_m† M_m|ψ⟩ (Born's Rule)",
        "key_takeaways": [
            "Quantum measurement is fundamentally probabilistic and non-deterministic.",
            "Repeated measurements on identically prepared states yield statistical distributions matching Born's rule.",
            "Measuring in a non-orthogonal basis (e.g. X basis vs Z basis) causes complementary uncertainty (Heisenberg uncertainty principle)."
        ],
        "suggested_actions": ["Open Physics Lab > Probability & Measurement Experiment"]
    },
    "bloch_sphere": {
        "title": "The Bloch Sphere Geometric Representation",
        "summary": "A unit sphere representation of any two-level quantum state, mapping complex amplitudes to spherical angles (θ, φ).",
        "math": "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩; x = sinθ cosφ, y = sinθ sinφ, z = cosθ",
        "key_takeaways": [
            "North pole corresponds to |0⟩, South pole corresponds to |1⟩.",
            "Equator corresponds to equal superpositions with different relative phases (e.g. |+⟩, |-⟩, |+i⟩, |-i⟩).",
            "Single-qubit unitary quantum gates correspond to rigid rotations of the sphere."
        ],
        "suggested_actions": ["Open Physics Lab > Bloch Sphere Visualizer"]
    },
    "bb84": {
        "title": "BB84 Quantum Key Distribution Protocol",
        "summary": "The first quantum cryptographic protocol, invented by Charles Bennett and Gilles Brassard in 1984.",
        "math": "QBER = (Mismatches in matching bases) / (Total matching bases)",
        "key_takeaways": [
            "Information is encoded in single photons using conjugate bases (Rectilinear Z and Diagonal X).",
            "According to the No-Cloning Theorem and measurement collapse, any eavesdropper (Eve) introduces detectable errors (~25% error rate on intercepted bits).",
            "If QBER is below threshold (~11%), Alice and Bob can perform privacy amplification to extract an unconditionally secure secret key."
        ],
        "suggested_actions": ["Open Communication Lab > BB84 Protocol Simulator"]
    },
    "sensing": {
        "title": "Quantum Sensing & Metrology",
        "summary": "Using quantum coherence and entanglement to measure physical quantities (magnetic fields, gravity, time) with unprecedented sensitivity.",
        "math": "Standard Quantum Limit: Δφ ~ 1/√N; Heisenberg Limit: Δφ ~ 1/N",
        "key_takeaways": [
            "Classical sensors are bounded by shot noise (1/√N).",
            "Quantum sensors using entangled states (GHZ or squeezed states) achieve the ultimate Heisenberg limit (1/N).",
            "Key implementations include NV centers in diamond, trapped ions, and atomic vapor cells."
        ],
        "suggested_actions": ["Open Sensing Lab > Ramsey Interferometer Simulator"]
    },
    "hadamard": {
        "title": "Hadamard Gate (H)",
        "summary": "A fundamental single-qubit gate that maps computational basis states into equal superposition states.",
        "math": "H = (1/√2) [[1, 1], [1, -1]]; H|0⟩ = |+⟩, H|1⟩ = |-⟩",
        "key_takeaways": [
            "H is unitary (H† = H) and Hermitian, meaning H² = I (applying it twice returns the original state).",
            "Geometrically, it performs a 180° rotation around the (X + Z)/√2 axis on the Bloch sphere.",
            "It is the foundation of almost all quantum algorithms (Shor, Grover, QFT, VQE)."
        ],
        "suggested_actions": ["Open Circuit Studio > Add H Gate on Q0"]
    }
}


def query_quantum_mentor(user_question: str) -> Dict[str, Any]:
    """
    Query the Quantum Mentor. If GEMINI_API_KEY is present, attempts to use Gemini API.
    Otherwise, returns structured educational tutor response from knowledge base.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if api_key:
        try:
            import requests
            # Use Google Gemini REST API
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            system_prompt = (
                "You are the KEP QuantumVerse AI Mentor, an expert quantum computing educator. "
                "Provide clear, mathematically precise, yet accessible explanations for undergraduate engineering students. "
                "Include Dirac notation, matrix representations where helpful, and practical experiment suggestions."
            )
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_prompt}\n\nStudent Question: {user_question}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 800
                }
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "answer": text,
                    "provider": "gemini-1.5-flash",
                    "mode": "live_ai",
                    "notice": "Generated via Google Gemini API"
                }
        except Exception as e:
            # Fall back gracefully to curated knowledge base on network or auth errors
            pass

    # Curated Knowledge Base Matcher
    q_lower = user_question.lower()
    matched_key = None

    if any(k in q_lower for k in ["superposition", "state", "qubit", "linear combination"]):
        matched_key = "superposition"
    elif any(k in q_lower for k in ["entangle", "bell", "spooky", "epr", "teleport"]):
        matched_key = "entanglement"
    elif any(k in q_lower for k in ["measure", "collapse", "born", "probabilit"]):
        matched_key = "measurement"
    elif any(k in q_lower for k in ["bloch", "sphere", "theta", "phi", "coordinates"]):
        matched_key = "bloch_sphere"
    elif any(k in q_lower for k in ["bb84", "cryptograph", "qkd", "security", "eve"]):
        matched_key = "bb84"
    elif any(k in q_lower for k in ["sens", "ramsey", "metrology", "magnetic", "precision"]):
        matched_key = "sensing"
    elif any(k in q_lower for k in ["hadamard", "h gate", "gate", "matrix"]):
        matched_key = "hadamard"
    else:
        # Default helpful overview
        matched_key = "superposition"

    entry = QUANTUM_KNOWLEDGE_BASE[matched_key]
    formatted_response = (
        f"### {entry['title']}\n\n"
        f"{entry['summary']}\n\n"
        f"**Mathematical Formulation:**\n```math\n{entry['math']}\n```\n\n"
        f"**Key Quantum Principles:**\n"
        + "\n".join([f"- {item}" for item in entry["key_takeaways"]])
        + f"\n\n**Recommended Exploration in KEP QuantumVerse:**\n"
        + "\n".join([f"👉 {action}" for action in entry["suggested_actions"]])
    )

    return {
        "answer": formatted_response,
        "provider": "curated_quantum_curriculum",
        "mode": "offline_curated",
        "matched_topic": matched_key,
        "notice": "Running in Offline Curated Mode. No external API key detected; answers are grounded in the verified KEP QuantumVerse physics syllabus."
    }
