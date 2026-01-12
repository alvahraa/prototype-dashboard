import React from 'react';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

/**
 * VisitorStats Component
 * 
 * 3-4 stat cards menampilkan:
 * - Rata-rata Durasi Kunjungan
 * - Jam Tersibuk
 * - Total Kunjungan Bulan Ini
 */

function StatCard({ icon: Icon, label, value, subValue, color = 'black' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-dark-700`}>
        <Icon className="w-6 h-6 text-gray-900 dark:text-slate-300" />
      </div>
      <div>
        <p className="text-sm text-text-secondary dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{value}</p>
        {subValue && (
          <p className="text-xs text-text-secondary dark:text-slate-500">{subValue}</p>
        )}
      </div>
    </div>
  );
}

function VisitorStats({ 
  durationStats, 
  peakHours, 
  totalMonthVisits,
  loading = false 
}) {
  // Find the peak hour
  const peakHour = peakHours?.reduce((max, h) => 
    h.visits > (max?.visits || 0) ? h : max
  , null);

  // Count peak hours
  const peakHoursCount = peakHours?.filter(h => h.isPeak).length || 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-dark-700 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-dark-700 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-dark-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={Clock}
        label="Rata-rata Durasi Kunjungan"
        value={durationStats?.formattedAverage || '0 menit'}
        subValue={`Median: ${durationStats?.formattedMedian || '0 menit'}`}
      />
      
      <StatCard
        icon={TrendingUp}
        label="Jam Tersibuk"
        value={peakHour?.hour || '-'}
        subValue={`${peakHour?.visits || 0} pengunjung • ${peakHoursCount} jam peak`}
      />
      
      <StatCard
        icon={Calendar}
        label="Total Kunjungan (30 Hari)"
        value={totalMonthVisits?.toLocaleString('id-ID') || '0'}
        subValue="pengunjung"
      />
    </div>
  );
}

export default VisitorStats;
