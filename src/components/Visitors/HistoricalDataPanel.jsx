import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building2, GraduationCap, TrendingUp, ChevronDown, FileSpreadsheet, Users } from 'lucide-react';
import { exportToExcel as exportXlsx } from '../../utils/exportToExcel';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears, isWithinInterval, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * HistoricalDataPanel Component
 * 
 * Shows historical summaries with export functionality
 * - Period selector (Week/Month/Year)
 * - Room popularity, Faculty, Prodi distributions
 * - Export to Excel
 */

const ROOM_NAMES = {
    audiovisual: 'Audiovisual',
    referensi: 'Ruang Referensi',
    sirkulasi_l1: 'Ruangan Baca L1',
    sirkulasi_l2: 'Ruangan Baca L2',
    sirkulasi_l3: 'Ruangan Baca L3',
    karel: 'Ruang Karel',
    smartlab: 'SmartLab',
    bicorner: 'BI Corner',
};

// Generate period options
const generatePeriodOptions = () => {
    const options = {
        day: [],
        week: [],
        month: [],
        year: []
    };

    // Last 30 days
    for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i);
        const start = startOfDay(date);
        const end = endOfDay(date);
        options.day.push({
            label: format(date, 'EEEE, d MMMM yyyy', { locale: id }),
            start,
            end,
            key: format(date, 'yyyy-MM-dd')
        });
    }

    // Last 8 weeks
    for (let i = 0; i < 8; i++) {
        const date = subWeeks(new Date(), i);
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });
        options.week.push({
            label: `${format(start, 'd MMM', { locale: id })} - ${format(end, 'd MMM yyyy', { locale: id })}`,
            start,
            end,
            key: format(start, 'yyyy-ww')
        });
    }

    // Last 12 months
    for (let i = 0; i < 12; i++) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        options.month.push({
            label: format(date, 'MMMM yyyy', { locale: id }),
            start,
            end,
            key: format(date, 'yyyy-MM')
        });
    }

    // Last 3 years
    for (let i = 0; i < 3; i++) {
        const date = subYears(new Date(), i);
        const start = startOfYear(date);
        const end = endOfYear(date);
        options.year.push({
            label: format(date, 'yyyy'),
            start,
            end,
            key: format(date, 'yyyy')
        });
    }

    return options;
};

// Filter visitors by date range
const filterByDateRange = (visitors, start, end) => {
    return visitors.filter(v => {
        try {
            // Use visitTime (mapped from backend visit_time)
            const visitDate = parseISO(v.visitTime || v.entryTime || v.timestamp || v.created_at);
            return isWithinInterval(visitDate, { start, end });
        } catch {
            return false;
        }
    });
};

