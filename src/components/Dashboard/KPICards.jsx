import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * KPICards Component - Premium Redesign
 * 
 * 4 KPI Cards with generous spacing, muted colors, and smooth animations
 */

// Hook untuk animasi counting
function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (endValue === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
}

// Single KPI Card - Premium Style
function KPICard({ icon: Icon, label, value, subLabel, trend, loading, index }) {
  const animatedValue = useCountUp(loading ? 0 : value, 1200);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 20,
        delay: index * 0.08 
      }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-border-accent shadow-sm hover:shadow-md dark:shadow-dark-sm transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label - Muted */}
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-3">{label}</p>
          
          {/* Value */}
          <div className="flex items-baseline gap-3">
            {loading ? (
              <div className="h-10 w-20 bg-gray-100 dark:bg-dark-700 rounded-lg animate-pulse"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                {animatedValue.toLocaleString('id-ID')}
              </span>
            )}
            
            {/* Trend indicator - Subtle */}
            {trend !== null && !loading && (
              <span className={`text-xs font-medium flex items-center gap-0.5 px-2 py-1 rounded-full ${
                trend > 0 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' 
                  : trend < 0 
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' 
                  : 'text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-dark-700'
              }`}>
                {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>

          {/* Sub label */}
          {subLabel && (
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{subLabel}</p>
          )}
        </div>

        {/* Icon - Subtle background */}
        <div className="w-11 h-11 bg-gray-50 dark:bg-dark-700 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
        </div>
      </div>
    </motion.div>
  );
}

function KPICards({ summary, loading = false }) {
  const [currentInside, setCurrentInside] = useState(summary?.currentlyInside || 0);

  useEffect(() => {
    if (!summary) return;
    setCurrentInside(summary.currentlyInside);

    const interval = setInterval(() => {
      setCurrentInside(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(0, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [summary]);

  const kpis = useMemo(() => [
    {
      id: 'visitors-today',
      icon: Users,
      label: 'Kunjungan Hari Ini',
      value: summary?.totalVisitorsToday || 0,
      subLabel: 'pengunjung',
      trend: 12,
    },
    {
      id: 'active-loans',
      icon: BookOpen,
      label: 'Peminjaman Aktif',
      value: summary?.totalActiveLoans || 0,
      subLabel: 'buku dipinjam',
      trend: -5,
    },
    {
      id: 'current-inside',
      icon: UserCheck,
      label: 'Pengunjung Saat Ini',
      value: currentInside,
      subLabel: 'sedang di perpustakaan',
      trend: null,
    },
    {
      id: 'total-books',
      icon: TrendingUp,
      label: 'Total Buku Tersedia',
      value: summary?.totalAvailableBooks || 0,
      subLabel: `dari ${summary?.totalBooks || 0} total buku`,
      trend: null,
    },
  ], [summary, currentInside]);

  return (
    <div className="bento-grid-4">
      {kpis.map((kpi, index) => (
        <KPICard
          key={kpi.id}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          subLabel={kpi.subLabel}
          trend={kpi.trend}
          loading={loading}
          index={index}
        />
      ))}
    </div>
  );
}

export default KPICards;
