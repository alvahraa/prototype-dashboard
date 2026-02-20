import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, TrendingUp, Calendar } from 'lucide-react';

/**
 * AudiovisualStats Component
 * 
 * KPI Cards for audiovisual visits
 */

function StatCard({ icon: Icon, label, value, subLabel, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                delay: index * 0.08
            }}
            whileHover={{ y: -3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-border-accent shadow-sm hover:shadow-md dark:shadow-dark-sm transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-3">{label}</p>

                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                            {value.toLocaleString('id-ID')}
                        </span>
                    </div>

                    {subLabel && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{subLabel}</p>
                    )}
                </div>

                <div className="w-11 h-11 bg-gray-50 dark:bg-dark-700 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                </div>
            </div>
        </motion.div>
    );
}

function AudiovisualStats({ stats, todayVisits = 0 }) {
    // Handle null/undefined stats
    const safeStats = stats || {};

    const kpis = [
        {
            id: 'av-today',
            icon: Users,
            label: 'Kunjungan AV Hari Ini',
            value: todayVisits,
            subLabel: 'pengunjung',
        },
        {
            id: 'av-month',
            icon: Calendar,
            label: 'Total Kunjungan Bulan Ini',
            value: safeStats.total || 0,
            subLabel: 'total kunjungan',
        },
        {
            id: 'av-male',
            icon: UserCheck,
            label: 'Pengunjung Laki-laki',
            value: safeStats.genderDistribution?.find(g => g.name === 'Laki-laki')?.count || 0,
            subLabel: `${safeStats.genderDistribution?.find(g => g.name === 'Laki-laki')?.percentage || 0}% dari total`,
        },
        {
            id: 'av-female',
            icon: TrendingUp,
            label: 'Pengunjung Perempuan',
            value: safeStats.genderDistribution?.find(g => g.name === 'Perempuan')?.count || 0,
            subLabel: `${safeStats.genderDistribution?.find(g => g.name === 'Perempuan')?.percentage || 0}% dari total`,
        },
    ];

    return (
        <div className="bento-grid-4">
            {kpis.map((kpi, index) => (
                <StatCard
                    key={kpi.id}
                    icon={kpi.icon}
                    label={kpi.label}
                    value={kpi.value}
                    subLabel={kpi.subLabel}
                    index={index}
                />
            ))}
        </div>
    );
}

export default AudiovisualStats;
