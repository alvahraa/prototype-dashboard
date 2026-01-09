import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, User, GitBranch, Sparkles } from 'lucide-react';
import { TrendingBooks, CollaborativeRecs, ContentBasedRecs } from '../components/Recommendations';
import { 
  LoadingPage, 
  ErrorMessage, 
  RefreshButton, 
  LastUpdated,
  Tabs,
  ViewToggle 
} from '../components/Common';
import { useVisitors, useLoans, useBooks } from '../hooks';
import * as analytics from '../utils/analytics';

// TrendingSection with View Toggle
function TrendingSection({ trendingBooks }) {
  const [viewMode, setViewMode] = useState('grid');
  
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold">Trending Minggu Ini</h3>
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        <p className="text-gray-300 mb-6">
          Buku-buku yang paling banyak dipinjam dalam 7 hari terakhir.
        </p>
        
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingBooks.slice(0, 10).map((book, index) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer hover:bg-white/15 transition-colors"
              >
                <div className="relative mb-3">
                  {index < 3 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  )}
                  <div 
                    className="w-full aspect-[3/4] rounded-lg flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: `hsl(${index * 25}, 20%, ${25 + index * 5}%)` }}
                  >
                    {book.title?.charAt(0) || 'B'}
                  </div>
                </div>
                <p className="text-sm font-medium text-white line-clamp-2">{book.title}</p>
                <p className="text-xs text-gray-400 mt-1">{book.loanCount || book.totalLoans} pinjam</p>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Table View (Admin) */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Judul</th>
                  <th className="px-3 py-2">Penulis</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2 text-right">Pinjam</th>
                </tr>
              </thead>
              <tbody>
                {trendingBooks.slice(0, 10).map((book, index) => (
                  <tr key={book.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 font-bold text-orange-400">{index + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-400">{book.id}</td>
                    <td className="px-3 py-2 font-medium text-white">{book.title}</td>
                    <td className="px-3 py-2 text-gray-300">{book.author}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded">
                        {book.category || 'Umum'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-white">{book.loanCount || book.totalLoans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * RecommendationsPage - Tab-Based Architecture
 * 
 * Three tabs for algorithm showcase:
 * 1. Trending Now - Frequency counting
 * 2. For You - Content-based filtering
 * 3. Discover Patterns - Collaborative filtering
 */

// Tab definitions
const tabs = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'foryou', label: 'For You', icon: User },
  { id: 'discover', label: 'Discover', icon: GitBranch },
];

// Tab content animation with stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
    },
  },
};

const tabContentVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data
  const { data: visitors, loading: visitorsLoading, error: visitorsError, refetch: refetchVisitors } = useVisitors();
  const { data: loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans();
  const { data: books, loading: booksLoading, error: booksError, refetch: refetchBooks } = useBooks();

  const loading = visitorsLoading || loansLoading || booksLoading;
  const error = visitorsError || loansError || booksError;

  const handleRefresh = useCallback(() => {
    refetchVisitors();
    refetchLoans();
    refetchBooks();
    setLastUpdated(new Date());
  }, [refetchVisitors, refetchLoans, refetchBooks]);

  // Analytics
  const trendingBooks = useMemo(() => {
    if (!loans || !books) return [];
    return analytics.getTrendingBooks(loans, books, 7, 10);
  }, [loans, books]);

  const sampleBook = useMemo(() => books?.[0], [books]);
  
  const collaborativeRecs = useMemo(() => {
    if (!loans || !books) return [];
    const bookId = selectedBookId || sampleBook?.id;
    return analytics.getCollaborativeRecommendations(bookId, loans, books, 5);
  }, [selectedBookId, sampleBook, loans, books]);

  const uniqueVisitors = useMemo(() => {
    if (!visitors) return [];
    const seen = new Set();
    return visitors.filter(v => {
      if (seen.has(v.nim)) return false;
      seen.add(v.nim);
      return true;
    }).slice(0, 10);
  }, [visitors]);

  const contentBasedRecs = useMemo(() => {
    if (!loans || !books || !uniqueVisitors.length) return [];
    const userId = selectedUserId || uniqueVisitors[0]?.nim;
    return analytics.getContentBasedRecommendations(userId, loans, books, 5);
  }, [selectedUserId, uniqueVisitors, loans, books]);

  if (loading && !books) {
    return <LoadingPage message="Memuat data rekomendasi..." />;
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sistem Rekomendasi</h2>
            <p className="text-sm text-gray-500">Temukan buku berdasarkan algoritma cerdas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && <LastUpdated timestamp={lastUpdated} />}
          <RefreshButton onClick={handleRefresh} loading={loading} />
        </div>
      </div>

      {/* Error banner */}
      {error && books && (
        <ErrorMessage message={error} onRetry={handleRefresh} variant="card" />
      )}

      {/* Tab Navigation */}
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <TrendingSection trendingBooks={trendingBooks} />
          )}

          {/* For You Tab */}
          {activeTab === 'foryou' && visitors && (
            <div className="space-y-6">
              {/* Personalized Header */}
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold">Rekomendasi Untuk Anda</h3>
                </div>
                <p className="text-gray-500 mb-2">
                  Berdasarkan kategori buku yang sering Anda pinjam. 
                  Algoritma: <span className="font-medium text-gray-900">Content-Based Filtering</span>
                </p>
              </div>
              
              {/* Content-Based Component */}
              <ContentBasedRecs
                recommendations={contentBasedRecs}
                visitors={visitors}
                selectedUserId={selectedUserId || uniqueVisitors[0]?.nim}
                onSelectUser={setSelectedUserId}
              />
            </div>
          )}

          {/* Discover Patterns Tab */}
          {activeTab === 'discover' && books && (
            <div className="space-y-6">
              {/* Pattern Discovery Header */}
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold">Temukan Pola Peminjaman</h3>
                </div>
                <p className="text-gray-500 mb-2">
                  "Pengguna yang meminjam buku ini juga meminjam..." 
                  Algoritma: <span className="font-medium text-gray-900">Collaborative Filtering</span>
                </p>
              </div>
              
              {/* Collaborative Component */}
              <CollaborativeRecs
                recommendations={collaborativeRecs}
                books={books}
                selectedBookId={selectedBookId || sampleBook?.id}
                onSelectBook={setSelectedBookId}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Algorithm Info Footer */}
      <motion.div 
        className="card bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-semibold mb-4">Tentang Algoritma</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Flame className="w-3 h-3" />
            </span>
            <div>
              <p className="font-medium">Trending</p>
              <p className="text-gray-500">Simple frequency counting dengan time filter</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3" />
            </span>
            <div>
              <p className="font-medium">Content-Based</p>
              <p className="text-gray-500">Category matching dari riwayat user</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-3 h-3" />
            </span>
            <div>
              <p className="font-medium">Collaborative</p>
              <p className="text-gray-500">Co-occurrence analysis antar peminjam</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RecommendationsPage;
