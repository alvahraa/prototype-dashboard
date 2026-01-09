import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Table2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * ViewToggle Component
 * 
 * Toggle between Visual Grid and Data Table views
 * - Grid: Visual cards for browsing
 * - Table: Compact data for admin tasks
 */

export function ViewToggle({ viewMode, onViewChange, className }) {
  return (
    <div 
      className={cn(
        "inline-flex items-center p-1 bg-gray-100 rounded-lg",
        className
      )}
    >
      <button
        onClick={() => onViewChange('grid')}
        className={cn(
          "relative p-2 rounded-md transition-colors duration-200",
          viewMode === 'grid' 
            ? "text-gray-900" 
            : "text-gray-400 hover:text-gray-600"
        )}
        title="Visual Grid"
      >
        {viewMode === 'grid' && (
          <motion.div
            layoutId="viewToggleBg"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <LayoutGrid className="w-4 h-4 relative z-10" />
      </button>
      
      <button
        onClick={() => onViewChange('table')}
        className={cn(
          "relative p-2 rounded-md transition-colors duration-200",
          viewMode === 'table' 
            ? "text-gray-900" 
            : "text-gray-400 hover:text-gray-600"
        )}
        title="Data Table"
      >
        {viewMode === 'table' && (
          <motion.div
            layoutId="viewToggleBg"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Table2 className="w-4 h-4 relative z-10" />
      </button>
    </div>
  );
}

export default ViewToggle;
