import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#06b6d4', '#0891b2', '#0e7490', '#155e75'];

function SmartLabChart({ data = [], title = 'Distribusi Kunjungan per Fakultas' }) {
    const chartData = useMemo(() => {
        return data.slice(0, 8).map(item => ({
            name: item.name.replace('Fakultas ', '').substring(0, 15),
            fullName: item.name, count: item.count, percentage: item.percentage
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-dark-border-accent">
                    <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{d.fullName}</p>
                    <p className="text-gray-600 dark:text-slate-400 text-xs mt-1">{d.count} kunjungan ({d.percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    if (!data?.length) {
        return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card"><h3 className="card-header">{title}</h3><div className="h-80 flex items-center justify-center text-gray-400">Tidak ada data</div></motion.div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="card">
            <h3 className="card-header">{title}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                            {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default SmartLabChart;
