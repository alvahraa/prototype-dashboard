import React, { useState, useMemo, useCallback } from 'react';
import { TrendingBooks, CollaborativeRecs, ContentBasedRecs } from '../components/Recommendations';
import { LoadingPage, ErrorMessage, RefreshButton, LastUpdated } from '../components/Common';
import { useVisitors, useLoans, useBooks } from '../hooks';
import * as analytics from '../utils/analytics';

/**
 * RecommendationsPage - Enhanced Version
 * 
 * Sistem Rekomendasi dengan:
 * - Trending Books
 * - Collaborative Filtering
 * - Content-Based Recommendations
 * - Algorithm Explanation
 * 
 * Terintegrasi dengan API service layer:
 * - Loading states saat fetch data
 * - Error handling jika gagal
 * - Refresh button untuk update manual
 */

function RecommendationsPage() {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data using hooks
  const { data: visitors, loading: visitorsLoading, error: visitorsError, refetch: refetchVisitors } = useVisitors();
  const { data: loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans();
  const { data: books, loading: booksLoading, error: booksError, refetch: refetchBooks } = useBooks();

  const loading = visitorsLoading || loansLoading || booksLoading;
  const error = visitorsError || loansError || booksError;

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchVisitors();
    refetchLoans();
    refetchBooks();
    setLastUpdated(new Date());
  }, [refetchVisitors, refetchLoans, refetchBooks]);

  // Get trending books
  const trendingBooks = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getTrendingBooks(loans, books, 7, 10);
  }, [loans, books]);

  // Get sample book for collaborative demo
  const sampleBook = useMemo(() => books?.[0], [books]);
  
  // Get collaborative recommendations
  const collaborativeRecs = useMemo(() => {
    if (!loans || !books) return [];
    const bookId = selectedBookId || sampleBook?.id;
    return analytics.getCollaborativeRecommendations(bookId, loans, books, 5);
  }, [selectedBookId, sampleBook, loans, books]);

  // Get unique visitors for user selection
  const uniqueVisitors = useMemo(() => {
    if (!visitors) return [];
    const seen = new Set();
    return visitors.filter(v => {
      if (seen.has(v.nim)) return false;
      seen.add(v.nim);
      return true;
    }).slice(0, 10);
  }, [visitors]);

  // Get content-based recommendations
  const contentBasedRecs = useMemo(() => {
    if (!loans || !books || !uniqueVisitors.length) return [];
    const userId = selectedUserId || uniqueVisitors[0]?.nim;
    return analytics.getContentBasedRecommendations(userId, loans, books, 5);
  }, [selectedUserId, uniqueVisitors, loans, books]);

  // Loading state
  if (loading && !books) {
    return <LoadingPage message="Memuat data rekomendasi..." />;
  }

  // Error state
  if (error && !books) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={handleRefresh}
        variant="page"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Sistem Rekomendasi</h2>
          {lastUpdated && <LastUpdated timestamp={lastUpdated} />}
        </div>
        <RefreshButton 
          onClick={handleRefresh}
          loading={loading}
        />
      </div>

      {/* Error banner (for refresh errors) */}
      {error && books && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRefresh}
          variant="card"
        />
      )}

      {/* Trending Section */}
      <TrendingBooks books={trendingBooks} />

      {/* Collaborative Filtering */}
      {books && (
        <CollaborativeRecs
          recommendations={collaborativeRecs}
          books={books}
          selectedBookId={selectedBookId || sampleBook?.id}
          onSelectBook={setSelectedBookId}
        />
      )}

      {/* Content-Based */}
      {visitors && (
        <ContentBasedRecs
          recommendations={contentBasedRecs}
          visitors={visitors}
          selectedUserId={selectedUserId || uniqueVisitors[0]?.nim}
          onSelectUser={setSelectedUserId}
        />
      )}

      {/* Algorithm Explanation */}
      <section className="card bg-gray-50">
        <h3 className="font-bold text-lg mb-4">Bagaimana Sistem Rekomendasi Bekerja?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-black text-white rounded-full text-xs flex items-center justify-center">1</span>
              Trending
            </h4>
            <p className="text-sm text-text-secondary">
              Menghitung buku yang paling sering dipinjam dalam 7 hari terakhir. 
              Simple frequency counting dengan time-based filtering.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-700 text-white rounded-full text-xs flex items-center justify-center">2</span>
              Collaborative Filtering
            </h4>
            <p className="text-sm text-text-secondary">
              Mencari peminjam yang meminjam buku yang sama, lalu merekomendasikan 
              buku lain yang juga mereka pinjam. "People who liked X also liked Y".
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
              Content-Based
            </h4>
            <p className="text-sm text-text-secondary">
              Menganalisis riwayat peminjaman user untuk menemukan kategori favorit, 
              lalu merekomendasikan buku dari kategori yang sama dengan rating tertinggi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecommendationsPage;
