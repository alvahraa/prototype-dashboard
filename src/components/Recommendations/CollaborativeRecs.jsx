import React from 'react';
import { Users, BookOpen } from 'lucide-react';

/**
 * CollaborativeRecs Component
 * 
 * "Mahasiswa yang meminjam buku ini juga meminjam..."
 */

function BookCard({ book }) {
  return (
    <div className="flex-shrink-0 w-40 group cursor-pointer">
      {/* Cover */}
      <div 
        className="w-full h-52 rounded-lg shadow-md mb-3 flex items-center justify-center text-3xl transition-transform group-hover:scale-105"
        style={{ 
          background: `linear-gradient(135deg, #2d3748, #1a202c)`,
        }}
      >
        B
      </div>
      
      {/* Info */}
      <h4 className="font-semibold text-sm line-clamp-2 group-hover:underline mb-1">
        {book.title}
      </h4>
      <p className="text-xs text-text-secondary line-clamp-1 mb-2">
        {book.author}
      </p>
      
      {/* Similarity Badge */}
      {book.similarity && (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Users className="w-3 h-3" />
          <span>{book.similarity} orang juga meminjam</span>
        </div>
      )}
    </div>
  );
}

function CollaborativeRecs({ 
  recommendations, 
  books,
  selectedBookId,
  onSelectBook,
  loading = false,
  title = "Yang Meminjam Ini Juga Meminjam..."
}) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 animate-pulse">
              <div className="h-52 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-xs text-text-secondary">Rekomendasi berdasarkan kesamaan preferensi peminjam</p>
        </div>
      </div>

      {/* Book Selector */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary mb-2 block">Pilih buku referensi:</label>
        <select
          value={selectedBookId || ''}
          onChange={(e) => onSelectBook?.(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
        >
          {books?.slice(0, 20).map(book => (
            <option key={book.id} value={book.id}>{book.title}</option>
          ))}
        </select>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {recommendations.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Tidak ada rekomendasi untuk buku ini</p>
        </div>
      )}
    </div>
  );
}

export default CollaborativeRecs;
