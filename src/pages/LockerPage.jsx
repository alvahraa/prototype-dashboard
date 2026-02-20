import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    LayoutGrid,
    Table2,
    Lock,
    Unlock,
    Search,
    User,
    Clock,
    X,
    AlertCircle,
    Filter,
    KeyRound
} from 'lucide-react';

import {
    LoadingPage,
    ErrorMessage,
    RefreshButton,
    DateRangePicker,
    LastUpdated,
    Tabs,
    ExportButton,
    EmptyState,
    MotionPage
} from '../components/Common';

import KPICard from '../components/Dashboard/KPICard';
import { useDataFetch } from '../hooks/useDataFetch';
import * as visitorService from '../services/visitorService';
import { exportToExcel } from '../utils/exportToExcel';

const tabs = [
    { id: 'overview', label: 'Monitor Area', icon: LayoutGrid },
    { id: 'logs', label: 'Riwayat Peminjaman', icon: Table2 },
];

const LockerPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [returningLocker, setReturningLocker] = useState(false);

    // Default Date Range (Last 30 days, same as BICornerPage)
    const [dateRange, setDateRange] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
    });

    // Fetch Data based on Date Range
    const fetchData = useCallback(() => {
        const start = format(new Date(dateRange.startDate), 'yyyy-MM-dd 00:00:00');
        const end = format(new Date(dateRange.endDate), 'yyyy-MM-dd 23:59:59');
        return visitorService.getVisitors({
            startDate: start,
            endDate: end
        });
    }, [dateRange]);

    const {
        data: visits,
        loading,
        error,
        refetch
    } = useDataFetch(fetchData, [dateRange]);

    const handleRefresh = useCallback(() => {
        refetch();
        setLastUpdated(new Date());
    }, [refetch]);

    // Process Data for Grid (Latest visit per locker)
    const lockerVisits = useMemo(() => {
        if (!visits) return [];
        const usageMap = new Map();

        // Sort by time ascending to ensure we process chronologically
        const sortedVisits = [...visits].sort((a, b) => new Date(a.visitTime) - new Date(b.visitTime));

        sortedVisits.forEach(v => {
            if (v.locker_number && !v.locker_returned_at) {
                const num = parseInt(v.locker_number);
                if (!isNaN(num)) {
                    usageMap.set(num, v); // Overwrite with latest
                }
            }
        });
        return Array.from(usageMap.entries()).map(([num, data]) => ({ num, ...data }));
    }, [visits]);

    // Stats
    const totalLockers = 163;
    const usedLockers = lockerVisits.length;
    const availableLockers = Math.max(0, totalLockers - usedLockers);
    const utilizationRate = Math.round((usedLockers / totalLockers) * 100);

    // Filter lockers for grid display
    const filteredLockers = useMemo(() => {
        const allLockers = Array.from({ length: totalLockers }, (_, i) => i + 1);

        return allLockers.map(num => {
            const visit = lockerVisits.find(v => v.num === num);
            return {
                number: num,
                isUsed: !!visit,
                visit: visit || null
            };
        }).filter(l => {
            if (!searchTerm) return true;
            return l.number.toString().includes(searchTerm) ||
                (l.visit && l.visit.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (l.visit && l.visit.nim.includes(searchTerm));
        });
    }, [totalLockers, lockerVisits, searchTerm]);

    // Export Handler
    const handleExport = () => {
        if (!visits || visits.length === 0) return;

        const dataToExport = visits
            .filter(v => v.locker_number)
            .map(v => ({
                'Nomor Loker': v.locker_number,
                'Waktu': format(new Date(v.visitTime), 'yyyy-MM-dd HH:mm:ss'),
                'Nama': v.nama,
                'NIM': v.nim,
                'Prodi': v.prodi,
                'Fakultas': v.fakultas,
                'Keperluan': v.keperluan
            }));

        exportToExcel(dataToExport, 'Data_Loker');
    };

    // Admin Return Locker Handler
    const handleReturnLocker = async () => {
        if (!selectedLocker?.visit?.id) return;
        const confirmed = window.confirm(
            `Apakah Anda yakin ingin mengembalikan kunci Loker #${selectedLocker.number}?\n\nPeminjam: ${selectedLocker.visit.nama}`
        );
        if (!confirmed) return;

        setReturningLocker(true);
        try {
            const { error } = await visitorService.returnLocker(selectedLocker.visit.id);
            if (error) {
                alert(`Gagal: ${error}`);
            } else {
                setSelectedLocker(null);
                refetch(); // Refresh grid
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setReturningLocker(false);
        }
    };

    if (loading && !visits) return <LoadingPage message="Memuat data loker..." />;
    if (error && !visits) return <ErrorMessage message={error} onRetry={handleRefresh} variant="page" />;

    return (
        <MotionPage>
            <div className="space-y-6">
                {/* Header Control Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        <DateRangePicker value={dateRange} onChange={setDateRange} />
                        <LastUpdated timestamp={lastUpdated} />
                    </div>
                    <div className="flex items-center gap-2">
                        <RefreshButton onClick={handleRefresh} loading={loading} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <KPICard
                                    title="Loker Terpakai"
                                    value={usedLockers}
                                    icon={Lock}
                                    trend={`${utilizationRate}% Used`}
                                    trendUp={utilizationRate > 80}
                                    color="rose"
                                />
                                <KPICard
                                    title="Loker Tersedia"
                                    value={availableLockers}
                                    icon={Unlock}
                                    status="Available"
                                    color="emerald"
                                />
                                <div className="p-6 rounded-2xl border bg-white dark:bg-[#1e293b] border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-center">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Cari user di grid..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="p-6 rounded-2xl border bg-white dark:bg-[#1e293b] border-slate-100 dark:border-slate-700/50 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                    <LayoutGrid size={20} className="text-indigo-500" />
                                    Visualisasi Loker
                                </h3>

                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                                    {filteredLockers.map((locker) => (
                                        <motion.button
                                            key={locker.number}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={() => setSelectedLocker(locker)}
                                            className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-200 group
                                                ${locker.isUsed
                                                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400'
                                                }
                                                ${selectedLocker?.number === locker.number ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-white dark:ring-offset-[#0f172a]' : ''}
                                            `}
                                        >
                                            <span className="text-lg font-bold">{locker.number}</span>
                                            {locker.isUsed ? (
                                                <Lock size={14} className="mt-1" />
                                            ) : (
                                                <Unlock size={14} className="mt-1 opacity-50 group-hover:opacity-100" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="logs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-2xl border bg-white dark:bg-[#1e293b] border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                    <Table2 size={20} className="text-indigo-500" />
                                    Data Peminjaman ({visits?.filter(v => v.locker_number).length || 0})
                                </h3>
                                <div className="flex gap-2 items-center">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Cari Loker / Nama / NIM..."
                                            value={historySearchTerm}
                                            onChange={(e) => setHistorySearchTerm(e.target.value)}
                                            className="pl-9 pr-4 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                                        />
                                    </div>
                                    <ExportButton onClick={handleExport} />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">Waktu</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">Loker</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">Nama</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">NIM</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">Prodi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {visits && visits.filter(v => {
                                            if (!v.locker_number) return false;
                                            if (!historySearchTerm) return true;
                                            const term = historySearchTerm.toLowerCase();
                                            return (
                                                v.locker_number.toString().includes(term) ||
                                                (v.nama || '').toLowerCase().includes(term) ||
                                                (v.nim || '').toLowerCase().includes(term)
                                            );
                                        }).length > 0 ? (
                                            visits.filter(v => {
                                                if (!v.locker_number) return false;
                                                if (!historySearchTerm) return true;
                                                const term = historySearchTerm.toLowerCase();
                                                return (
                                                    v.locker_number.toString().includes(term) ||
                                                    (v.nama || '').toLowerCase().includes(term) ||
                                                    (v.nim || '').toLowerCase().includes(term)
                                                );
                                            }).map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                                        {format(new Date(log.visitTime), 'dd MMM yyyy, HH:mm', { locale: id })}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-sm ring-1 ring-indigo-500/10">
                                                            {log.locker_number}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">{log.nama}</td>
                                                    <td className="p-4 text-sm text-slate-500">{log.nim}</td>
                                                    <td className="p-4 text-sm text-slate-500">{log.prodi}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Search size={32} className="mb-2 opacity-50" />
                                                        <p>Tidak ada data ditemukan sesuai pencarian.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Detail Modal - Fullscreen Overlay */}
                <AnimatePresence>
                    {selectedLocker && selectedLocker.isUsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setSelectedLocker(null); }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md max-h-[90vh] overflow-y-auto p-5 rounded-2xl border shadow-2xl bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500 text-white text-sm">
                                            {selectedLocker.number}
                                        </span>
                                        Detail Peminjam
                                    </h4>
                                    <button
                                        onClick={() => setSelectedLocker(null)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    >
                                        <X size={18} className="text-slate-500" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Nama Peminjam</p>
                                                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                                    {selectedLocker.visit.nama}
                                                </p>
                                                <p className="text-xs text-slate-500">{selectedLocker.visit.nim}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Waktu Pinjam</p>
                                                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                                    {format(new Date(selectedLocker.visit.visitTime), 'HH:mm | d MMM yyyy', { locale: id })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Return Button */}
                                <button
                                    onClick={handleReturnLocker}
                                    disabled={returningLocker}
                                    className="w-full mt-3 px-4 py-2.5 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                >
                                    {returningLocker ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                    ) : (
                                        <KeyRound size={16} />
                                    )}
                                    {returningLocker ? 'Memproses...' : 'Kembalikan Kunci'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MotionPage>
    );
};

export default LockerPage;
