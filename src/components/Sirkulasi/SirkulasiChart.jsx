import React, { useMemo } from 'react';
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
 * SirkulasiChart Component
 * 
 * Bar chart showing sirkulasi visits distribution by faculty
 */

const COLORS_FLOOR1 = [
    '#f59e0b', '#f97316', '#ef4444', '#dc2626',
    '#b91c1c', '#991b1b', '#7c2d12', '#78350f', '#713f12'
];

const COLORS_FLOOR2 = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#14b8a6', '#10b981'
];

function SirkulasiChart({ data = [], title = 'Distribusi Kunjungan per Fakultas', floor = 1 }) {
    const colors = floor === 1 ? COLORS_FLOOR1 : COLORS_FLOOR2;

    const chartData = useMemo(() => {
        return data.slice(0, 8).map(item => ({
            name: item.name.replace('Fakultas ', '').substring(0, 15),
            fullName: item.name,
            count: item.count,
            percentage: item.percentage
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-dark-border-accent">
                    <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{data.fullName}</p>
                    <p className="text-gray-600 dark:text-slate-400 text-xs mt-1">
                        {data.count} kunjungan ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <h3 className="card-header">{title}</h3>
                <div className="h-80 flex items-center justify-center text-gray-400 dark:text-slate-500">
                    Tidak ada data untuk ditampilkan
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="card"
        >
            <h3 className="card-header">{title}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                            stroke="#e5e7eb"
                            className="dark:stroke-dark-border"
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default SirkulasiChart;
