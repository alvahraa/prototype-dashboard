import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Table2 } from 'lucide-react';
import {
    AudiovisualStats,
    AudiovisualChart,
    AudiovisualTable
} from '../components/Audiovisual';
import {
    LoadingPage,
    ErrorMessage,
    RefreshButton,
    DateRangePicker,
    LastUpdated,
    Tabs,
    VisitTrendChart,
} from '../components/Common';
import { useAudiovisual } from '../hooks';
import { getAVStats } from '../services/audiovisualService';

/**
 * Audiovisual Page
 * 
 * Halaman analytics untuk kunjungan ruang audiovisual
 * - Overview: Stats + Charts
 * - Logs: Tabel dengan export
 */

// Tab definitions
const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'logs', label: 'Log Kunjungan', icon: Table2 },
];

// Tab content animation
const tabContentVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

function AudiovisualPage() {
    // Active tab state
    const [activeTab, setActiveTab] = useState('overview');

    // Date range state - default 30 hari
    const [dateRange, setDateRange] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };
    });

    const [lastUpdated, setLastUpdated] = useState(null);
    const [stats, setStats] = useState(null);
    const { data: visits, loading, error, refetch } = useAudiovisual(dateRange);

    // Fetch stats when visits change
    React.useEffect(() => {
        if (visits) {
            getAVStats(dateRange).then(result => {
                if (result.data) {
                    setStats(result.data);
                }
            });
        }
    }, [visits, dateRange]);

    const handleRefresh = useCallback(() => {
        refetch();
        setLastUpdated(new Date());
    }, [refetch]);

    // Today's visits count
    const todayVisits = useMemo(() => {
        if (!visits) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return visits.filter(v => new Date(v.visitTime) >= today).length;
    }, [visits]);

    // Total month visits
    const totalMonthVisits = useMemo(() => {
        if (!visits) return 0;
        return visits.length;
    }, [visits]);

    if (loading && !visits) {
        return <LoadingPage message="Memuat data kunjungan audiovisual..." />;
    }

    if (error && !visits) {
        return (
            <ErrorMessage
                message={error}
                onRetry={handleRefresh}
                variant="page"
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />
                    {lastUpdated && <LastUpdated timestamp={lastUpdated} />}
                </div>
                <RefreshButton
                    onClick={handleRefresh}
                    loading={loading}
                />
            </div>

            {/* Error banner */}
            {error && visits && (
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                    variant="card"
                />
            )}

            {/* Tab Navigation */}
            <div className="flex items-center justify-between">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Quick Stats Badge */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <span className="font-medium text-gray-900 dark:text-slate-100">{totalMonthVisits.toLocaleString('id-ID')}</span>
                    <span>kunjungan bulan ini</span>
                </div>
            </div>

            {/* Tab Content with Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                    }}
                >
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <AudiovisualStats
                                stats={stats}
                                todayVisits={todayVisits}
                            />

                            {/* Trend Chart */}
                            <VisitTrendChart
                                visits={visits}
                                title="Trend Kunjungan 7 Hari Terakhir"
                                color="#8b5cf6"
                            />

                            {/* Faculty Distribution Chart */}
                            {stats?.facultyDistribution && (
                                <AudiovisualChart
                                    data={stats.facultyDistribution}
                                    title="Distribusi Kunjungan per Fakultas"
                                />
                            )}
                        </div>
                    )}

                    {/* Logs Tab */}
                    {activeTab === 'logs' && visits && (
                        <AudiovisualTable
                            visits={visits}
                            title="Log Kunjungan Audiovisual"
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default AudiovisualPage;
