import React from 'react';
import { BookOpen, Star } from 'lucide-react';

/**
 * ContentBasedRecs Component
 * 
 * "Rekomendasi untuk Anda" berdasarkan kategori favorit user
 */

function BookCard({ book }) {
  return (
    <div className="card group cursor-pointer hover:shadow-lg transition-all">
      {/* Cover */}
      <div
        className="w-full h-44 rounded-lg shadow mb-3 flex items-center justify-center text-3xl transition-transform group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, #0f3460, #1a365d)`,
        }}
      >
        B
      </div>

      {/* Category Tag */}
      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded mb-2">
        {book.category}
      </span>

      {/* Title */}
      <h4 className="font-semibold text-sm line-clamp-2 group-hover:underline mb-1">
        {book.title}
      </h4>

      {/* Author */}
      <p className="text-xs text-text-secondary line-clamp-1 mb-2">
        {book.author}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium">{book.rating}</span>
      </div>
    </div>
  );
}

function ContentBasedRecs({
  recommendations,
  visitors,
  selectedUserId,
  onSelectUser,
  loading = false,
  title = "Rekomendasi Untuk Anda"
}) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-44 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get unique visitors for dropdown
  const uniqueVisitors = visitors?.reduce((acc, v) => {
    if (!acc.find(u => u.nim === v.nim)) {
      acc.push(v);
    }
    return acc;
  }, []).slice(0, 10) || [];

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-xs text-text-secondary">Berdasarkan kategori favorit dan riwayat peminjaman</p>
        </div>
      </div>

      {/* User Selector */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary mb-2 block">Pilih pengguna:</label>
        <select
          value={selectedUserId || ''}
          onChange={(e) => onSelectUser?.(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
        >
          {uniqueVisitors.map(visitor => (
            <option key={visitor.nim} value={visitor.nim}>
              {visitor.nama} ({visitor.nim})
            </option>
          ))}
        </select>
      </div>

      {/* Recommendations Grid */}
      {recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Tidak ada rekomendasi untuk pengguna ini</p>
        </div>
      )}
    </div>
  );
}

export default ContentBasedRecs;
