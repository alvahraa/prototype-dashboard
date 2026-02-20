import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { KPICards, TrendChart, RightStatsSidebar } from '../components/Dashboard';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated } from '../components/Common';
import { useVisitors, useAudiovisual } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Dashboard Page - Premium Redesign
 * 
 * Clean, Spacious, High-End Professional layout
 * - Bento Grid for widgets
 * - Maximized whitespace
 * - Staggered entry animations
 * - Focus on visits (regular + audiovisual)
 */

// Staggered container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
};

function DashboardPage({ isPublic = false }) {
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
  const { data: visitors, loading: visitorsLoading, error: visitorsError, refetch: refetchVisitors } = useVisitors(dateRange);
  const { data: avVisits, loading: avLoading, error: avError, refetch: refetchAV } = useAudiovisual(dateRange);

  const loading = visitorsLoading || avLoading;
  const error = visitorsError || avError;

  const handleRefresh = useCallback(() => {
    refetchVisitors();
    refetchAV();
    setLastUpdated(new Date());
  }, [refetchVisitors, refetchAV]);

  // Analytics calculations
  const summary = useMemo(() => {
    if (!visitors) return null;
    return analytics.getDashboardSummary(visitors, null, null, avVisits || []);
  }, [visitors, avVisits]);

  const visitorTrend = useMemo(() => {
    if (!visitors) return [];
    return analytics.getVisitorTrend(visitors, 7);
  }, [visitors]);

  if (loading && !visitors) {
    return <LoadingPage message="Memuat data dashboard..." />;
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
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
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
      </motion.div>

      {/* Content Layout: Main + Right Sidebar */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Main Column */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Error banner */}
          {error && (
            <motion.div variants={itemVariants}>
              <ErrorMessage
                message={error}
                onRetry={handleRefresh}
                variant="card"
              />
            </motion.div>
          )}

          {/* KPI Cards - Bento Grid 4 columns */}
          {summary && (
            <motion.div variants={itemVariants}>
              <KPICards summary={summary} isPublic={isPublic} />
            </motion.div>
          )}

          {/* Chart - Trend Kunjungan */}
          <motion.div variants={itemVariants}>
            <TrendChart
              data={visitorTrend}
              title="Trend Kunjungan 7 Hari Terakhir"
            />
          </motion.div>
        </div>

        {/* Right Sidebar Column - Visible on xl+ */}
        <motion.div variants={itemVariants} className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-6 space-y-6">
            <RightStatsSidebar />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default DashboardPage;

