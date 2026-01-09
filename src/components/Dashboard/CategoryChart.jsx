import React from 'react';
import { motion } from 'framer-motion';
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
 * CategoryChart Component - Professional Motion Version
 * 
 * Horizontal bar chart with grow animation
 * - Clean, professional design
 * - 1.5 second bar grow animation
 * - Glassmorphism tooltip
 */

// Smooth container animation
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      delay: 0.45,
    }
  }
};

// Professional tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="backdrop-blur-xl bg-black/90 text-white px-4 py-3 rounded-xl shadow-xl border border-white/10">
        <p className="text-sm font-medium mb-1">{data.category}</p>
        <p className="text-xl font-semibold">{data.count.toLocaleString('id-ID')}</p>
        <p className="text-xs text-gray-400">peminjaman ({data.percentage}%)</p>
      </div>
    );
  }
  return null;
};

// Grayscale palette
const COLORS = ['#111827', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'];

function CategoryChart({ data, loading = false, title = "Peminjaman per Kategori" }) {
  const chartData = [...(data || [])].sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 bg-gray-50 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              horizontal={false}
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <YAxis 
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#374151' }}
              width={75}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
            />
            <Bar 
              dataKey="count" 
              radius={[0, 6, 6, 0]}
              maxBarSize={24}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
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

      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="flex flex-wrap gap-4">
          {chartData.slice(0, 3).map((item, index) => (
            <div key={item.category} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-gray-500">{item.category}:</span>
              <span className="font-semibold text-gray-900">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default CategoryChart;
