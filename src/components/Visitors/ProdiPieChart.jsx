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
 * ProdiPieChart Component
 * 
 * Pie chart menampilkan distribusi kunjungan per program studi
 * - Premium color palette
 * - Show percentage
 * - Legend di samping
 * - Top 7 prodi, sisanya grouped as "Lainnya"
 */

// Premium palette
const COLORS = [
    '#6366f1', // Indigo 500
    '#ec4899', // Pink 500
    '#10b981', // Emerald 500
    '#f59e0b', // Amber 500
    '#8b5cf6', // Violet 500
    '#ef4444', // Red 500
    '#06b6d4', // Cyan 500
    '#64748b', // Slate 500
];

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-border-accent px-3 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{data.prodi}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{data.count.toLocaleString('id-ID')} pengunjung</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{data.percentage}%</p>
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
                    <span className="text-text-secondary dark:text-slate-400 truncate" style={{ maxWidth: '140px' }}>
                        {entry.value}
                    </span>
                    <span className="font-medium ml-auto dark:text-slate-200">{entry.payload.percentage}%</span>
                </div>
            ))}
        </div>
    );
};

// Custom Label on Pie
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null; // Don't show label if < 6%

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

function ProdiPieChart({ data, loading = false, title = "Distribusi per Program Studi" }) {
    // Process data: top 7 + others
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const sorted = [...data].sort((a, b) => b.count - a.count);
        const top7 = sorted.slice(0, 7);
        const others = sorted.slice(7);

        if (others.length > 0) {
            const othersCount = others.reduce((sum, item) => sum + item.count, 0);
            const totalCount = sorted.reduce((sum, item) => sum + item.count, 0);
            top7.push({
                prodi: 'Lainnya',
                count: othersCount,
                percentage: Math.round((othersCount / totalCount) * 100 * 10) / 10
            });
        }

        return top7;
    }, [data]);

    if (loading) {
        return (
            <div className="card">
                <h3 className="card-header">{title}</h3>
                <div className="h-64 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="card">
                <h3 className="card-header">{title}</h3>
                <div className="h-64 flex items-center justify-center text-text-secondary dark:text-slate-400">
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
                            nameKey="prodi"
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
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'transparent' }}
                            wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }}
                        />
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

export default ProdiPieChart;
