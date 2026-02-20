import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';

/**
 * PeakHoursHeatmap Component
 * 
 * Bar chart menampilkan distribusi jam sibuk perpustakaan (7 AM - 9 PM)
 * - X-axis: Jam (07:00, 08:00, ..., 21:00)
 * - Y-axis: Jumlah pengunjung
 * - Gradient: light gray (low) -> black (high)
 * - Peak hours ditandai dengan label "PEAK"
 */

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{data.hour}</p>
        <p className="text-lg font-bold">{data.visits} pengunjung</p>
        {data.isPeak && (
          <p className="text-xs text-yellow-400 mt-1">Jam Sibuk</p>
        )}
      </div>
    );
  }
  return null;
};

// Get color opacity based on intensity (0-1)
function getOpacity(visits, maxVisits) {
  if (maxVisits === 0) return 0.3;
  const intensity = visits / maxVisits;
  // Min opacity 0.3, Max 1.0
  return 0.3 + (intensity * 0.7);
}

function PeakHoursHeatmap({ data, loading = false, title = "Distribusi Jam Kunjungan" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
      </div>
    );
  }

  // Filter hours 7 AM to 9 PM (7-21)
  const chartData = (data || []).filter(d => {
    const hour = parseInt(d.hour.split(':')[0]);
    return hour >= 7 && hour <= 21;
  });

  const maxVisits = Math.max(...chartData.map(d => d.visits), 1);
  const avgVisits = chartData.reduce((sum, d) => sum + d.visits, 0) / (chartData.length || 1);
  
  // Find peak hours
  const peakHours = chartData.filter(d => d.isPeak).map(d => d.hour);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-header mb-0">{title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary dark:text-slate-400">Jam Sibuk:</span>
          {peakHours.slice(0, 3).map(hour => (
            <span key={hour} className="px-2 py-1 bg-gray-900 dark:bg-indigo-600 text-slate-100 rounded text-xs font-medium">
              {hour}
            </span>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              vertical={false}
            />
            <XAxis 
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              interval={1}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
            <ReferenceLine 
              y={avgVisits} 
              stroke="#999" 
              strokeDasharray="5 5"
              label={{ value: 'Rata-rata', position: 'right', fontSize: 10, fill: '#999' }}
            />
            <Bar 
              dataKey="visits" 
              radius={[4, 4, 0, 0]}
              maxBarSize={35}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#6366f1"
                  fillOpacity={getOpacity(entry.visits, maxVisits)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gradient Legend */}
      <div className="mt-4 pt-4 border-t border-border dark:border-dark-border-accent flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
          <span>Rendah</span>
          <div className="w-24 h-3 rounded" 
            style={{ background: 'linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 1))' }}
          ></div>
          <span>Tinggi</span>
        </div>
        <div className="text-sm">
          <span className="text-text-secondary dark:text-slate-400">Rata-rata: </span>
          <span className="font-semibold dark:text-slate-200">{Math.round(avgVisits)} pengunjung/jam</span>
        </div>
      </div>
    </div>
  );
}

export default PeakHoursHeatmap;
