import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Monitor,
  BookOpen,
  ArrowRightLeft,
  Keyboard,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Lock,
  LogOut,
  Clock,
  Palette
} from 'lucide-react';
import { cn } from '../../utils/cn';
import logoWhite from '../../assets/logo-unisula.jpeg';
import { fetchBackendApi } from '../../services/api';

/**
 * Sidebar Navigation Component - Grouped & Collapsible
 * 
 * Features:
 * - Collapsible "Ruangan" group to save space
 * - Clean layout with better spacing
 * - Auto-expand group if active item is inside
 * - Light/Dark Mode Support
 */

const menuGroups = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'visitors', label: 'Analisis Kunjungan', icon: Users },
    ]
  },
  {
    title: 'Fasilitas',
    id: 'rooms_group',
    icon: Layers,
    label: 'Ruangan & Fasilitas',
    isGroup: true,
    items: [
      { id: 'audiovisual', label: 'Audiovisual', icon: Monitor },
      { id: 'referensi', label: 'Ruang Referensi', icon: BookOpen },
      { id: 'sirkulasi', label: 'Ruangan Baca', icon: ArrowRightLeft },
      { id: 'karel', label: 'Ruang Karel', icon: Keyboard },
      { id: 'smartlab', label: 'SmartLab', icon: Cpu },
      { id: 'bicorner', label: 'BI Corner', icon: BookOpen },
      { id: 'locker', label: 'Monitor Loker', icon: Lock },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'operating-hours', label: 'Jam Operasional', icon: Clock },
      { id: 'appearance', label: 'Tampilan', icon: Palette },
      { id: 'admin', label: 'Admin', icon: Layers },
    ]
  }
];

// Smooth transition config
const smoothSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 25,
  mass: 1.2,
};

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...smoothSpring, staggerChildren: 0.1 }
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: smoothSpring },
};

function Sidebar({ activePage, onNavigate, collapsed, onToggle, onLogout, user }) {
  const [expandedGroups, setExpandedGroups] = useState({ rooms_group: true });
  const [appLogo, setAppLogo] = useState(logoWhite);

  React.useEffect(() => {
    fetchBackendApi('/settings/app_logo_dashboard').then(res => {
      if (res.data) setAppLogo(res.data);
    }).catch(console.error);
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if active page is in a group
  React.useEffect(() => {
    menuGroups.forEach(group => {
      if (group.isGroup) {
        if (group.items.some(item => item.id === activePage)) {
          setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
        }
      }
    });
  }, [activePage]);

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-dark-border-accent",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-200 dark:border-dark-border-accent flex items-center justify-between h-20">
        <div className={cn("flex items-center gap-3 overflow-hidden w-full", collapsed ? "justify-center" : "")}>
          <img
            src={appLogo}
            alt="Logo Perpustakaan"
            className={cn("object-contain transition-all duration-300", collapsed ? "h-8 w-8" : "h-12 w-auto")}
          />
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white shadow-lg transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar px-3 space-y-6">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Group Title */}
            {!collapsed && !group.isGroup && group.title && group.items.length > 0 && (
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {group.title}
              </h4>
            )}

            <ul className="space-y-1">
              {/* If it's a Collapsible Group */}
              {group.isGroup ? (
                <li>
                  {/* Group Header */}
                  <button
                    onClick={() => collapsed ? null : toggleGroup(group.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                      collapsed ? "justify-center" : "justify-between hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                    title={collapsed ? group.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <group.icon className={cn("w-5 h-5", expandedGroups[group.id] ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500")} />
                      {!collapsed && <span className="font-medium text-sm">{group.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn("w-4 h-4 transition-transform duration-200", expandedGroups[group.id] ? "rotate-180" : "")}
                      />
                    )}
                  </button>

                  {/* Group Items */}
                  <AnimatePresence>
                    {(expandedGroups[group.id] || collapsed) && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={cn("overflow-hidden", !collapsed && "pl-4 mt-1 space-y-1")}
                      >
                        {group.items.map((item) => {
                          const isActive = activePage === item.id;
                          const Icon = item.icon;

                          return (
                            <li key={item.id}>
                              <button
                                onClick={() => onNavigate(item.id)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                                  collapsed ? "justify-center py-3 my-1" : "",
                                  isActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800/50"
                                )}
                                title={item.label}
                              >
                                <Icon className={cn("w-4 h-4", collapsed && "w-5 h-5")} />
                                {!collapsed && <span>{item.label}</span>}
                              </button>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                // Normal Items
                group.items.map(item => {
                  const isActive = activePage === item.id;
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                          "relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                          collapsed ? "justify-center" : "",
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800"
                        )}
                        title={item.label}
                      >
                        <Icon className="w-5 h-5" />
                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border-accent space-y-2">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-red-500/80 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300",
            collapsed ? "justify-center" : ""
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>

        <div className={cn("flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-dark-border-accent/50", collapsed ? "justify-center" : "")}>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">Online</p>
            </div>
          )}
        </div>
      </div>

    </motion.aside>
  );
}

export default Sidebar;
