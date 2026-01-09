import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BookOpen, History } from 'lucide-react';
import { TopBooksGrid, CategoryBarChart, LoanTrendChart, LateReturnStats } from '../components/Loans';
import { 
  LoadingPage, 
  ErrorMessage, 
  RefreshButton, 
  DateRangePicker, 
  LastUpdated,
  Tabs 
} from '../components/Common';
import { useLoans, useBooks } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * LoansPage - Tab-Based Architecture
 * 
 * Three tabs for content hierarchy:
 * 1. Analytics & Trends - Charts and stats
 * 2. Top Books - Visual showcase
 * 3. Loan History - Data management (future)
 */

// Tab definitions
const tabs = [
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'books', label: 'Top Books', icon: BookOpen },
  { id: 'history', label: 'Loan History', icon: History },
];

// Tab content animation
const tabContentVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function LoansPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Date range state
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

  // Fetch data
  const { data: loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans(dateRange);
  const { data: books, loading: booksLoading, error: booksError, refetch: refetchBooks } = useBooks();

  const loading = loansLoading || booksLoading;
  const error = loansError || booksError;

  const handleRefresh = useCallback(() => {
    refetchLoans();
    refetchBooks();
    setLastUpdated(new Date());
  }, [refetchLoans, refetchBooks]);

  // Analytics calculations
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

  const totalLoans = loans?.length || 0;
  const activeLoans = loans?.filter(l => !l.returnDate)?.length || 0;

  if (loading && !loans) {
    return <LoadingPage message="Memuat data peminjaman..." />;
  }

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
      {error && loans && (
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
        
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="text-gray-500">
            <span className="font-semibold text-gray-900">{totalLoans.toLocaleString('id-ID')}</span> total
          </div>
          <div className="text-gray-500">
            <span className="font-semibold text-emerald-600">{activeLoans.toLocaleString('id-ID')}</span> aktif
          </div>
        </div>
      </div>

      {/* Tab Content */}
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
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Late Returns Analysis */}
              <div className="card">
                <h3 className="card-header">Analisis Keterlambatan</h3>
                <LateReturnStats lateAnalysis={lateAnalysis} />
              </div>
              
              {/* Charts Row */}
              <div className="bento-grid-2">
                <LoanTrendChart data={loanTrend} title="Trend Peminjaman 6 Bulan" />
                <CategoryBarChart data={categoryPop} title="Kategori Paling Diminati" />
              </div>
            </div>
          )}

          {/* Top Books Tab */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <TopBooksGrid books={topBooks} title="Top 10 Buku Terpopuler" />
              
              {/* Category Stats */}
              <div className="card">
                <h3 className="card-header">Popularitas per Kategori</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categoryPop.slice(0, 6).map((cat, index) => (
                    <div 
                      key={cat.category} 
                      className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-2xl font-bold text-gray-900">{cat.percentage}%</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{cat.category}</p>
                      <p className="text-xs text-gray-400">{cat.count.toLocaleString('id-ID')} pinjam</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loan History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="card-header mb-0">Riwayat Peminjaman</h3>
                  <div className="flex items-center gap-2">
                    <span className="chip chip-success">Aktif: {activeLoans}</span>
                    <span className="chip chip-neutral">Selesai: {totalLoans - activeLoans}</span>
                    <span className="chip chip-error">Terlambat: {lateAnalysis.totalLate}</span>
                  </div>
                </div>
                
                {/* Loan Table Placeholder */}
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Buku</th>
                        <th>Peminjam</th>
                        <th>Tanggal Pinjam</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans?.slice(0, 10).map((loan) => (
                        <tr key={loan.id}>
                          <td className="font-mono text-sm">{loan.id}</td>
                          <td className="font-medium">{loan.bookTitle || 'Unknown'}</td>
                          <td>{loan.borrowerName || loan.memberId}</td>
                          <td className="text-gray-500">
                            {new Date(loan.loanDate).toLocaleDateString('id-ID')}
                          </td>
                          <td>
                            {loan.returnDate ? (
                              <span className="chip chip-success">Dikembalikan</span>
                            ) : loan.isLate ? (
                              <span className="chip chip-error">Terlambat</span>
                            ) : (
                              <span className="chip chip-warning">Aktif</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Menampilkan 10 dari {totalLoans.toLocaleString('id-ID')} peminjaman
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default LoansPage;
