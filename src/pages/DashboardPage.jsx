import React, { useState, useMemo, useCallback } from 'react';
import { KPICards, TrendChart, CategoryChart } from '../components/Dashboard';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated } from '../components/Common';
import { useDashboardData } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * Dashboard Page
 * 
 * Overview halaman utama dengan:
 * - KPI Cards (4 metrics utama)
 * - Trend Chart (7 hari terakhir)
 * - Category Chart (peminjaman per kategori)
 * 
 * Terintegrasi dengan API service layer:
 * - Loading states saat fetch data
 * - Error handling jika gagal
 * - Refresh button untuk update manual
 * - Date range filter
 */

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

  // Last updated timestamp
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data using hooks
  const { visitors, loans, books, loading, error, refetch } = useDashboardData(dateRange);

  // Handle refresh with timestamp update
  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Memoize analytics calculations - only when data is available
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

  // Loading state
  if (loading && !visitors) {
    return <LoadingPage message="Memuat data dashboard..." />;
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

      {/* KPI Cards */}
      {summary && <KPICards summary={summary} />}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          data={visitorTrend} 
          title="Trend Kunjungan 7 Hari Terakhir"
        />
        <CategoryChart 
          data={categoryPopularity} 
          title="Peminjaman per Kategori"
        />
      </div>

      {/* Top Books Section */}
      <div className="card">
        <h3 className="card-header">Buku Terpopuler Bulan Ini</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topBooks.map((book, index) => (
            <div 
              key={book.id} 
              className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative mb-3">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div 
                  className="w-16 h-20 rounded shadow-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    backgroundColor: ['#000', '#333', '#555', '#777', '#999'][index],
                  }}
                >
                  <span className="text-lg">B</span>
                </div>
              </div>
              <p className="text-sm font-medium line-clamp-2 mb-1" title={book.title}>
                {book.title}
              </p>
              <p className="text-xs text-text-secondary mb-2">{book.author}</p>
              <span className="text-xs font-semibold bg-black text-white px-2 py-1 rounded-full">
                {book.totalLoans} pinjam
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
