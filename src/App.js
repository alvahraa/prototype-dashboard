import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Sun, Moon } from 'lucide-react';
import './index.css';
import './index.css';
import { Sidebar, Header } from './components/Layout';
import logoWhite from './assets/logo-unisula.jpeg';
import { DashboardPage, VisitorsPage, AudiovisualPage, ReferensiPage, SirkulasiPage, KarelPage, SmartLabPage, BICornerPage, RecommendationsPage, LoginPage, ConsolePage, HistoricalDataPage, LockerPage, AdminPage, OperatingHoursPage, AppearancePage } from './pages';


import { NotificationProvider } from './context/NotificationContext';
import { regenerateData } from './data/generateDummyData';

/**
 * Main App Component
 * 
 * Prototype Dashboard Analytics
 * - Login: Halaman login dengan animasi wallpaper
 * - Layout: Sidebar + Header + Content
 * - Navigation: Dashboard, Visitors, Loans, Recommendations
 * - Page transitions with AnimatePresence
 * - Stealth Console: Ctrl+Shift+X to access hidden System Console
 */

// Page title mapping
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  visitors: 'Analisis Kunjungan',
  audiovisual: 'Kunjungan Audiovisual',
  referensi: 'Ruangan Referensi',
  sirkulasi: 'Ruangan Baca',
  karel: 'Ruang Karel',
  smartlab: 'SmartLab',
  bicorner: 'BI Corner',
  recommendations: 'Sistem Rekomendasi',
  console: 'System Console',
  historical: 'Riwayat & Metadata',
  locker: 'Monitoring Loker',
  admin: 'Manajemen Admin',
  'operating-hours': 'Jam Operasional',
  appearance: 'Pengaturan Tampilan'
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

// Stealth Toast Component
function StealthToast({ show, onComplete }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full"
            />
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">Initializing Root Access...</span>
            </div>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showStealthToast, setShowStealthToast] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  // God Mode Shortcut: Ctrl+Shift+X
  const handleGodMode = useCallback(() => {
    if (user) { // Only if authenticated
      setShowStealthToast(true);
    }
  }, [user]);

  const handleStealthComplete = useCallback(() => {
    setShowStealthToast(false);
    setActivePage('console');
  }, []);

  // Global keyboard listener for God Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+X triggers stealth console
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleGodMode();
      }
    };

    // Handle custom navigation events
    const handleNavigate = (e) => {
      const pageId = e.detail;
      setActivePage(pageId);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('navigate', handleNavigate);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, [handleGodMode, activePage]);

  // Handle sidebar navigation
  // Handle sidebar navigation
  const onNavigate = (pageId) => {
    setActivePage(pageId);
  };

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
      audiovisual: <AudiovisualPage />,
      referensi: <ReferensiPage />,
      sirkulasi: <SirkulasiPage />,
      karel: <KarelPage />,
      smartlab: <SmartLabPage />,
      bicorner: <BICornerPage />,
      recommendations: <RecommendationsPage />,
      console: <ConsolePage />,
      historical: <HistoricalDataPage onBack={() => setActivePage('visitors')} />,
      locker: <LockerPage />,
      admin: <AdminPage />,
      'operating-hours': <OperatingHoursPage />,
      appearance: <AppearancePage />,
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

  // Check for Public Mode
  const isPublicMode = new URLSearchParams(window.location.search).get('mode') === 'public';

  // Show login page if not authenticated and not in public mode
  if (!user && !isPublicMode) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Handle Public Mode Layout
  if (isPublicMode) {
    return (
      <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Public Header - Simplified */}
          <div className={`backdrop-blur-md border-b px-8 py-4 flex items-center justify-between z-10 shrink-0 ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-white/50 border-gray-200'
            }`}>
            <div className="flex items-center gap-4">
              <img
                src={logoWhite}
                alt="Logo"
                className={`h-12 w-auto transition-all duration-300 ${!isDarkMode ? 'invert opacity-90' : ''}`}
              />
            </div>
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="px-4 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-sm font-medium animate-pulse">
                Live Monitoring
              </div>
              <div className="text-gray-400 text-sm">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Main Content - Full Width */}
          <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-950' : 'bg-slate-50'}`}>
            <div className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
              <DashboardPage />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          user={user}
          onLogout={handleLogout}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} overflow-hidden`}>
          {/* Header - hide for console page */}
          {activePage !== 'console' && (
            <Header
              title={PAGE_TITLES[activePage]}
              activePage={activePage}
              user={user}
              onNavigate={setActivePage}
            />
          )}

          {/* Page Content with Transitions */}
          <main className={`flex-1 overflow-auto ${activePage !== 'console' ? 'p-6' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={activePage === 'console' ? 'h-full' : ''}
              >
                {activePage === 'console' ? (
                  <ConsolePage onRegenerateData={regenerateData} />
                ) : (
                  renderPage()
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>





        {/* Stealth Toast */}
        <StealthToast show={showStealthToast} onComplete={handleStealthComplete} />
      </div>
    </NotificationProvider>
  );
}

export default App;
