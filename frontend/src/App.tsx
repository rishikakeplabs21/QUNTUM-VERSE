import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuantumProvider } from './context/QuantumContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';

import { DashboardPage } from './pages/DashboardPage';
import { LearnPage } from './pages/LearnPage';
import { PhysicsLabPage } from './pages/PhysicsLabPage';
import { CircuitStudioPage } from './pages/CircuitStudioPage';
import { CodeStudioPage } from './pages/CodeStudioPage';
import { CommunicationLabPage } from './pages/CommunicationLabPage';
import { SensingLabPage } from './pages/SensingLabPage';
import { HardwareExplorerPage } from './pages/HardwareExplorerPage';
import { MentorPage } from './pages/MentorPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { PortfolioPage } from './pages/PortfolioPage';

export const App: React.FC = () => {
  return (
    <QuantumProvider>
      <HashRouter>
        <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
          {/* Persistent Sidebar Navigation */}
          <Sidebar />

          {/* Main App Content Flow */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            <Header />

            <main className="flex-1 pb-16">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/lab" element={<PhysicsLabPage />} />
                <Route path="/circuit" element={<CircuitStudioPage />} />
                <Route path="/code" element={<CodeStudioPage />} />
                <Route path="/communication" element={<CommunicationLabPage />} />
                <Route path="/sensing" element={<SensingLabPage />} />
                <Route path="/hardware" element={<HardwareExplorerPage />} />
                <Route path="/mentor" element={<MentorPage />} />
                <Route path="/classroom" element={<ClassroomPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </QuantumProvider>
  );
};

export default App;
