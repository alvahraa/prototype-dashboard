import React, { useState, useMemo, useEffect, useRef } from 'react';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { exportToExcel } from '../../utils/exportToExcel';
import { ExportButton } from '../Common';

/**
 * VisitorTable Component
 * 
 * Real-time visitor log table dengan fitur:
 * - Sortable columns
 * - Search filter
 * - Status chips
 * - Auto-update durasi untuk visitor yang masih inside
 * - Last 50 entries
 */

function VisitorTable({ visitors, loading = false, title = "Log Pengunjung Terbaru" }) {
  const [sortConfig, setSortConfig] = useState({ key: 'entryTime', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(new Date());
  const tableRef = useRef(null);

  // Update "now" every minute for duration calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate duration
  const getDuration = (entryTime, exitTime, status) => {
    const entry = parseISO(entryTime);
    const exit = status === 'inside' ? now : (exitTime ? parseISO(exitTime) : now);
    const minutes = differenceInMinutes(exit, entry);

    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  // Process and filter data
  const processedData = useMemo(() => {
    if (!visitors || visitors.length === 0) return [];

    let filtered = [...visitors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.nama.toLowerCase().includes(query) ||
        v.nim.includes(query) ||
        v.faculty.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle date comparison
      if (sortConfig.key === 'entryTime') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Take last 50
    return filtered.slice(0, 50);
  }, [visitors, sortConfig, searchQuery]);

  // Column header component
  const SortableHeader = ({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc'
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">{title}</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-header mb-0">{title}</h3>

        {/* Search + Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <ExportButton
            onExport={() => {
              const data = processedData.map(v => ({
                'Nama': v.nama,
                'NIM': v.nim,
                'Fakultas': v.faculty,
                'Jam Masuk': format(parseISO(v.entryTime), 'HH:mm'),
                'Status': v.status === 'inside' ? 'Di Dalam' : 'Keluar',
              }));
              exportToExcel(data, 'Visitor_Log', 'Visitors');
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="table-container max-h-96 overflow-y-auto" ref={tableRef}>
        <table className="table">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <SortableHeader label="Nama" sortKey="nama" />
              <th className="px-4 py-3 text-left font-semibold text-gray-700">NIM</th>
              <SortableHeader label="Fakultas" sortKey="faculty" />
              <SortableHeader label="Jam Masuk" sortKey="entryTime" />
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Durasi</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {processedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-text-secondary">
                  {searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada data pengunjung'}
                </td>
              </tr>
            ) : (
              processedData.map((visitor, index) => (
                <tr
                  key={visitor.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="px-4 py-3 font-medium">{visitor.nama}</td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                    {visitor.nim}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="truncate block max-w-32" title={visitor.faculty}>
                      {visitor.faculty.replace('Fakultas ', '')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(parseISO(visitor.entryTime), 'HH:mm')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {getDuration(visitor.entryTime, visitor.exitTime, visitor.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`chip ${visitor.status === 'inside' ? 'chip-success' : 'chip-neutral'
                      }`}>
                      {visitor.status === 'inside' ? 'Di Dalam' : 'Keluar'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm text-text-secondary">
        <span>Menampilkan {processedData.length} dari {visitors?.length || 0} pengunjung</span>
        <span>Update terakhir: {format(now, 'HH:mm:ss')}</span>
      </div>
    </div>
  );
}

export default VisitorTable;
