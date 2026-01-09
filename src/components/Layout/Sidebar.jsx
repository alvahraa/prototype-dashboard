import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Sparkles,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Sidebar Navigation Component - Framer Motion Enhanced
 * 
 * Features:
 * - Staggered entry animations
 * - layoutId for smooth active indicator transitions
 * - whileHover & whileTap micro-interactions
 */

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitors', label: 'Kunjungan', icon: Users },
  { id: 'loans', label: 'Peminjaman', icon: BookOpen },
  { id: 'recommendations', label: 'Rekomendasi', icon: Sparkles },
];

// Smooth, luxurious spring transition config
const smoothSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 25,
  mass: 1.2,
};

// Animation variants
const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ...smoothSpring,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -15, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: smoothSpring,
  },
};

function Sidebar({ activePage, onNavigate, user, onLogout }) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col z-50"
    >
      {/* Logo & Title */}
      <motion.div 
        variants={itemVariants}
        className="p-6 border-b border-gray-800"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.03, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
            transition={smoothSpring}
            className="w-11 h-11 rounded-xl overflow-hidden shadow-lg"
          >
            <img 
              src="/images/assets/logo.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Prototype</h1>
            <p className="text-xs text-gray-400">Dashboard Analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <motion.li 
                key={item.id}
                variants={itemVariants}
                custom={index}
              >
                <motion.button
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={smoothSpring}
                  className={cn(
                    'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                    'transition-colors duration-200 text-left',
                    isActive 
                      ? 'text-black font-medium' 
                      : 'text-gray-300 hover:text-white'
                  )}
                >
                  {/* Active Background Pill with layoutId for smooth transitions */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-white rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={smoothSpring}
                      />
                    )}
                  </AnimatePresence>
                  
                  <Icon className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <motion.div 
        variants={itemVariants}
        className="p-4 border-t border-gray-800"
      >
        {user && (
          <motion.div 
            className="mb-3"
            whileHover={{ x: 2 }}
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {onLogout && (
          <motion.button
            onClick={onLogout}
            whileHover={{ x: 4, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </motion.button>
        )}
        
        <p className="text-xs text-gray-600 text-center mt-3">
          © 2024 Prototype Dashboard
        </p>
      </motion.div>
    </motion.aside>
  );
}

export default Sidebar;
