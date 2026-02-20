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
      <div className="bg-gray-900 dark:bg-black text-white px-3 py-2 rounded-lg shadow-lg border border-gray-800 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        <p className="text-lg font-bold text-white">{payload[0].value} pengunjung</p>
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
      <div className="card bg-white dark:bg-dark-800 border-gray-100 dark:border-dark-border-accent">
        <h3 className="card-header text-gray-900 dark:text-slate-100">{title}</h3>
        <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="card bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-border-accent hover:shadow-lg dark:hover:shadow-dark-md transition-all duration-300"
    >
      <h3 className="card-header text-gray-900 dark:text-slate-100 border-b border-gray-100 dark:border-dark-border-accent">{title}</h3>

      <div className="h-64 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              className="stroke-gray-200 dark:stroke-gray-700"
              vertical={false}
            />
            <XAxis
              dataKey="dateFormatted"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-500 dark:fill-slate-400"
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-500 dark:fill-slate-400"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(99, 102, 241, 0.5)', strokeWidth: 2 }}
            />
            <ReferenceLine
              y={avgVisits}
              stroke="currentColor"
              className="text-gray-400 dark:text-gray-600"
              strokeDasharray="5 5"
              label={{ value: 'Rata-rata', position: 'right', fontSize: 10, fill: 'currentColor', className: 'text-gray-400 dark:text-gray-500' }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#6366f1', stroke: '#fff', strokeWidth: 2, r: 6 }}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border-accent flex items-center justify-between text-sm">
        <div>
          <span className="text-gray-500 dark:text-slate-400">Total: </span>
          <span className="font-semibold text-gray-900 dark:text-slate-200">
            {chartData.reduce((sum, d) => sum + d.visits, 0).toLocaleString('id-ID')} pengunjung
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-slate-400">Rata-rata: </span>
          <span className="font-semibold text-gray-900 dark:text-slate-200">
            {Math.round(avgVisits).toLocaleString('id-ID')}/hari
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(TrendChart);
