import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * 
 * Spinner untuk loading state
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2 className={`animate-spin text-black ${sizes[size]} ${className}`} />
  );
}

/**
 * LoadingCard Component
 * 
 * Card dengan loading skeleton
 */
export function LoadingCard({ lines = 3 }) {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      {[...Array(lines)].map((_, i) => (
        <div 
          key={i} 
          className="h-3 bg-gray-200 rounded mb-2"
          style={{ width: `${100 - (i * 15)}%` }}
        />
      ))}
    </div>
  );
}

/**
 * LoadingPage Component
 * 
 * Full page loading state
 */
export function LoadingPage({ message = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  );
}

/**
 * LoadingOverlay Component
 * 
 * Overlay loading untuk refresh
 */
export function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default LoadingSpinner;
