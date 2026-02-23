import React, { useState, useEffect } from 'react';
import { Calendar, User, Bell, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { CommandPalette, NotificationDropdown } from '../Common';
import { fetchBackendApi } from '../../services/api';

/**
 * Header Component
 * 
 * Top header bar with:
 * - Page title
 * - Command Palette (Ctrl+K)
 * - Date display
 * - User profile
 */

const pageTitles = {
  dashboard: 'Dashboard Overview',
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
  admin: 'Manajemen Admin'
};

function Header({ activePage, onNavigate, user, isDarkMode, onToggleTheme }) {
  const [profilePic, setProfilePic] = useState(null);
  const today = new Date();

  useEffect(() => {
    fetchBackendApi('/settings/admin_profile_pic').then(res => {
      if (res.data) setProfilePic(res.data);
    }).catch(console.error);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 transition-colors">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-dark-800 transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Command Palette Trigger */}
        <CommandPalette onNavigate={onNavigate} />

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-dark-800 rounded-xl text-sm text-gray-600 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{format(today, 'd MMM yyyy')}</span>
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <div className="w-8 h-8 bg-gray-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-slate-100" />
            )}
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-slate-300">
            {user?.username || 'Admin'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;

