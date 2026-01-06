import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * FacultyPieChart Component
 * 
 * Pie chart menampilkan distribusi kunjungan per fakultas
 * - Grayscale colors (different shades)
 * - Show percentage
 * - Legend di samping
 * - Top 5 fakultas, sisanya grouped as "Lainnya"
 */

// Grayscale palette
const COLORS = [
  '#000000', // Black
  '#333333', // Dark gray
  '#555555', // Medium dark
  '#777777', // Medium
  '#999999', // Medium light
  '#bbbbbb', // Light
];

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{data.faculty}</p>
        <p className="text-lg font-bold">{data.count.toLocaleString('id-ID')} pengunjung</p>
        <p className="text-xs text-gray-300">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

// Custom Legend
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-col gap-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-text-secondary truncate" style={{ maxWidth: '120px' }}>
            {entry.value}
          </span>
          <span className="font-medium ml-auto">{entry.payload.percentage}%</span>
        </div>
      ))}
    </div>
  );
};

// Custom Label on Pie
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null; // Don't show label if < 8%
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function FacultyPieChart({ data, loading = false, title = "Distribusi per Fakultas" }) {
  // Process data: top 5 + others
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => b.count - a.count);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);

    if (others.length > 0) {
      const othersCount = others.reduce((sum, item) => sum + item.count, 0);
      const totalCount = sorted.reduce((sum, item) => sum + item.count, 0);
      top5.push({
        faculty: 'Lainnya',
        count: othersCount,
        percentage: Math.round((othersCount / totalCount) * 100 * 10) / 10
      });
    }

    return top5;
  }, [data]);

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 flex items-center justify-center text-text-secondary">
          Tidak ada data
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="35%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={90}
              innerRadius={40}
              dataKey="count"
              nameKey="faculty"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: 0, width: '45%' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FacultyPieChart;
