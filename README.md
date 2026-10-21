# KEP QuantumVerse

> **Academic Interactive Quantum Technology Learning & Simulation Platform**  
> Designed for undergraduate engineering students, faculty, and academic research institutions.

---

## 1. Product Overview

**KEP QuantumVerse** bridges fundamental quantum mechanics, linear algebra, interactive circuit simulation, quantum communications, and quantum sensing through mathematically verified models and a modern, accessible interface.

Unlike static educational mockups or abstract code libraries, KEP QuantumVerse provides an end-to-end interactive laboratory where students and faculty can:
* Visualize quantum statevectors and Bloch spheres in real time.
* Construct multi-qubit circuits with unitary gate cascades (H, X, Y, Z, S, T, CNOT).
* Sample projective measurements according to Born's rule ($P(m) = |\langle m|\psi\rangle|^2$).
* Simulate photon polarization projection and the three-polarizer quantum eraser paradox (Malus' Law).
* Analyze Quantum Key Distribution (BB84 protocol) and observe how eavesdropping induces detectable error rates (QBER).
* Simulate Ramsey interferometry to compare the classical Standard Quantum Limit ($1/\sqrt{N}$) against the Heisenberg limit ($1/N$).
* Consult an AI-powered Quantum Mentor with live Gemini API integration or a verified offline curriculum fallback.
* Track individual learning progress, log experiment runs, manage classroom lab assignments, and export official academic transcripts.

---

## 2. Technology Stack

### Frontend
* **React 19** & **TypeScript**
* **Vite 8**
* **Tailwind CSS 4**
* **Lucide React** (Crisp vector icons)
* **React Router v7** (Client-side routing)
* **Recharts 3** (Interactive probability and shot histograms)

### Backend & Quantum Engine
* **Python 3.14**
* **FastAPI** & **Uvicorn**
* **NumPy 2.5** (Scientifically validated complex matrix operations, tensor products, statevector evolution, and multinomial shot distributions)
* **Pydantic v2** (Strict request/response schema validation)
* **Pytest 9.1** (Automated test suite verifying quantum gates, Bell state entanglement, and Born rule probabilities)

---

## 3. Project Structure

```
quntum verse/
├── backend/
│   ├── main.py                  # FastAPI RESTful API & simulation endpoints
│   ├── quantum_engine.py        # Scientifically grounded NumPy quantum simulation engine
│   ├── mentor_service.py        # AI Mentor with Gemini API & verified curriculum fallback
│   ├── test_quantum_engine.py   # Pytest suite testing normalization, gates & Bell states
│   └── requirements.txt         # Backend Python dependencies
├── frontend/
│   ├── public/
│   │   └── logo.svg             # KEP QuantumVerse brand orbital logo
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Sidebar.tsx             # Main navigation & progress indicator
│   │   │       ├── Header.tsx              # Search, live engine status & role switch
│   │   │       ├── BlochSphereVisualizer.tsx # 3D projected interactive Bloch sphere
│   │   │       ├── ProbabilityHistogram.tsx  # Recharts statevector / shots bar chart
│   │   │       └── MathBlock.tsx           # Mathematical formula renderer
│   │   ├── context/
│   │   │   └── QuantumContext.tsx          # LocalStorage-backed progress, circuits & logs
│   │   ├── data/
│   │   │   ├── curriculumData.ts          # 4 Modules, 8 Lessons, Objectives, Quizzes
│   │   │   └── experimentsData.ts         # Catalog of all 10 initial roadmap experiments
│   │   ├── lib/
│   │   │   └── quantum.ts                 # Client-side quantum math library & API bridge
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx          # Metrics, recommended lessons & quick links
│   │   │   ├── LearnPage.tsx              # Curriculum reader with quizzes & Dirac notation
│   │   │   ├── PhysicsLabPage.tsx         # Interactive virtual experiments (Exp #1, #2, #5, #7)
│   │   │   ├── CircuitStudioPage.tsx      # Multi-qubit visual wire circuit editor & Qiskit export
│   │   │   ├── CodeStudioPage.tsx         # Sandboxed quantum programs in Python/Qiskit
│   │   │   ├── CommunicationLabPage.tsx   # BB84 QKD simulation with Eve & QBER analysis
│   │   │   ├── SensingLabPage.tsx         # Ramsey interferometry & Heisenberg limit chart
│   │   │   ├── HardwareExplorerPage.tsx   # Dilution refrigerator stages & QPU benchmarks
│   │   │   ├── MentorPage.tsx             # AI Quantum Learning Assistant
│   │   │   ├── ClassroomPage.tsx          # Dual student/faculty assignments & grading
│   │   │   └── PortfolioPage.tsx          # Badges, logbook & transcript export
│   │   ├── types/
│   │   │   └── quantum.ts                 # Full TypeScript interfaces
│   │   ├── App.tsx                        # Router layout
│   │   ├── index.css                      # Quantum theme & utility classes
│   │   └── main.tsx                       # React application bootstrap
│   ├── index.html                         # Document root & Google Fonts
│   ├── package.json                       # Frontend dependencies & scripts
│   ├── tsconfig.json                      # TypeScript root config
│   └── vite.config.ts                     # Vite + Tailwind + Proxy configuration
├── run-app.bat                            # 1-Click Windows launch script
└── README.md                              # Complete platform documentation
```

---

## 4. Features Actually Implemented

| Area | Feature | Status |
| :--- | :--- | :--- |
| **Scientific Engine** | Unitary matrix calculations ($H, X, Y, Z, S, T, R_x, R_y, R_z$) | **Fully Functional** |
| **Scientific Engine** | Multi-qubit Kronecker tensor product statevector evolution | **Fully Functional** |
| **Scientific Engine** | CNOT entangling gate with configurable control & target | **Fully Functional** |
| **Scientific Engine** | Born's rule exact probabilities and multinomial shot sampling | **Fully Functional** |
| **Dashboard** | Real-time curriculum completion, XP counters, lab logs & shortcuts | **Fully Functional** |
| **QuantumVerse Learn** | 4 Modules & 8 structured lessons with learning objectives | **Fully Functional** |
| **QuantumVerse Learn** | Mathematical formulations in Dirac bra-ket notation | **Fully Functional** |
| **QuantumVerse Learn** | Knowledge check quizzes with instant verification & feedback | **Fully Functional** |
| **Physics Lab** | Exp #1: Quantum Probability & Measurement (Born rule convergence) | **Fully Functional** |
| **Physics Lab** | Exp #2: Photon Polarization & Cascaded Filters (Malus' Law) | **Fully Functional** |
| **Physics Lab** | Exp #5: Qubit States & 3D Projected Bloch Sphere Visualizer | **Fully Functional** |
| **Physics Lab** | Exp #7: Measurement in Complementary Bases (Z, X, Y observables) | **Fully Functional** |
| **Physics Lab** | Catalog of all 10 roadmap experiments with status tags | **Fully Functional** |
| **Circuit Studio** | 1 to 4 qubit wires with 6 time-step grid | **Fully Functional** |
| **Circuit Studio** | Click-to-add/remove gates ($H, X, Y, Z, S, T, CX, M$) | **Fully Functional** |
| **Circuit Studio** | Real-time statevector amplitude, phase, and probability table | **Fully Functional** |
| **Circuit Studio** | Recharts measurement histogram (100, 1024, 4096 shots) | **Fully Functional** |
| **Circuit Studio** | Presets (Bell State $|\Phi^+\rangle$, GHZ State, Superposition) | **Fully Functional** |
| **Circuit Studio** | Python Qiskit code generator & clipboard export | **Fully Functional** |
| **Code Studio** | Executable quantum algorithms (Bell state, QRNG, Teleportation) | **Fully Functional** |
| **Code Studio** | Real sandboxed simulation execution & terminal output console | **Fully Functional** |
| **Communication Lab** | BB84 QKD simulation with configurable photons (8 to 32 bits) | **Fully Functional** |
| **Communication Lab** | Eavesdropper (Eve) intercept-resend attack toggle | **Fully Functional** |
| **Communication Lab** | Photon-by-photon basis matching, sifted key & QBER verdict | **Fully Functional** |
| **Sensing Lab** | Ramsey interferometry simulation with detuning & duration controls | **Fully Functional** |
| **Sensing Lab** | Sensitivity scaling chart: Classical SQL ($1/\sqrt{N}$) vs Heisenberg ($1/N$) | **Fully Functional** |
| **Hardware Explorer** | Interactive dilution refrigerator thermal stages (300K to 15mK) | **Fully Functional** |
| **Hardware Explorer** | Physical architecture comparison (Transmons, Ions, Atoms, Photons, Silicon) | **Fully Functional** |
| **AI Mentor** | REST endpoint with Google Gemini API support + verified syllabus fallback | **Fully Functional** |
| **AI Mentor** | Suggested query chips & formatted math explanations | **Fully Functional** |
| **Classroom** | Dual Student and Faculty view switcher | **Fully Functional** |
| **Classroom** | 3 assigned practicals, lab notes submission & grade feedback | **Fully Functional** |
| **Classroom** | Faculty student roster preview (42 engineering undergraduates) | **Fully Functional** |
| **Portfolio** | Student profile, XP tracking, and 5 competence badges | **Fully Functional** |
| **Portfolio** | Experiment history logbook with timestamps and parameters | **Fully Functional** |
| **Portfolio** | 1-Click Export of complete official academic transcript | **Fully Functional** |

---

## 5. Features Partially Implemented & Planned

* **Partially Implemented**:
  * **Classroom Multi-User Authentication**: The MVP implements full UI workflows, assignment submission, evaluation, and roster management in local demo state. Enterprise LDAP/OAuth2 institutional authentication is pre-architected for Phase 2.
  * **Arbitrary Code Execution**: Custom code execution is limited to predefined, safe quantum algorithms. Direct execution of arbitrary un-sandboxed user Python code on the server is intentionally omitted for security.
* **Roadmap Experiments (Cataloged & Theoretical Formulations Provided)**:
  * Exp #3: Single-Photon Mach-Zehnder Interference with phase delay
  * Exp #4: Quantum Tunnelling through finite rectangular potential barrier
  * Exp #9: 3-Qubit Full Quantum Teleportation channel simulation
  * Exp #10: Small Grover 2-Qubit Search with oracle & diffusion steps

---

## 6. Installation & Prerequisites

### Prerequisites
* **Node.js**: v18.0.0 or higher (v24.x tested)
* **Python**: v3.10 or higher (v3.14 tested)

### Step 1: Install Python Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 7. Running the Application

### Option A: 1-Click Windows Script
Double-click `run-app.bat` in the project root directory.

### Option B: Manual Terminal Execution

**Terminal 1 (Backend API):**
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser at **`http://127.0.0.1:5173`**.

---

## 8. Environment Variables

To enable live Google Gemini AI in the Quantum Mentor, set the environment variable:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-gemini-api-key"

# Windows Command Prompt
set GEMINI_API_KEY=your-gemini-api-key

# Linux / macOS
export GEMINI_API_KEY="your-gemini-api-key"
```

> **Note:** If `GEMINI_API_KEY` is not set, KEP QuantumVerse operates seamlessly in **Offline Curated Mode**, using its comprehensive built-in physics knowledge base.

---

## 9. Automated Testing

The backend includes a comprehensive pytest suite verifying the scientific validity of all quantum mechanics calculations:

```bash
python -m pytest backend/test_quantum_engine.py -v
```

### Verified Test Cases:
1. `test_initial_state_normalization`: Verifies $\sum |c_i|^2 = 1.0$.
2. `test_pauli_x_flip`: Verifies $X|0\rangle = |1\rangle$ and $X|1\rangle = |0\rangle$.
3. `test_hadamard_superposition`: Verifies $H|0\rangle = (|0\rangle+|1\rangle)/\sqrt{2}$ with 50/50 probabilities.
4. `test_bell_state_entanglement`: Verifies $CNOT(H \otimes I)|00\rangle = (|00\rangle+|11\rangle)/\sqrt{2}$ with $P(01)=P(10)=0$.
5. `test_shot_sampling_distribution`: Verifies multinomial shot convergence within confidence intervals.
6. `test_bloch_coordinates`: Verifies spherical angles and Cartesian projections for $|0\rangle, |1\rangle, |+\rangle$.
7. `test_photon_polarization_malus_law`: Verifies $I = I_0 \cos^2(\Delta\theta)$ and the 3-polarizer quantum eraser.
8. `test_bb84_protocol_fidelity`: Verifies 0% error without Eve and detectable QBER with Eve.
9. `test_ramsey_sensing_limits`: Verifies Standard Quantum Limit vs Heisenberg Limit scaling.

---

## 10. Known Limitations

1. **Local Prototype State**: User progress, custom circuits, and experiment logs persist in browser storage (`localStorage`) and in-memory FastAPI state for this MVP.
2. **Qubit Limit for Circuit Studio**: The visual circuit canvas supports up to 4 qubits to maintain high rendering performance and instant statevector calculation across all browsers.
3. **No Arbitrary Code Server Execution**: The Code Studio runs verified algorithms through the native quantum engine rather than executing untrusted remote code on the host operating system.
