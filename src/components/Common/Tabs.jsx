import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Tabs Component - Premium Segmented Control Style
 * 
 * Features:
 * - Framer Motion layoutId for smooth sliding indicator
 * - Clean, iOS-inspired segmented control look
 * - Keyboard accessible
 */

export function Tabs({ tabs, activeTab, onTabChange, className }) {
  return (
    <div 
      className={cn(
        "inline-flex items-center p-1 bg-gray-100/80 rounded-xl",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400",
              isActive 
                ? "text-gray-900" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {/* Sliding Background */}
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            
            {/* Tab Content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Tab Panel Wrapper with Fade Animation
 */
export function TabPanel({ children, id, activeTab }) {
  if (id !== activeTab) return null;
  
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      role="tabpanel"
      aria-labelledby={id}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;
