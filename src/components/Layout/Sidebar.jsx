import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Sparkles,
  Library,
  LogOut,
  User
} from 'lucide-react';

/**
 * Sidebar Navigation Component
 * 
 * Fixed left sidebar dengan navigasi utama:
 * - Dashboard
 * - Kunjungan
 * - Peminjaman
 * - Rekomendasi
 * - User info & Logout
 */

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitors', label: 'Kunjungan', icon: Users },
  { id: 'loans', label: 'Peminjaman', icon: BookOpen },
  { id: 'recommendations', label: 'Rekomendasi', icon: Sparkles },
];

function Sidebar({ activePage, onNavigate, user, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col z-50">
      {/* Logo & Title */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Library className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Perpustakaan</h1>
            <p className="text-xs text-gray-400">Unnisula Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-white text-black font-medium' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-800">
        {user && (
          <div className="mb-3">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}
        
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </button>
        )}
        
        <p className="text-xs text-gray-600 text-center mt-3">
          © 2024 Unnisula Library
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
