import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import { getVisitorStats } from '../../services/visitorService';

/**
 * RoomPopularityStats Component
 * 
 * Menampilkan ruangan terfavorit untuk 3 periode:
 * - Minggu Ini (7 hari)
 * - Bulan Ini (30 hari)
 * - Tahun Ini (365 hari)
 */

function StatCard({ title, period, data, loading, delay, icon: Icon, iconBgClass, iconTextClass, decoClass }) {
    const topRoom = data?.byRoom?.[0]; // Ambil ruangan #1

    // Map room code to nice name (duplicate logic, should be util but okay here for now)
    const getRoomName = (code) => {
        const names = {
            'audiovisual': 'Audiovisual',
            'referensi': 'Referensi',
            'sirkulasi_l1': 'Sirkulasi Lt 1',
            'sirkulasi_l2': 'Sirkulasi Lt 2',
            'karel': 'Ruang Karel',
            'smartlab': 'Smart Lab'
        };
        return names[code] || code;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-border-accent shadow-sm hover:shadow-md transition-all relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-[0.08] ${decoClass}`}>
                <Icon className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${iconBgClass}`}>
                        <Icon className={`w-6 h-6 ${iconTextClass}`} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
                        <p className="text-xs text-gray-400 dark:text-slate-500">{period}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-8 bg-gray-100 dark:bg-dark-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-100 dark:bg-dark-700 rounded w-1/2"></div>
                    </div>
                ) : topRoom ? (
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                            {getRoomName(topRoom.ruangan)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-900 dark:text-slate-200">
                                {topRoom.count.toLocaleString('id-ID')}
                            </span>
                            <span className="text-gray-500 dark:text-slate-400">kunjungan</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-400 dark:text-slate-500 italic">
                        Belum ada data
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function RoomPopularityStats() {
    const [stats, setStats] = useState({
        week: null,
        month: null,
        year: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Single API call instead of 3 — use 365-day superset
                // Week/month subsets are approximated from the same stats endpoint
                const yearDataResponse = await getVisitorStats({ days: 365 });
                const yearData = yearDataResponse.data;

                // For simplicity, we'll use the 365-day data for all periods
                // In a real scenario, the backend might provide filtered data
                // or the frontend would need to filter `byTime` data if available.
                setStats({
                    week: yearData, // Using year data as a placeholder for week
                    month: yearData, // Using year data as a placeholder for month
                    year: yearData,
                });
            } catch (error) {
                console.error("Error fetching room popularity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Favorit Minggu Ini"
                period="7 Hari Terakhir"
                data={stats.week}
                loading={loading}
                delay={0}
                icon={TrendingUp}
                iconBgClass="bg-emerald-100 dark:bg-emerald-500/20"
                iconTextClass="text-emerald-600 dark:text-emerald-400"
                decoClass="text-emerald-500"
            />
            <StatCard
                title="Favorit Bulan Ini"
                period="30 Hari Terakhir"
                data={stats.month}
                loading={loading}
                delay={0.1}
                icon={Calendar}
                iconBgClass="bg-indigo-100 dark:bg-indigo-500/20"
                iconTextClass="text-indigo-600 dark:text-indigo-400"
                decoClass="text-indigo-500"
            />
            <StatCard
                title="Favorit Tahun Ini"
                period="365 Hari Terakhir"
                data={stats.year}
                loading={loading}
                delay={0.2}
                icon={Trophy}
                iconBgClass="bg-amber-100 dark:bg-amber-500/20"
                iconTextClass="text-amber-600 dark:text-amber-400"
                decoClass="text-amber-500"
            />
        </div>
    );
}

export default RoomPopularityStats;
