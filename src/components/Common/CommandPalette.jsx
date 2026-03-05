import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  BookOpen,
  Moon,
  Sun,
  X,
  ArrowRight,
  Monitor
} from 'lucide-react';

/**
 * CommandPalette Component (Spotlight Search)
 * 
 * Features:
 * - Opens with Ctrl+K / Cmd+K
 * - Navigate to pages
 * - System commands (Dark Mode toggle)
 * - Persistent dark mode with OS preference detection
 */

// ============================================
// DARK MODE ENGINE
// ============================================
const THEME_KEY = 'prototype_theme';

const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getStoredTheme = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(THEME_KEY);
  }
  return null;
};

const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Initialize theme on load
const initializeTheme = () => {
  const stored = getStoredTheme();
  const theme = stored || getSystemPreference();
  applyTheme(theme);
  return theme;
};

// ============================================
// NAVIGATION & ACTIONS
// ============================================
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard', section: 'Navigation' },
  { id: 'visitors', label: 'Kunjungan', icon: Users, path: 'visitors', section: 'Navigation' },
  { id: 'loans', label: 'Peminjaman', icon: BookOpen, path: 'loans', section: 'Navigation' },

];

// System commands only - no creation actions
const systemCommands = [
  { id: 'toggle-dark', label: 'Toggle Dark Mode', icon: Moon, action: 'toggle-dark', section: 'System' },
  { id: 'use-system', label: 'Use System Theme', icon: Monitor, action: 'use-system', section: 'System' },
];

const allItems = [...navItems, ...systemCommands];

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15 }
  },
};

function CommandPalette({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('light');
  const inputRef = useRef(null);

  // Initialize theme on mount
  useEffect(() => {
    const theme = initializeTheme();
    setCurrentTheme(theme);

    // Listen for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const stored = getStoredTheme();
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        setCurrentTheme(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Filter items based on search
  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Group by section
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      handleSelect(filteredItems[selectedIndex]);
    }
  }, [filteredItems, selectedIndex]);

  // Handle item selection
  const handleSelect = (item) => {
    if (item.path && onNavigate) {
      onNavigate(item.path);
    } else if (item.action === 'toggle-dark') {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setCurrentTheme(newTheme);
      setStoredTheme(newTheme);
      applyTheme(newTheme);
    } else if (item.action === 'use-system') {
      localStorage.removeItem(THEME_KEY);
      const systemTheme = getSystemPreference();
      setCurrentTheme(systemTheme);
      applyTheme(systemTheme);
    }
    setIsOpen(false);
  };

  // Get appropriate icon for theme toggle
  const getThemeIcon = (item) => {
    if (item.id === 'toggle-dark') {
      return currentTheme === 'dark' ? Sun : Moon;
    }
    return item.icon;
  };

  const getThemeLabel = (item) => {
    if (item.id === 'toggle-dark') {
      return currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
    return item.label;
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages or commands..."
                  className="flex-1 text-base outline-none placeholder:text-gray-400 bg-transparent text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {Object.entries(groupedItems).map(([section, items]) => (
                  <div key={section}>
                    <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {section}
                    </div>
                    {items.map((item) => {
                      const globalIndex = filteredItems.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      const Icon = getThemeIcon(item);
                      const label = getThemeLabel(item);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected
                              ? 'bg-gray-100 dark:bg-gray-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`} />
                          <span className={`flex-1 ${isSelected ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                            {label}
                          </span>
                          {isSelected && <ArrowRight className="w-4 h-4 text-gray-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <p>No results for "{search}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Enter</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Esc</kbd>
                  <span>Close</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;
