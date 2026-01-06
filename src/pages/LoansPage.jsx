import React, { useState, useMemo, useCallback } from 'react';
import { TopBooksGrid, CategoryBarChart, LoanTrendChart, LateReturnStats } from '../components/Loans';
import { LoadingPage, ErrorMessage, RefreshButton, DateRangePicker, LastUpdated } from '../components/Common';
import { useLoans, useBooks } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * LoansPage - Enhanced Version
 * 
 * Halaman analisis peminjaman lengkap dengan:
 * - Late Return Stats (progress bars)
 * - Top 10 Books Grid (dengan covers)
 * - Category Bar Chart
 * - Loan Trend Chart
 * 
 * Terintegrasi dengan API service layer:
 * - Loading states saat fetch data
 * - Error handling jika gagal
 * - Refresh button untuk update manual
 * - Date range filter
 */

function LoansPage() {
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
  const { data: loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans(dateRange);
  const { data: books, loading: booksLoading, error: booksError, refetch: refetchBooks } = useBooks();

  const loading = loansLoading || booksLoading;
  const error = loansError || booksError;

  // Handle refresh with timestamp update
  const handleRefresh = useCallback(() => {
    refetchLoans();
    refetchBooks();
    setLastUpdated(new Date());
  }, [refetchLoans, refetchBooks]);

  // Memoize all analytics - only when data is available
  const lateAnalysis = useMemo(() => {
    if (!loans) return { totalLate: 0, latePercentage: 0, byDuration: [] };
    return analytics.analyzeLateReturns(loans);
  }, [loans]);

  const loanTrend = useMemo(() => {
    if (!loans) return [];
    return analytics.getLoanTrend(loans, 6);
  }, [loans]);

  const topBooks = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getTopBooks(loans, books, 10);
  }, [loans, books]);

  const categoryPop = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getCategoryPopularity(loans, books);
  }, [loans, books]);

  // Loading state
  if (loading && !loans) {
    return <LoadingPage message="Memuat data peminjaman..." />;
  }

  // Error state
  if (error && !loans) {
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
      {error && loans && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRefresh}
          variant="card"
        />
      )}

      {/* Late Returns Stats */}
      <section>
        <h2 className="text-xl font-bold mb-4">⚠️ Analisis Keterlambatan</h2>
        <LateReturnStats lateAnalysis={lateAnalysis} />
      </section>

      {/* Top 10 Books */}
      <section>
        <TopBooksGrid books={topBooks} />
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Trend */}
        <LoanTrendChart data={loanTrend} title="📈 Trend Peminjaman 6 Bulan" />
        
        {/* Category Popularity */}
        <CategoryBarChart data={categoryPop} title="📊 Kategori Paling Diminati" />
      </div>
    </div>
  );
}

export default LoansPage;