// Calculate distributions
const calculateDistributions = (visitors) => {
    const roomCounts = {};
    const facultyCounts = {};
    const prodiCounts = {};

    visitors.forEach(v => {
        // Room - database uses 'ruangan' field
        const room = v.ruangan || v.room;
        if (room && ROOM_NAMES[room]) {
            roomCounts[room] = (roomCounts[room] || 0) + 1;
        }
        // Faculty
        if (v.faculty) {
            facultyCounts[v.faculty] = (facultyCounts[v.faculty] || 0) + 1;
        }
        // Prodi
        const prodi = v.prodi || v.jurusan;
        if (prodi) {
            prodiCounts[prodi] = (prodiCounts[prodi] || 0) + 1;
        }
    });

    return {
        rooms: Object.entries(roomCounts)
            .map(([id, count]) => ({ id, name: ROOM_NAMES[id] || id, count }))
            .sort((a, b) => b.count - a.count),
        faculties: Object.entries(facultyCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        prodis: Object.entries(prodiCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
    };
};

// Export to CSV (Excel compatible)
const exportToExcel = (data, periodLabel, periodType) => {
    const { rooms, faculties, prodis, totalVisits } = data;

    let csv = '\ufeff'; // BOM for Excel UTF-8
    csv += `Laporan Kunjungan Perpustakaan\n`;
    csv += `Periode: ${periodLabel}\n`;
    csv += `Total Kunjungan: ${totalVisits}\n\n`;

    // Room distribution
    csv += `DISTRIBUSI PER RUANGAN\n`;
    csv += `No,Ruangan,Jumlah Kunjungan,Persentase\n`;
    rooms.forEach((r, i) => {
        const pct = totalVisits > 0 ? ((r.count / totalVisits) * 100).toFixed(1) : 0;
        csv += `${i + 1},"${r.name}",${r.count},${pct}%\n`;
    });

    csv += `\nDISTRIBUSI PER FAKULTAS\n`;
    csv += `No,Fakultas,Jumlah Kunjungan,Persentase\n`;
    faculties.forEach((f, i) => {
        const pct = totalVisits > 0 ? ((f.count / totalVisits) * 100).toFixed(1) : 0;
        csv += `${i + 1},"${f.name}",${f.count},${pct}%\n`;
    });

    csv += `\nDISTRIBUSI PER PROGRAM STUDI\n`;
    csv += `No,Program Studi,Jumlah Kunjungan,Persentase\n`;
    prodis.forEach((p, i) => {
        const pct = totalVisits > 0 ? ((p.count / totalVisits) * 100).toFixed(1) : 0;
        csv += `${i + 1},"${p.name}",${p.count},${pct}%\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_kunjungan_${periodType}_${periodLabel.replace(/\s/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

function HistoricalDataPanel({ visitors = [] }) {
    const [periodType, setPeriodType] = useState('day');
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('rooms');

    const periodOptions = useMemo(() => generatePeriodOptions(), []);

    const currentPeriod = periodOptions[periodType][selectedPeriodIndex];

    const filteredData = useMemo(() => {
        if (!currentPeriod || !visitors.length) return { rooms: [], faculties: [], prodis: [], totalVisits: 0 };

        const filtered = filterByDateRange(visitors, currentPeriod.start, currentPeriod.end);
        const distributions = calculateDistributions(filtered);

        return {
            ...distributions,
            totalVisits: filtered.length
        };
    }, [visitors, currentPeriod]);

    const handleExport = () => {
        if (currentPeriod) {
            exportToExcel(filteredData, currentPeriod.label, periodType);
        }
    };

    // Export ALL raw visitor data (not percentages)
    const handleExportAllData = () => {
        if (!visitors || visitors.length === 0) return;

        // Filter visitors by selected period
        const filtered = currentPeriod
            ? filterByDateRange(visitors, currentPeriod.start, currentPeriod.end)
            : visitors;

        if (filtered.length === 0) {
            alert('Tidak ada data pengunjung untuk periode ini.');
            return;
        }

        const ROOM_LABELS = {
            audiovisual: 'Audiovisual',
            referensi: 'Ruang Referensi',
            sirkulasi_l1: 'Ruangan Baca L1',
            sirkulasi_l2: 'Ruangan Baca L2',
            sirkulasi_l3: 'Ruangan Baca L3',
            karel: 'Ruang Karel',
            smartlab: 'SmartLab',
            bicorner: 'BI Corner',
        };

        const dataToExport = filtered.map((v, index) => ({
            'No': index + 1,
            'Nama': v.nama || '-',
            'NIM': v.nim || '-',
            'Program Studi': v.prodi || '-',
            'Fakultas': v.faculty || '-',
            'Gender': v.gender === 'L' ? 'Laki-laki' : v.gender === 'P' ? 'Perempuan' : '-',
            'Ruangan': ROOM_LABELS[v.ruangan] || v.ruangan || '-',
            'Waktu Kunjungan': v.visitTime
                ? format(parseISO(v.visitTime), 'dd/MM/yyyy HH:mm', { locale: id })
                : '-',
        }));

        const label = currentPeriod ? currentPeriod.label.replace(/\s/g, '_') : 'semua';
        exportXlsx(dataToExport, `Data_Pengunjung_${label}`, 'Data Pengunjung');
    };

    const tabs = [
        { id: 'rooms', label: 'Ruangan', icon: Building2 },
        { id: 'faculties', label: 'Fakultas', icon: GraduationCap },
        { id: 'prodis', label: 'Prodi', icon: TrendingUp },
    ];

    return (
        <div className="card">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Riwayat & Metadata
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Lihat dan export data historis
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportAllData}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
                        title="Export semua data mentah pengunjung"
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Export Semua Data</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                        title="Export ringkasan distribusi"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="text-sm font-medium">Export Ringkasan</span>
                    </button>
                </div>
            </div>

            {/* Period Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Period Type */}
                <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                    {['day', 'week', 'month', 'year'].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setPeriodType(type);
                                setSelectedPeriodIndex(0);
                            }}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${periodType === type
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-dark-600'
                                }`}
                        >
                            {type === 'day' ? 'Harian' : type === 'week' ? 'Mingguan' : type === 'month' ? 'Bulanan' : 'Tahunan'}
                        </button>
                    ))}
                </div>

                {/* Period Dropdown */}
                <div className="relative">
                    <select
                        value={selectedPeriodIndex}
                        onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
                        className="appearance-none bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[200px]"
                        style={{ colorScheme: 'dark' }}
                    >
                        {periodOptions[periodType].map((period, idx) => (
                            <option key={period.key} value={idx} className="bg-white dark:bg-dark-800 text-gray-900 dark:text-slate-200 py-1">
                                {period.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-300 pointer-events-none" />
                </div>

                {/* Total Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                    <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        {filteredData.totalVisits.toLocaleString('id-ID')} kunjungan
                    </span>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-gray-200 dark:border-dark-border mb-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Data Table */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-x-auto"
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-dark-border">
                                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">No</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                                    {activeTab === 'rooms' ? 'Ruangan' : activeTab === 'faculties' ? 'Fakultas' : 'Program Studi'}
                                </th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Kunjungan</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Persentase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'rooms' ? filteredData.rooms :
                                activeTab === 'faculties' ? filteredData.faculties :
                                    filteredData.prodis).map((item, index) => {
                                        const pct = filteredData.totalVisits > 0
                                            ? ((item.count / filteredData.totalVisits) * 100).toFixed(1)
                                            : 0;
                                        return (
                                            <tr
                                                key={item.name || item.id}
                                                className={`border-b border-gray-100 dark:border-dark-border-accent ${index === 0 ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                                    }`}
                                            >
                                                <td className="py-3 px-4 text-gray-500 dark:text-slate-400">{index + 1}</td>
                                                <td className="py-3 px-4 font-medium text-gray-900 dark:text-slate-100">
                                                    {item.name}
                                                </td>
                                                <td className="py-3 px-4 text-right text-gray-700 dark:text-slate-300">
                                                    {item.count.toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-2 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500 rounded-full"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-600 dark:text-slate-400 w-12 text-right">{pct}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            {(activeTab === 'rooms' ? filteredData.rooms :
                                activeTab === 'faculties' ? filteredData.faculties :
                                    filteredData.prodis).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-slate-500">
                                            Tidak ada data untuk periode ini
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default HistoricalDataPanel;
