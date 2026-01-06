import React, { useState, useEffect, useMemo } from 'react';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

/**
 * KPICards Component
 * 
 * 4 KPI Cards dengan animasi number counting:
 * - Total Kunjungan Hari Ini
 * - Peminjaman Aktif
 * - Pengunjung Saat Ini (dengan simulasi real-time)
 * - Buku Terpopuler Bulan Ini
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
      
      // Easing function (ease-out)
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

// Single KPI Card Component
function KPICard({ icon: Icon, label, value, subLabel, trend, loading }) {
  const animatedValue = useCountUp(loading ? 0 : value, 1200);

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm text-text-secondary font-medium mb-2">{label}</p>
          
          {/* Value dengan animasi */}
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <span className="text-4xl font-bold text-black animate-count-up">
                {animatedValue.toLocaleString('id-ID')}
              </span>
            )}
            
            {/* Trend indicator */}
            {trend && !loading && (
              <span className={`text-sm font-medium flex items-center gap-1 ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </span>
            )}
          </div>

          {/* Sub label */}
          {subLabel && (
            <p className="text-xs text-text-secondary mt-1">{subLabel}</p>
          )}
        </div>

        {/* Icon */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-black" />
        </div>
      </div>
    </div>
  );
}

function KPICards({ summary, loading = false }) {
  // Simulasi real-time untuk pengunjung saat ini
  const [currentInside, setCurrentInside] = useState(summary?.currentlyInside || 0);

  useEffect(() => {
    if (!summary) return;
    setCurrentInside(summary.currentlyInside);

    // Simulasi perubahan real-time setiap 5 detik
    const interval = setInterval(() => {
      setCurrentInside(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, atau 1
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
      trend: 12, // Dummy trend
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
      trend: null, // No trend for real-time
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.id}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          subLabel={kpi.subLabel}
          trend={kpi.trend}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default KPICards;
