import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * CategoryChart Component
 * 
 * Bar chart menampilkan peminjaman per kategori buku
 * - X-axis: Kategori
 * - Y-axis: Jumlah peminjaman
 * - Bars: Black fill dengan gradient effect
 * - Sorted descending
 */

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-1">{data.category}</p>
        <p className="text-lg font-bold">{data.count.toLocaleString('id-ID')} peminjaman</p>
        <p className="text-xs text-gray-300">{data.percentage}% dari total</p>
      </div>
    );
  }
  return null;
};

// Grayscale colors for bars (darkest to lightest)
const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080'];

function CategoryChart({ data, loading = false, title = "Peminjaman per Kategori" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  // Sort data descending by count
  const chartData = [...(data || [])].sort((a, b) => b.count - a.count);

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 100, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              horizontal={false}
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#333' }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]}
              maxBarSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-3">
          {chartData.slice(0, 3).map((item, index) => (
            <div key={item.category} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="text-text-secondary">{item.category}:</span>
              <span className="font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;
