import React, { useState, useEffect } from 'react';
import './index.css';
import { Sidebar, Header } from './components/Layout';
import { DashboardPage, VisitorsPage, LoansPage, RecommendationsPage, LoginPage } from './pages';
import { DataModeIndicator } from './components/Common';

/**
 * Main App Component
 * 
 * Prototype Dashboard Analytics
 * - Login: Halaman login dengan animasi wallpaper
 * - Layout: Sidebar + Header + Content
 * - Navigation: Dashboard, Visitors, Loans, Recommendations
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

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'visitors':
        return <VisitorsPage />;
      case 'loans':
        return <LoansPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <Header 
          title={PAGE_TITLES[activePage]} 
          activePage={activePage}
          user={user}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>

      {/* Demo Mode Badge */}
      <DataModeIndicator />
    </div>
  );
}

export default App;
