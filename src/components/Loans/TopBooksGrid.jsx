import React from 'react';

/**
 * TopBooksGrid Component
 * 
 * Grid display top 10 buku terpopuler dengan cover image
 * Layout: 5 kolom, 2 baris
 */

function TopBooksGrid({ books, loading = false, title = "📚 Top 10 Buku Terpopuler" }) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <div 
            key={book.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            {/* Book Cover */}
            <div className="relative mb-3">
              {/* Rank Badge */}
              <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                #{index + 1}
              </div>
              
              {/* Cover Image */}
              <div 
                className="w-full h-48 rounded-lg shadow-md flex items-center justify-center text-4xl group-hover:shadow-xl transition-shadow"
                style={{ 
                  background: `linear-gradient(135deg, ${getBookColor(index)}, ${getBookColor(index)}dd)`,
                }}
              >
                📖
              </div>
            </div>

            {/* Book Info */}
            <h4 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:underline">
              {book.title}
            </h4>
            <p className="text-xs text-text-secondary mb-2 line-clamp-1">
              {book.author}
            </p>
            
            {/* Loan Count Badge */}
            <span className="inline-block px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
              {book.totalLoans}x dipinjam
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generate colors based on rank
function getBookColor(index) {
  const colors = [
    '#1a1a2e', '#16213e', '#0f3460', '#1a365d', '#2c5282',
    '#2d3748', '#1a202c', '#2b6cb0', '#3182ce', '#4a5568'
  ];
  return colors[index % colors.length];
}

export default TopBooksGrid;
