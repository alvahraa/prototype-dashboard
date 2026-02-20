import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Loader2 } from 'lucide-react';

/**
 * ExportButton Component
 * 
 * Professional export button with loading and success states
 */
function ExportButton({ onExport, label = 'Export', className = '' }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleClick = async () => {
    setStatus('loading');
    
    try {
      await onExport();
      setStatus('success');
      
      // Reset after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('idle');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={status === 'loading'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        transition-all duration-200
        ${status === 'success' 
          ? 'bg-emerald-500 text-white' 
          : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {status === 'loading' && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {status === 'success' && (
        <Check className="w-4 h-4" />
      )}
      {status === 'idle' && (
        <Download className="w-4 h-4" />
      )}
      <span>
        {status === 'loading' ? 'Exporting...' : status === 'success' ? 'Downloaded!' : label}
      </span>
    </motion.button>
  );
}

export default ExportButton;
