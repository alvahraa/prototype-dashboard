import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/**
 * LoanTrendChart Component
 * 
 * Area chart dengan trend peminjaman 6 bulan terakhir
 */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-xs text-gray-300 mb-1">{label}</p>
        <p className="text-lg font-bold">{payload[0].value.toLocaleString('id-ID')} peminjaman</p>
      </div>
    );
  }
  return null;
};

function LoanTrendChart({ data, loading = false, title = "Trend Peminjaman 6 Bulan" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
      </div>
    );
  }

  const chartData = data || [];
  const total = chartData.reduce((sum, d) => sum + d.count, 0);
  const avg = Math.round(total / (chartData.length || 1));

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#000000" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#000000"
              strokeWidth={2}
              fill="url(#colorLoans)"
              dot={{ fill: '#000', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#000', strokeWidth: 0, r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border dark:border-dark-border-accent flex justify-between text-sm">
        <div>
          <span className="text-text-secondary dark:text-slate-400">Total 6 bulan: </span>
          <span className="font-semibold dark:text-slate-200">{total.toLocaleString('id-ID')} peminjaman</span>
        </div>
        <div>
          <span className="text-text-secondary dark:text-slate-400">Rata-rata: </span>
          <span className="font-semibold dark:text-slate-200">{avg.toLocaleString('id-ID')}/bulan</span>
        </div>
      </div>
    </div>
  );
}

export default LoanTrendChart;
