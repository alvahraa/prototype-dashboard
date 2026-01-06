import React from 'react';
import { Calendar, User, Bell } from 'lucide-react';
import { format } from 'date-fns';

/**
 * Header Component
 * 
 * Top header bar dengan:
 * - Judul halaman aktif
 * - Date picker
 * - User profile icon
 */

const pageTitles = {
  dashboard: 'Dashboard Overview',
  visitors: 'Analisis Kunjungan',
  loans: 'Analisis Peminjaman',
  recommendations: 'Sistem Rekomendasi',
};

function Header({ activePage, selectedDate, onDateChange }) {
  const today = new Date();
  
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-border">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {format(today, 'EEEE, d MMMM yyyy')}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
