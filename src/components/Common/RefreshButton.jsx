import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * RefreshButton Component
 * 
 * Button untuk manual refresh data
 */
export function RefreshButton({ onClick, loading = false, size = 'md' }) {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        btn-outline flex items-center gap-2 
        ${sizes[size]}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <RefreshCw className={`${iconSizes[size]} ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Memuat...' : 'Refresh'}
    </button>
  );
}

/**
 * DataModeIndicator Component
 * 
 * Menampilkan mode data saat ini (dummy/production)
 */
export function DataModeIndicator() {
  const mode = process.env.REACT_APP_DATA_MODE || 'dummy';
  
  if (mode === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg z-50">
      🔧 Mode Demo (Data Dummy)
    </div>
  );
}

/**
 * LastUpdated Component
 * 
 * Menampilkan waktu terakhir data di-refresh
 */
export function LastUpdated({ timestamp }) {
  if (!timestamp) return null;

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <span className="text-xs text-text-secondary">
      Terakhir diperbarui: {formatTime(timestamp)}
    </span>
  );
}

export default RefreshButton;
