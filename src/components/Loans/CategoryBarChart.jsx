import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

/**
 * CategoryBarChart Component
 * 
 * Horizontal bar chart menampilkan kategori buku paling diminati
 */

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{data.category}</p>
        <p className="text-lg font-bold">{data.count.toLocaleString('id-ID')} peminjaman</p>
        <p className="text-xs text-gray-300">{data.percentage}% dari total</p>
      </div>
    );
  }
  return null;
};

function CategoryBarChart({ data, loading = false, title = "Kategori Buku Paling Diminati" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
      </div>
    );
  }

  const chartData = [...(data || [])].sort((a, b) => b.count - a.count);

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
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
              tick={{ fontSize: 11, fill: '#333' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
            <Bar 
              dataKey="count" 
              fill="#000000"
              radius={[0, 4, 4, 0]}
              maxBarSize={25}
            >
              <LabelList 
                dataKey="count" 
                position="right" 
                style={{ fontSize: 11, fill: '#333', fontWeight: 500 }}
                formatter={(value) => value.toLocaleString('id-ID')}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CategoryBarChart;
