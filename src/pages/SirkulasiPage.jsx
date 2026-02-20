import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, BarChart3, Table2 } from 'lucide-react';
import {
    SirkulasiStats,
    SirkulasiChart,
    SirkulasiTable
} from '../components/Sirkulasi';
import {
    LoadingPage,
    ErrorMessage,
    RefreshButton,
    DateRangePicker,
    LastUpdated,
    Tabs,
    VisitTrendChart,
} from '../components/Common';
import { useSirkulasi } from '../hooks';
import { getSirkulasiStats } from '../services/sirkulasiService';

/**
 * Ruangan Baca Page
 * 
 * Halaman analytics untuk kunjungan ruangan baca
 * - Floor tabs: Lantai 1, Lantai 2, Lantai 3
 * - Content tabs: Overview, Logs
 */

// Floor tabs
const floorTabs = [
    { id: 'lantai1', label: 'Lantai 1', icon: Building },
    { id: 'lantai2', label: 'Lantai 2', icon: Building },
    { id: 'lantai3', label: 'Lantai 3', icon: Building },
];

// Content tabs
const contentTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'logs', label: 'Log Kunjungan', icon: Table2 },
];

const tabContentVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

function SirkulasiPage() {
    const [activeFloor, setActiveFloor] = useState('lantai1');
    const [activeContent, setActiveContent] = useState('overview');

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
    const [stats1, setStats1] = useState(null);
    const [stats2, setStats2] = useState(null);
    const [stats3, setStats3] = useState(null);

    const floor = activeFloor === 'lantai1' ? 1 : activeFloor === 'lantai2' ? 2 : 3;
    const { data: visits, loading, error, refetch } = useSirkulasi(floor, dateRange);

    // Fetch stats when visits change
    React.useEffect(() => {
        if (visits) {
            getSirkulasiStats({ ...dateRange, lantai: floor }).then(result => {
                if (result.data) {
                    if (floor === 1) {
                        setStats1(result.data);
                    } else if (floor === 2) {
                        setStats2(result.data);
                    } else {
                        setStats3(result.data);
                    }
                }
            });
        }
    }, [visits, dateRange, floor]);

    const handleRefresh = useCallback(() => {
        refetch();
        setLastUpdated(new Date());
    }, [refetch]);

    const todayVisits = useMemo(() => {
        if (!visits) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return visits.filter(v => new Date(v.visitTime) >= today).length;
    }, [visits]);

    const totalMonthVisits = useMemo(() => {
        if (!visits) return 0;
        return visits.length;
    }, [visits]);

    const currentStats = floor === 1 ? stats1 : floor === 2 ? stats2 : stats3;

    if (loading && !visits) {
        return <LoadingPage message={`Memuat data kunjungan Ruangan Baca Lantai ${floor}...`} />;
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

            {/* Floor Tabs - Primary */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {floorTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFloor(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeFloor === tab.id
                                ? 'bg-gray-900 text-white dark:bg-indigo-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-700 dark:text-slate-300 dark:hover:bg-dark-600'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <span className="font-medium text-gray-900 dark:text-slate-100">{totalMonthVisits.toLocaleString('id-ID')}</span>
                    <span>kunjungan bulan ini</span>
                </div>
            </div>

            {/* Content Tabs - Secondary */}
            <Tabs
                tabs={contentTabs}
                activeTab={activeContent}
                onTabChange={setActiveContent}
            />

            {/* Tab Content with Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeFloor}-${activeContent}`}
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
                    {activeContent === 'overview' && (
                        <div className="space-y-6">
                            <SirkulasiStats
                                stats={currentStats}
                                todayVisits={todayVisits}
                                floor={floor}
                            />

                            {/* Trend Chart */}
                            <VisitTrendChart
                                visits={visits}
                                title={`Trend Kunjungan 7 Hari Terakhir - Lantai ${floor}`}
                                color={floor === 2 ? '#06b6d4' : '#8b5cf6'}
                            />

                            {currentStats?.facultyDistribution && (
                                <SirkulasiChart
                                    data={currentStats.facultyDistribution}
                                    title={`Distribusi Kunjungan per Fakultas - Lantai ${floor}`}
                                    floor={floor}
                                />
                            )}
                        </div>
                    )}

                    {/* Logs Tab */}
                    {activeContent === 'logs' && visits && (
                        <SirkulasiTable
                            visits={visits}
                            title={`Log Kunjungan Sirkulasi - Lantai ${floor}`}
                            floor={floor}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default SirkulasiPage;
