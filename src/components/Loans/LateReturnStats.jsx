import React from 'react';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

/**
 * LateReturnStats Component
 * 
 * Stats panel untuk keterlambatan dengan progress bars
 */

function ProgressBar({ value, max = 100, color = 'black' }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, progress, variant = 'default' }) {
  const bgColors = {
    default: 'bg-gray-100',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[variant]}`}>
          <Icon className="w-5 h-5 text-black" />
        </div>
        <span className="text-2xl font-bold text-black">{value}</span>
      </div>
      
      <p className="text-sm text-text-secondary mb-2">{label}</p>
      
      {progress !== undefined && (
        <div className="mb-2">
          <ProgressBar value={progress.value} max={progress.max} />
          <p className="text-xs text-text-secondary mt-1">
            {progress.label}
          </p>
        </div>
      )}
      
      {subValue && (
        <p className="text-xs text-text-secondary">{subValue}</p>
      )}
    </div>
  );
}

function LateReturnStats({ lateAnalysis, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const { lateRate, avgLateDays, totalLate, totalReturned } = lateAnalysis || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={AlertTriangle}
        label="Tingkat Keterlambatan"
        value={`${lateRate || 0}%`}
        variant="warning"
        progress={{
          value: lateRate || 0,
          max: 100,
          label: `${totalLate || 0} dari ${totalReturned || 0} pengembalian`
        }}
      />
      
      <StatCard
        icon={Clock}
        label="Rata-rata Hari Terlambat"
        value={`${avgLateDays || 0} hari`}
        subValue="untuk buku yang terlambat"
      />
      
      <StatCard
        icon={Calendar}
        label="Total Keterlambatan"
        value={totalLate || 0}
        subValue="kasus terlambat bulan ini"
        variant={(totalLate || 0) > 50 ? 'danger' : 'default'}
      />
    </div>
  );
}

export default LateReturnStats;
