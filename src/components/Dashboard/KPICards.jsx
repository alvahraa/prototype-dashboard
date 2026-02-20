import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, UserCheck, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * KPICards Component - Premium Redesign
 * 
 * 4 KPI Cards with generous spacing, muted colors, and smooth animations
 */

import KPICard from './KPICard';

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
      id: 'visitors-total',
      icon: TrendingUp,
      label: 'Total Kunjungan',
      value: summary?.totalVisitorsPeriod || 0,
      subLabel: 'bulan ini (semua ruangan)',
      trend: 8,
    },
    {
      id: 'top-room',
      icon: UserCheck,
      label: 'Ruangan Terfavorit',
      // Custom display for text instead of number
      customDisplay: (
        <span className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight truncate">
          {summary?.topRoomName || '-'}
        </span>
      ),
      value: 0, // Not used when customDisplay is present
      subLabel: `${summary?.topRoomCount || 0} pengunjung`,
      trend: null,
    },
    {
      id: 'peak-hour',
      icon: Monitor,
      label: 'Jam Teramai',
      // Custom display for hour
      customDisplay: (
        <span className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
          {summary?.busiestHour || '-'}
        </span>
      ),
      value: 0,
      subLabel: `rata-rata ${summary?.busiestHourCount || 0} pengunjung`,
      trend: null,
    },
  ], [summary]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          customDisplay={kpi.customDisplay}
        />
      ))}
    </div>
  );
}

export default React.memo(KPICards);
