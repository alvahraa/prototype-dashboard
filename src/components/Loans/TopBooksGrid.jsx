import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { ViewToggle } from '../Common';
import { exportToExcel } from '../../utils/exportToExcel';

/**
 * TopBooksGrid Component
 * 
 * Dual view with contextual export button
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

  const handleExport = () => {
    const data = books.map((book, idx) => ({
      'Rank': idx + 1,
      'ID': book.id,
      'Judul': book.title,
      'Penulis': book.author,
      'Kategori': book.category || 'Umum',
      'Total Pinjam': book.totalLoans,
      'ISBN': book.isbn || '-',
    }));
    exportToExcel(data, 'Top_Books_Report', 'Top Books');
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-100 dark:bg-dark-700 rounded-xl mb-2"></div>
              <div className="h-4 bg-gray-100 dark:bg-dark-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-100 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="card-header mb-0">{title}</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Visual Grid View */}
      {viewMode === 'grid' && (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {books.map((book, index) => (
            <motion.div 
              key={book.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group cursor-pointer p-4 rounded-2xl bg-gray-50/50 dark:bg-dark-750 hover:bg-gray-100/80 dark:hover:bg-dark-700 transition-colors"
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-gray-900 dark:bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
                <div 
                  className="w-full aspect-[3/4] rounded-xl shadow-sm flex items-center justify-center text-3xl text-slate-100 font-bold group-hover:shadow-md transition-shadow"
                  style={{ background: `linear-gradient(135deg, ${getBookColor(index)}, ${getBookColor(index)}dd)` }}
                >
                  {book.title?.charAt(0) || 'B'}
                </div>
              </div>
              {/* Fixed height container for consistent alignment */}
              <div className="h-12 mb-2">
                <h4 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-slate-50">{book.title}</h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-300 mb-3 line-clamp-1">{book.author}</p>
              <span className="inline-block text-xs font-medium bg-gray-900 dark:bg-indigo-600 text-slate-100 px-2.5 py-1 rounded-full">
                {book.totalLoans}x pinjam
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
              <tr className="bg-gray-50 dark:bg-dark-700 text-left">
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">#</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">ID</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">Judul</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">Penulis</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">Kategori</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400 text-right">Pinjam</th>
                <th className="px-3 py-2 font-semibold text-gray-600 dark:text-slate-400">ISBN</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id} className="border-b border-gray-100 dark:border-dark-border-accent hover:bg-gray-50 dark:hover:bg-dark-750">
                  <td className="px-3 py-2 font-bold dark:text-slate-200">{index + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-500 dark:text-slate-500">{book.id}</td>
                  <td className="px-3 py-2 font-medium dark:text-slate-200">{book.title}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-slate-400">{book.author}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-slate-400 text-xs rounded">
                      {book.category || 'Umum'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold dark:text-slate-200">{book.totalLoans}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-400 dark:text-slate-500">{book.isbn || '-'}</td>
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
