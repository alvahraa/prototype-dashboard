import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Table2, PieChart } from 'lucide-react';
import { 
  PeakHoursHeatmap, 
  FacultyPieChart, 
  VisitorTable, 
  VisitorStats 
} from '../components/Visitors';
import { 
  LoadingPage, 
  ErrorMessage, 
  RefreshButton, 
  DateRangePicker, 
  LastUpdated,
  Tabs,
} from '../components/Common';
import { useVisitors } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Visitors Page - Tab-Based Architecture
 * 
 * Three tabs for content hierarchy:
 * 1. Overview & Analytics - Charts and KPIs
 * 2. Visitor Logs - Data table
 * 3. Demographics - Faculty distribution
 */

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'logs', label: 'Visitor Logs', icon: Table2 },
  { id: 'demographics', label: 'Demographics', icon: PieChart },
];

// Tab content animation
const tabContentVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
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

  const durationStats = useMemo(() => {
    if (!visitors) return { average: 0, min: 0, max: 0 };
    return analytics.calculateAverageDuration(visitors);
  }, [visitors]);

  const facultyDistribution = useMemo(() => {
    if (!visitors) return [];
    return analytics.getFacultyDistribution(visitors);
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
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-900">{totalMonthVisits.toLocaleString('id-ID')}</span>
          <span>pengunjung bulan ini</span>
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
              <VisitorStats 
                durationStats={durationStats}
                peakHours={peakHours}
                totalMonthVisits={totalMonthVisits}
              />
              
              {/* Peak Hours Chart - Full Width */}
              <PeakHoursHeatmap 
                data={peakHours} 
                title="Distribusi Jam Kunjungan"
              />
            </div>
          )}

          {/* Visitor Logs Tab */}
          {activeTab === 'logs' && visitors && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Log Pengunjung
                </h2>
                <span className="text-sm text-gray-500">
                  {visitors.length.toLocaleString('id-ID')} entries
                </span>
              </div>
              <VisitorTable 
                visitors={visitors} 
                title=""
              />
            </div>
          )}

          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-6">
              {/* Faculty Pie Chart - Featured */}
              <FacultyPieChart 
                data={facultyDistribution} 
                title="Distribusi per Fakultas"
              />
              
              {/* Additional Demographics Info */}
              <div className="card">
                <h3 className="card-header">Insight Demographics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {facultyDistribution.slice(0, 4).map((faculty, index) => (
                    <div key={faculty.name} className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-900">{faculty.percentage}%</p>
                      <p className="text-sm text-gray-500 mt-1">{faculty.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{faculty.count.toLocaleString('id-ID')} visitors</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VisitorsPage;
