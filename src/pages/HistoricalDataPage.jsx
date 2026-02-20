import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { HistoricalDataPanel } from '../components/Visitors';
import { LoadingPage, ErrorMessage } from '../components/Common';
import { useVisitors } from '../hooks';

/**
 * Historical Data Page
 * 
 * Dedicated page for viewing and exporting historical visit data
 * - Accessible from Kunjungan page
 * - Professional separation of concerns
 */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function HistoricalDataPage({ onBack }) {
    // Fetch all visitors data (no date filter for historical view)
    const [dateRange] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 3); // Last 3 years
        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };
    });

    const { data: visitors, loading, error, refetch } = useVisitors(dateRange);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    if (loading && !visitors) {
        return <LoadingPage message="Memuat data historis..." />;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 lg:p-8 space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                            Riwayat & Metadata
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Data historis kunjungan perpustakaan
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Refresh</span>
                </button>
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div variants={itemVariants}>
                    <ErrorMessage
                        message={error}
                        onRetry={handleRefresh}
                        variant="card"
                    />
                </motion.div>
            )}

            {/* Main Content */}
            <motion.div variants={itemVariants}>
                <HistoricalDataPanel visitors={visitors || []} />
            </motion.div>

            {/* Info Card */}
            <motion.div variants={itemVariants} className="card bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                            Tentang Data Historis
                        </h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            Data yang ditampilkan mencakup riwayat kunjungan hingga 3 tahun terakhir.
                            Gunakan filter periode untuk melihat data harian, mingguan, bulanan, atau tahunan.
                            File export dalam format CSV yang dapat dibuka di Microsoft Excel.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default HistoricalDataPage;
