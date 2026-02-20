import React, { useMemo } from 'react';
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
import { format, parseISO, subDays } from 'date-fns';

/**
 * VisitTrendChart - Reusable trend chart for room visits
 * 
 * Accepts raw visits array and calculates daily trend automatically
 */

const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }
    }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-lg font-bold">{payload[0].value} kunjungan</p>
            </div>
        );
    }
    return null;
};

function VisitTrendChart({
    visits = [],
    title = "Trend Kunjungan 7 Hari Terakhir",
    color = "#3b82f6",
    loading = false,
    days = 7
}) {
    // Calculate daily visits from raw data
    const chartData = useMemo(() => {
        // if (!visits?.length) return []; // Removed to allow rendering 0-line for new rooms

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Create map for each day
        const dailyMap = {};
        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(today, i);
            const key = format(date, 'yyyy-MM-dd');
            dailyMap[key] = {
                date: key,
                dateFormatted: format(date, 'dd MMM'),
                visits: 0
            };
        }

        // Count visits per day
        const safeVisits = Array.isArray(visits) ? visits : [];
        safeVisits.forEach(v => {
            if (!v || !v.visitTime) return; // Skip invalid entries
            try {
                // Handle SQLite format (replace space with T for ISO compatibility)
                const timeStr = typeof v.visitTime === 'string'
                    ? v.visitTime.replace(' ', 'T')
                    : v.visitTime;

                const visitDate = format(parseISO(timeStr), 'yyyy-MM-dd');
                if (dailyMap[visitDate]) {
                    dailyMap[visitDate].visits++;
                }
            } catch (e) {
                console.warn('Date parse error:', e);
            }
        });

        return Object.values(dailyMap);
    }, [visits, days]);

    const avgVisits = useMemo(() => {
        if (!chartData.length) return 0;
        return chartData.reduce((sum, d) => sum + d.visits, 0) / chartData.length;
    }, [chartData]);

    const totalVisits = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.visits, 0);
    }, [chartData]);

    if (loading) {
        return (
            <div className="card">
                <h3 className="card-header">{title}</h3>
                <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!chartData.length) {
        return (
            <div className="card">
                <h3 className="card-header">{title}</h3>
                <div className="h-64 flex items-center justify-center text-gray-400 dark:text-slate-500">
                    Tidak ada data trend
                </div>
            </div>
        );
    }

    // If title empty, render without card wrapper (for embedding)
    if (!title) {
        return (
            <>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:stroke-dark-border" />
                            <XAxis
                                dataKey="dateFormatted"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f5f5f5', strokeWidth: 2 }} />
                            <ReferenceLine
                                y={avgVisits}
                                stroke="#9ca3af"
                                strokeDasharray="5 5"
                                label={{ value: 'Rata-rata', position: 'right', fontSize: 10, fill: '#9ca3af' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="visits"
                                stroke={color}
                                strokeWidth={2}
                                dot={{ fill: color, strokeWidth: 0, r: 4 }}
                                activeDot={{ fill: color, stroke: '#fff', strokeWidth: 2, r: 6 }}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-sm">
                    <div>
                        <span className="text-gray-500 dark:text-slate-400">Total {days} hari: </span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                            {totalVisits.toLocaleString('id-ID')} kunjungan
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-slate-400">Rata-rata: </span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                            {Math.round(avgVisits).toLocaleString('id-ID')}/hari
                        </span>
                    </div>
                </div>
            </>
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
                    <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:stroke-dark-border" />
                        <XAxis
                            dataKey="dateFormatted"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f5f5f5', strokeWidth: 2 }} />
                        <ReferenceLine
                            y={avgVisits}
                            stroke="#9ca3af"
                            strokeDasharray="5 5"
                            label={{ value: 'Rata-rata', position: 'right', fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 0, r: 4 }}
                            activeDot={{ fill: color, stroke: '#fff', strokeWidth: 2, r: 6 }}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-sm">
                <div>
                    <span className="text-gray-500 dark:text-slate-400">Total {days} hari: </span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                        {totalVisits.toLocaleString('id-ID')} kunjungan
                    </span>
                </div>
                <div>
                    <span className="text-gray-500 dark:text-slate-400">Rata-rata: </span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                        {Math.round(avgVisits).toLocaleString('id-ID')}/hari
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default VisitTrendChart;
