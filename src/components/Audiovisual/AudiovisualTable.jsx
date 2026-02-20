import React, { useState, useMemo, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { exportToExcel } from '../../utils/exportToExcel';
import { ExportButton } from '../Common';

/**
 * AudiovisualTable Component
 * 
 * Table untuk log kunjungan audiovisual dengan fitur:
 * - Sortable columns
 * - Search filter
 * - Export to Excel
 */

function AudiovisualTable({ visits = [], loading = false, title = "Log Kunjungan Audiovisual" }) {
    const [sortConfig, setSortConfig] = useState({ key: 'visitTime', direction: 'desc' });
    const [searchQuery, setSearchQuery] = useState('');
    const tableRef = useRef(null);

    // Sort handler
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Process and filter data
    const processedData = useMemo(() => {
        if (!visits || visits.length === 0) return [];

        let filtered = [...visits];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(v =>
                v.nama.toLowerCase().includes(query) ||
                v.nim.includes(query) ||
                v.faculty.toLowerCase().includes(query) ||
                (v.prodi && v.prodi.toLowerCase().includes(query))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Handle date comparison
            if (sortConfig.key === 'visitTime') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [visits, sortConfig, searchQuery]);

    // Export handler
    const handleExport = () => {
        const data = processedData.map(v => ({
            'Nama': v.nama,
            'NIM': v.nim,
            'Umur': v.umur || '-',
            'Fakultas': v.faculty,
            'Jurusan': v.prodi,
            'Waktu Kunjungan': format(parseISO(v.visitTime), 'dd/MM/yyyy HH:mm'),
            'Status': 'Keluar',
        }));
        exportToExcel(data, 'Kunjungan_Audiovisual', 'Audiovisual');
    };

    // Column header component
    const SortableHeader = ({ label, sortKey }) => (
        <th
            onClick={() => handleSort(sortKey)}
            className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700 select-none"
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
                        <div key={i} className="h-12 bg-gray-100 dark:bg-dark-700 rounded animate-pulse"></div>
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
                            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-dark-800 dark:text-slate-200"
                        />
                    </div>
                    <ExportButton
                        onExport={handleExport}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="table-container max-h-96 overflow-y-auto" ref={tableRef}>
                <table className="table">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-dark-800 z-10">
                        <tr>
                            <SortableHeader label="Nama" sortKey="nama" />
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">NIM</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300 w-16">Umur</th>
                            <SortableHeader label="Fakultas" sortKey="faculty" />
                            <SortableHeader label="Jurusan" sortKey="prodi" />
                            <SortableHeader label="Waktu" sortKey="visitTime" />
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-slate-400">
                                    {searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada data kunjungan'}
                                </td>
                            </tr>
                        ) : (
                            processedData.map((visit, index) => (
                                <tr
                                    key={visit.id}
                                    className="animate-fade-in hover:bg-gray-50 dark:hover:bg-dark-750"
                                    style={{ animationDelay: `${index * 20}ms` }}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">{visit.nama}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-mono text-xs">
                                        {visit.nim}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                                        {visit.umur || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                                        <span className="truncate block max-w-32" title={visit.faculty}>
                                            {visit.faculty.replace('Fakultas ', '')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                                        <span className="truncate block max-w-40" title={visit.prodi}>
                                            {visit.prodi}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                                        {format(parseISO(visit.visitTime), 'dd/MM/yyyy HH:mm')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
                <span>Menampilkan {processedData.length} dari {visits?.length || 0} kunjungan</span>
            </div>
        </div>
    );
}

export default AudiovisualTable;
