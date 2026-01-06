import React from 'react';
import { TrendingUp, BookOpen } from 'lucide-react';

/**
 * TrendingBooks Component
 * 
 * Display top trending books minggu ini dalam list format
 */

function TrendingBooks({ books, loading = false, title = "🔥 Trending Minggu Ini" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const trendingBooks = books || [];

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-xs text-text-secondary">Buku paling banyak dipinjam 7 hari terakhir</p>
        </div>
      </div>

      <div className="space-y-2">
        {trendingBooks.map((book, index) => (
          <div 
            key={book.id}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              index % 2 === 0 ? 'bg-gray-50/50' : ''
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index < 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              #{index + 1}
            </div>

            {/* Cover Thumbnail */}
            <div 
              className="w-12 h-16 rounded shadow flex items-center justify-center text-lg"
              style={{ 
                background: `linear-gradient(135deg, #1a1a2e, #16213e)`,
                color: 'white'
              }}
            >
              <BookOpen className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-1">{book.title}</h4>
              <p className="text-xs text-text-secondary line-clamp-1">{book.author}</p>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="text-sm font-bold text-black flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                {book.totalLoans}
              </p>
              <p className="text-xs text-text-secondary">peminjaman</p>
            </div>
          </div>
        ))}
      </div>

      {trendingBooks.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Tidak ada data trending</p>
        </div>
      )}
    </div>
  );
}

export default TrendingBooks;
