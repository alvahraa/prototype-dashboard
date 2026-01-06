import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

/**
 * ErrorMessage Component
 * 
 * Display error dengan retry button
 */
export function ErrorMessage({ 
  message = 'Terjadi kesalahan', 
  onRetry,
  variant = 'inline' // 'inline' | 'card' | 'page'
}) {
  if (variant === 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black mb-1">Gagal Memuat Data</h3>
          <p className="text-text-secondary text-sm max-w-md">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-red-600 hover:text-red-800 underline mt-2 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Coba lagi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="underline hover:no-underline">
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * EmptyState Component
 * 
 * Display when no data available
 */
export function EmptyState({ 
  icon: Icon,
  title = 'Tidak ada data',
  description = 'Data tidak ditemukan',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-black mb-1">{title}</h3>
      <p className="text-text-secondary text-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export default ErrorMessage;
