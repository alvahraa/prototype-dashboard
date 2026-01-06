import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/**
 * TrendChart Component
 * 
 * Line chart menampilkan trend kunjungan 7 hari terakhir
 */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-xs text-gray-300 mb-1">{label}</p>
        <p className="text-lg font-bold">{payload[0].value} pengunjung</p>
      </div>
    );
  }
  return null;
};

function TrendChart({ data, loading = false, title = "Trend Kunjungan 7 Hari Terakhir" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  const chartData = data?.slice(-7) || [];

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              vertical={false}
            />
            <XAxis 
              dataKey="dateFormatted" 
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
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#000', strokeWidth: 0, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
        <div>
          <span className="text-text-secondary">Total: </span>
          <span className="font-semibold">
            {chartData.reduce((sum, d) => sum + d.visits, 0).toLocaleString('id-ID')} pengunjung
          </span>
        </div>
        <div>
          <span className="text-text-secondary">Rata-rata: </span>
          <span className="font-semibold">
            {Math.round(chartData.reduce((sum, d) => sum + d.visits, 0) / (chartData.length || 1)).toLocaleString('id-ID')}/hari
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrendChart;
