import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { KPICards, TrendChart, CategoryChart, SmartInsights } from '../components/Dashboard';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated } from '../components/Common';
import { useDashboardData } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Dashboard Page - Premium Redesign
 * 
 * Clean, Spacious, High-End Professional layout
 * - Bento Grid for widgets
 * - Maximized whitespace
 * - Staggered entry animations
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

function DashboardPage() {
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
  const { visitors, loans, books, loading, error, refetch } = useDashboardData(dateRange);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Analytics calculations
  const summary = useMemo(() => {
    if (!visitors || !books || !loans) return null;
    return analytics.getDashboardSummary(visitors, books, loans);
  }, [visitors, books, loans]);

  const visitorTrend = useMemo(() => {
    if (!visitors) return [];
    return analytics.getVisitorTrend(visitors, 30);
  }, [visitors]);

  const categoryPopularity = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getCategoryPopularity(loans, books);
  }, [loans, books]);

  const topBooks = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getTopBooks(loans, books, 5);
  }, [loans, books]);

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

      {/* Error banner */}
      {error && visitors && (
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
          <KPICards summary={summary} />
        </motion.div>
      )}
      {/* Smart Insights Panel */}
      <motion.div variants={itemVariants}>
        <SmartInsights 
          lateLoans={summary?.lateLoans || 0}
          visitorCount={visitors?.length || 0}
          avgVisitors={summary?.avgDailyVisitors || 0}
          topBooks={topBooks}
        />
      </motion.div>

      {/* Charts - Bento Grid 2 columns */}
      <motion.div 
        variants={itemVariants}
        className="bento-grid-2"
      >
        <TrendChart 
          data={visitorTrend} 
          title="Trend Kunjungan 7 Hari Terakhir"
        />
        <CategoryChart 
          data={categoryPopularity} 
          title="Peminjaman per Kategori"
        />
      </motion.div>

      {/* Top Books - Premium Card */}
      <motion.div 
        variants={itemVariants}
        className="card"
      >
        <h3 className="card-header">Buku Terpopuler Bulan Ini</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {topBooks.map((book, index) => (
            <motion.div 
              key={book.id}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center text-center p-5 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 cursor-pointer"
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {index + 1}
                </div>
                <div 
                  className="w-14 h-18 rounded-xl shadow-md flex items-center justify-center text-white text-sm font-medium"
                  style={{ 
                    backgroundColor: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'][index],
                    height: '72px',
                  }}
                >
                  B
                </div>
              </div>
              <p className="text-sm font-medium line-clamp-2 mb-1.5 text-gray-900" title={book.title}>
                {book.title}
              </p>
              <p className="text-xs text-gray-500 mb-3">{book.author}</p>
              <span className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-full">
                {book.totalLoans} pinjam
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardPage;
