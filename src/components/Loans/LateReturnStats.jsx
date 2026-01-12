import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

/**
 * LateReturnStats Component - Animated Version
 * 
 * Stats panel dengan count-up animations dan progress bars
 */

// Count-up hook
function useCountUp(endValue, duration = 1200) {
  const [count, setCount] = useState(0);
  const numValue = typeof endValue === 'number' ? endValue : parseFloat(endValue) || 0;

  useEffect(() => {
    if (numValue === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(numValue * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numValue);
      }
    };

    requestAnimationFrame(animate);
  }, [numValue, duration]);

  return count;
}

function ProgressBar({ value, max = 100 }) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-gray-900 dark:bg-indigo-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, progress, variant = 'default', index = 0 }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animatedValue = useCountUp(numericValue);
  const isPercentage = typeof value === 'string' && value.includes('%');
  const hasDays = typeof value === 'string' && value.includes('hari');

  const bgColors = {
    default: 'bg-gray-50 dark:bg-dark-700',
    warning: 'bg-amber-50 dark:bg-amber-500/10',
    danger: 'bg-rose-50 dark:bg-rose-500/10',
  };

  const displayValue = isPercentage 
    ? `${animatedValue}%` 
    : hasDays 
    ? `${animatedValue} hari`
    : animatedValue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 20,
        delay: index * 0.1 
      }}
      className="card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColors[variant]}`}>
          <Icon className="w-5 h-5 text-gray-700 dark:text-slate-300" />
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{displayValue}</span>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{label}</p>
      
      {progress !== undefined && (
        <div className="mb-2">
          <ProgressBar value={progress.value} max={progress.max} />
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{progress.label}</p>
        </div>
      )}
      
      {subValue && (
        <p className="text-xs text-gray-400 dark:text-slate-500">{subValue}</p>
      )}
    </motion.div>
  );
}

function LateReturnStats({ lateAnalysis, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-10 w-10 bg-gray-100 dark:bg-dark-700 rounded-xl mb-3"></div>
            <div className="h-6 w-16 bg-gray-100 dark:bg-dark-700 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-100 dark:bg-dark-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const { lateRate, avgLateDays, totalLate, totalReturned } = lateAnalysis || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard
        index={0}
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
        index={1}
        icon={Clock}
        label="Rata-rata Hari Terlambat"
        value={`${avgLateDays || 0} hari`}
        subValue="untuk buku yang terlambat"
      />
      
      <StatCard
        index={2}
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
