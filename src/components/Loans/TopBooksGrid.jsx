import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewToggle } from '../Common';

/**
 * TopBooksGrid Component
 * 
 * Dual view: Visual Grid (default) and Data Table (admin)
 */

// Animation for grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function TopBooksGrid({ books, loading = false, title = "Top 10 Buku Terpopuler" }) {
  const [viewMode, setViewMode] = useState('grid');

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-100 rounded-xl mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-1"></div>
              <div className="h-3 bg-gray-100 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="card-header mb-0">{title}</h3>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Visual Grid View */}
      {viewMode === 'grid' && (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {books.map((book, index) => (
            <motion.div 
              key={book.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div className="relative mb-3">
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
                <div 
                  className="w-full aspect-[3/4] rounded-xl shadow-sm flex items-center justify-center text-3xl text-white font-bold group-hover:shadow-md transition-shadow"
                  style={{ background: `linear-gradient(135deg, ${getBookColor(index)}, ${getBookColor(index)}dd)` }}
                >
                  {book.title?.charAt(0) || 'B'}
                </div>
              </div>
              <h4 className="font-medium text-sm line-clamp-2 mb-1">{book.title}</h4>
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{book.author}</p>
              <span className="text-xs font-medium bg-gray-900 text-white px-2.5 py-1 rounded-full">
                {book.totalLoans}x
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Data Table View (Admin) */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2 font-semibold text-gray-600">#</th>
                <th className="px-3 py-2 font-semibold text-gray-600">ID</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Judul</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Penulis</th>
                <th className="px-3 py-2 font-semibold text-gray-600">Kategori</th>
                <th className="px-3 py-2 font-semibold text-gray-600 text-right">Pinjam</th>
                <th className="px-3 py-2 font-semibold text-gray-600">ISBN</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-bold">{index + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-500">{book.id}</td>
                  <td className="px-3 py-2 font-medium">{book.title}</td>
                  <td className="px-3 py-2 text-gray-600">{book.author}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {book.category || 'Umum'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{book.totalLoans}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-400">{book.isbn || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getBookColor(index) {
  const colors = ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];
  return colors[index % colors.length];
}

export default TopBooksGrid;
