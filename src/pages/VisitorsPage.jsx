import React, { useState, useMemo, useCallback } from 'react';
import { 
  PeakHoursHeatmap, 
  FacultyPieChart, 
  VisitorTable, 
  VisitorStats 
} from '../components/Visitors';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated } from '../components/Common';
import { useVisitors } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Visitors Page
 * 
 * Analisis kunjungan dengan:
 * - Visitor Stats (3 metrics)
 * - Peak Hours Heatmap
 * - Faculty Pie Chart
 * - Visitor Table (real-time log)
 * 
 * Terintegrasi dengan API service layer:
 * - Loading states saat fetch data
 * - Error handling jika gagal
 * - Refresh button untuk update manual
 * - Date range filter
 */

function VisitorsPage() {
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

  // Last updated timestamp
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch visitors data using hook
  const { data: visitors, loading, error, refetch } = useVisitors(dateRange);

  // Handle refresh with timestamp update
  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Memoize analytics calculations - only when data is available
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

  // Loading state
  if (loading && !visitors) {
    return <LoadingPage message="Memuat data kunjungan..." />;
  }

  // Error state
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
      {/* Header with filters & refresh */}
      <div className="flex items-center justify-between">
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

      {/* Error banner (for refresh errors) */}
      {error && visitors && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRefresh}
          variant="card"
        />
      )}

      {/* Stats Cards */}
      <VisitorStats 
        durationStats={durationStats}
        peakHours={peakHours}
        totalMonthVisits={totalMonthVisits}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PeakHoursHeatmap 
          data={peakHours} 
          title="Distribusi Jam Kunjungan"
        />
        <FacultyPieChart 
          data={facultyDistribution} 
          title="Distribusi per Fakultas"
        />
      </div>

      {/* Visitor Table */}
      {visitors && (
        <VisitorTable 
          visitors={visitors} 
          title="Log Pengunjung Terbaru"
        />
      )}
    </div>
  );
}

export default VisitorsPage;
