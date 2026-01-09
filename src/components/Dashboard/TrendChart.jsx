import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

/**
 * TrendChart Component - Matching PeakHoursHeatmap Pattern
 * 
 * Line chart with consistent animation style
 * - Same styling pattern as PeakHoursHeatmap
 * - Clean, professional design
 * - Smooth line drawing animation
 */

// Container animation
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      delay: 0.2,
    }
  }
};

// Custom Tooltip - matching PeakHoursHeatmap style
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold">{payload[0].value} pengunjung</p>
      </div>
    );
  }
  return null;
};

function TrendChart({ data, loading = false, title = "Trend Kunjungan 7 Hari Terakhir" }) {
  const chartData = data?.slice(-7) || [];
  const avgVisits = chartData.reduce((sum, d) => sum + d.visits, 0) / (chartData.length || 1);

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="card hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="card-header">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
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
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#f5f5f5', strokeWidth: 2 }} 
            />
            <ReferenceLine
              y={avgVisits}
              stroke="#999"
              strokeDasharray="5 5"
              label={{ value: 'Rata-rata', position: 'right', fontSize: 10, fill: '#999' }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#000', stroke: '#fff', strokeWidth: 2, r: 6 }}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer - matching PeakHoursHeatmap pattern */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <div>
          <span className="text-text-secondary">Total: </span>
          <span className="font-semibold">
            {chartData.reduce((sum, d) => sum + d.visits, 0).toLocaleString('id-ID')} pengunjung
          </span>
        </div>
        <div>
          <span className="text-text-secondary">Rata-rata: </span>
          <span className="font-semibold">
            {Math.round(avgVisits).toLocaleString('id-ID')}/hari
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default TrendChart;
