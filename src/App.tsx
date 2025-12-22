
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
// import { UserStats } from './types';

const App = () => {
  const [stats, setStats] = useState({
    totalPoints: 12500,
    rank: 42,
    referrals: 12,
    streak: 5
  });

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header stats={stats} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
              <Routes>
                <Route path="/" element={<Dashboard stats={stats} setStats={setStats} />} />
                <Route path="/discovery" element={<Dashboard stats={stats} setStats={setStats} />} />
                <Route path="/library" element={<Dashboard stats={stats} setStats={setStats} />} />
                <Route path="/techstack" element={<Dashboard stats={stats} setStats={setStats} />} />
                <Route path="/subscription" element={<Dashboard stats={stats} setStats={setStats} />} />
                <Route path="/settings" element={<Dashboard stats={stats} setStats={setStats} />} />
                {/* Fallback */}
                <Route path="*" element={<Dashboard stats={stats} setStats={setStats} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
