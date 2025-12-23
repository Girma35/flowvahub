import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './contexts/AuthContext';
import { fetchUserStats } from './services/rewardsService';
import { UserStats } from './types';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    rank: 0,
    referrals: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (user) {
        try {
          const data = await fetchUserStats(user.id);
          setStats(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30">
        <Routes>

          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />


          {user ? (
            <Route
              path="*"
              element={
                <div className="flex min-h-screen">
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
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </div>
              }
            />
          ) : (

            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
