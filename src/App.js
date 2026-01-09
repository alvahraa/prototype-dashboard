import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import { Sidebar, Header } from './components/Layout';
import { DashboardPage, VisitorsPage, LoansPage, RecommendationsPage, LoginPage, ConsolePage } from './pages';
import { DataModeIndicator } from './components/Common';

/**
 * Main App Component
 * 
 * Prototype Dashboard Analytics
 * - Login: Halaman login dengan animasi wallpaper
 * - Layout: Sidebar + Header + Content
 * - Navigation: Dashboard, Visitors, Loans, Recommendations
 * - Page transitions with AnimatePresence
 */

// Page title mapping
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  visitors: 'Analisis Kunjungan',
  loans: 'Analisis Peminjaman',
  recommendations: 'Sistem Rekomendasi'
};

// Storage key for auth
const AUTH_KEY = 'prototype_auth';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15 }
  }
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        setUser(userData);
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    setActivePage('dashboard');
  };

  // Render active page with key for AnimatePresence
  const renderPage = () => {
    const pages = {
      dashboard: <DashboardPage />,
      visitors: <VisitorsPage />,
      loans: <LoansPage />,
      recommendations: <RecommendationsPage />,
      console: <ConsolePage />,
    };
    return pages[activePage] || <DashboardPage />;
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Header */}
        <Header 
          title={PAGE_TITLES[activePage]} 
          activePage={activePage}
          user={user}
        />
        
        {/* Page Content with Transitions */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Demo Mode Badge */}
      <DataModeIndicator />
    </div>
  );
}

export default App;
