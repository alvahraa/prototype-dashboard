import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, FileSpreadsheet } from 'lucide-react';
import {
  PeakHoursHeatmap,
  FacultyPieChart,
  ProdiPieChart,
  VisitorStats,
  RoomPopularityStats,
  HistoricalDataPanel
} from '../components/Visitors';
import {
  LoadingPage,
  ErrorMessage,
  RefreshButton,
  DateRangePicker,
  LastUpdated,
  VisitTrendChart,
  Tabs,
} from '../components/Common';
import { useVisitors } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Kunjungan Page - Total Visits Analysis
 * 
 * Shows aggregated visit data from all rooms:
 * - Overview Tab: Stats, Charts, Distributions
 * - Riwayat Tab: Historical data with export
 */

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'riwayat', label: 'Riwayat & Export', icon: FileSpreadsheet },
];

// Tab content animation
const tabContentVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function VisitorsPage() {
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

  // Trend period filter state
  const [trendPeriod, setTrendPeriod] = useState(7);
  const trendPeriodOptions = [
    { value: 7, label: '7 Hari' },
    { value: 14, label: '14 Hari' },
    { value: 30, label: '30 Hari' },
    { value: 90, label: '90 Hari' },
    { value: 365, label: '1 Tahun' },
  ];

  const [lastUpdated, setLastUpdated] = useState(null);
  const { data: visitors, loading, error, refetch } = useVisitors(dateRange);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Analytics calculations
  const peakHours = useMemo(() => {
    if (!visitors) return [];
    return analytics.calculatePeakHours(visitors);
  }, [visitors]);

  const facultyDistribution = useMemo(() => {
    if (!visitors) return [];
    return analytics.getFacultyDistribution(visitors);
  }, [visitors]);

  const prodiDistribution = useMemo(() => {
    if (!visitors) return [];
    return analytics.getProdiDistribution(visitors);
  }, [visitors]);

  const totalMonthVisits = useMemo(() => {
    if (!visitors) return 0;
    return visitors.length;
  }, [visitors]);

  if (loading && !visitors) {
    return <LoadingPage message="Memuat data kunjungan..." />;
  }

  if (error && !visitors) {
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
      {error && visitors && (
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
          <span>kunjungan periode ini</span>
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
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' ? (
            // Overview Tab Content
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Cards - Wide Layout */}
              <motion.div variants={itemVariants}>
                <VisitorStats
                  peakHours={peakHours}
                  totalMonthVisits={totalMonthVisits}
                />
              </motion.div>

              {/* Room Popularity Stats (Week/Month/Year) - Wide Layout */}
              <motion.div variants={itemVariants}>
                <RoomPopularityStats />
              </motion.div>

              {/* Trend Chart with Period Filter */}
              <motion.div variants={itemVariants}>
                <div className="card">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      Trend Kunjungan {trendPeriod === 365 ? '1 Tahun' : `${trendPeriod} Hari`} Terakhir
                    </h3>
                    <div className="flex items-center gap-2">
                      {trendPeriodOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTrendPeriod(option.value)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${trendPeriod === option.value
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <VisitTrendChart
                    visits={visitors || []}
                    title=""
                    color="#6366f1"
                    days={trendPeriod}
                  />
                </div>
              </motion.div>

              {/* Charts Grid - Stacked for Cleaner Look */}
              <div className="space-y-6">
                {/* Peak Hours Heatmap */}
                <motion.div variants={itemVariants}>
                  <PeakHoursHeatmap
                    data={peakHours}
                    title="Distribusi Jam Kunjungan"
                  />
                </motion.div>

                {/* Faculty Distribution - Wide & Clean */}
                <motion.div variants={itemVariants}>
                  <FacultyPieChart
                    data={facultyDistribution}
                    title="Distribusi per Fakultas"
                  />
                </motion.div>

                {/* Prodi Distribution */}
                <motion.div variants={itemVariants}>
                  <ProdiPieChart
                    data={prodiDistribution}
                    title="Distribusi per Program Studi"
                  />
                </motion.div>
              </div>

              {/* Top 5 Fakultas */}
              {facultyDistribution && facultyDistribution.length > 0 && (
                <motion.div variants={itemVariants} className="card">
                  <h3 className="card-header">Top 5 Fakultas Pengunjung</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {facultyDistribution.slice(0, 5).filter(f => f && f.faculty).map((item, index) => (
                      <div key={item.faculty || index} className="text-center p-4 bg-gray-50 dark:bg-dark-750 rounded-xl">
                        <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">#{index + 1}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{item.percentage || 0}%</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 truncate" title={item.faculty}>{(item.faculty || '').replace('Fakultas ', '')}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{(item.count || 0).toLocaleString('id-ID')} visits</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Riwayat Tab Content
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <HistoricalDataPanel visitors={visitors || []} />
              </motion.div>

              {/* Info Card */}
              <motion.div variants={itemVariants} className="card bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Tentang Data Historis
                    </h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Data yang ditampilkan mencakup riwayat kunjungan berdasarkan periode yang dipilih.
                      Gunakan filter periode untuk melihat data mingguan, bulanan, atau tahunan.
                      File export dalam format CSV yang dapat dibuka di Microsoft Excel.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VisitorsPage;
