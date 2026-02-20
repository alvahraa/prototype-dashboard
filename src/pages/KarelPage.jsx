import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Table2 } from 'lucide-react';
import { KarelStats, KarelChart, KarelTable } from '../components/Karel';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated, Tabs, VisitTrendChart } from '../components/Common';
import { useKarel } from '../hooks';
import { getKarelStats } from '../services/karelService';

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'logs', label: 'Log Kunjungan', icon: Table2 },
];

const tabContentVariants = { enter: { opacity: 0, y: 10 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

function KarelPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
    });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [stats, setStats] = useState(null);
    const { data: visits, loading, error, refetch } = useKarel(dateRange);

    React.useEffect(() => {
        if (visits) {
            getKarelStats(dateRange).then(result => { if (result.data) setStats(result.data); });
        }
    }, [visits, dateRange]);

    const handleRefresh = useCallback(() => { refetch(); setLastUpdated(new Date()); }, [refetch]);
    const todayVisits = useMemo(() => { if (!visits) return 0; const today = new Date(); today.setHours(0, 0, 0, 0); return visits.filter(v => new Date(v.visitTime) >= today).length; }, [visits]);
    const totalMonthVisits = useMemo(() => visits?.length || 0, [visits]);

    if (loading && !visits) return <LoadingPage message="Memuat data kunjungan Ruang Karel..." />;
    if (error && !visits) return <ErrorMessage message={error} onRetry={handleRefresh} variant="page" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4"><DateRangePicker value={dateRange} onChange={setDateRange} />{lastUpdated && <LastUpdated timestamp={lastUpdated} />}</div>
                <RefreshButton onClick={handleRefresh} loading={loading} />
            </div>
            {error && visits && <ErrorMessage message={error} onRetry={handleRefresh} variant="card" />}
            <div className="flex items-center justify-between">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400"><span className="font-medium text-gray-900 dark:text-slate-100">{totalMonthVisits.toLocaleString('id-ID')}</span><span>kunjungan bulan ini</span></div>
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} variants={tabContentVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 200, damping: 25 }}>
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <KarelStats stats={stats} todayVisits={todayVisits} />
                            <VisitTrendChart visits={visits} title="Trend Kunjungan 7 Hari Terakhir" color="#ec4899" />
                            {stats?.facultyDistribution && <KarelChart data={stats.facultyDistribution} title="Distribusi Kunjungan per Fakultas" />}
                        </div>
                    )}
                    {activeTab === 'logs' && visits && <KarelTable visits={visits} title="Log Kunjungan Ruang Karel" />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default KarelPage;

