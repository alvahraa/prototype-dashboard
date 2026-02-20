import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Medal, ChevronLeft } from 'lucide-react';

/**
 * LeaderboardPanel Component (Compact Floating Card)
 * 
 * - Small, unobtrusive floating card
 * - Glassmorphism style
 * - Does not push content
 * - Triggered by Sidebar Icon OR Floating Toggle
 */

const API_BASE = 'http://localhost:3001/api';

// Room display names
const ROOM_NAMES = {
    audiovisual: 'Audiovisual',
    referensi: 'Reference',
    sirkulasi_l1: 'Circulation L1',
    sirkulasi_l2: 'Circulation L2',
    sirkulasi_l3: 'Circulation L3',
    karel: 'Karel Room',
    smartlab: 'SmartLab',
    bicorner: 'BI Corner',
};

function LeaderboardPanel({ isExpanded, onToggle }) {
    const [roomStats, setRoomStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch room stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE}/visits`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                const roomCounts = {};
                data.forEach(visit => {
                    const room = visit.room;
                    if (room && ROOM_NAMES[room]) {
                        roomCounts[room] = (roomCounts[room] || 0) + 1;
                    }
                });

                const sorted = Object.entries(roomCounts)
                    .map(([room, count]) => ({
                        id: room,
                        name: ROOM_NAMES[room],
                        count,
                    }))
                    .sort((a, b) => b.count - a.count);

                setRoomStats(sorted);
            } catch (error) {
                console.error('Error fetching room stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    // Only show top 5 for compact view
    const displayedStats = useMemo(() => roomStats.slice(0, 5), [roomStats]);

    return (
        <>
            {/* Minimal Floating Toggle (Visible when collapsed) */}
            <AnimatePresence>
                {!isExpanded && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onToggle}
                        className="fixed right-6 bottom-6 z-40 w-12 h-12 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md shadow-lg border border-white/20 rounded-full flex items-center justify-center text-amber-500 hover:text-amber-600 transition-colors"
                        title="Show Leaderboard"
                    >
                        <Trophy className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Compact Floating Card */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-6 bottom-24 w-72 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-dark-700 rounded-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Top Rooms</h3>
                            </div>
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                            </button>
                        </div>

                        {/* content */}
                        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full" />
                                </div>
                            ) : (
                                displayedStats.length > 0 ? (
                                    displayedStats.map((room, index) => (
                                        <div
                                            key={room.id}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                                        >
                                            {/* Rank */}
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                                index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                                                    index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400' :
                                                        'bg-gray-50 dark:bg-dark-700 text-gray-400'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-slate-200 truncate pr-2">
                                                        {room.name}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100">
                                                        {room.count}
                                                    </span>
                                                </div>
                                                {/* Mini Bar */}
                                                <div className="h-1 bg-gray-100 dark:bg-dark-700 rounded-full mt-1 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(room.count / roomStats[0].count) * 100}%` }}
                                                        className={`h-full rounded-full ${index === 0 ? 'bg-amber-500' :
                                                            index === 1 ? 'bg-gray-400' :
                                                                index === 2 ? 'bg-orange-500' :
                                                                    'bg-indigo-400/50'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-xs text-gray-400">
                                        Belum ada data
                                    </div>
                                )
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-2 bg-gray-50/80 dark:bg-dark-750/50 border-t border-gray-100 dark:border-dark-700 flex justify-center">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Medal className="w-3 h-3" />
                                Top 5 Zones
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default LeaderboardPanel;
