import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp, X, Flame } from 'lucide-react';

/**
 * FloatingLeaderboard Component
 * 
 * Compact floating widget showing room popularity rankings
 * - Minimizable/expandable
 * - Fixed position on screen
 * - Animated transitions
 */

const API_BASE = 'http://localhost:3001/api';

// Room display names
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

// Medal colors for top 3
const MEDAL_COLORS = {
    1: 'from-yellow-400 to-amber-500',
    2: 'from-gray-300 to-slate-400',
    3: 'from-orange-400 to-amber-600',
};

function FloatingLeaderboard() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [roomStats, setRoomStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch room stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE}/visits`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                // Count visits per room
                const roomCounts = {};
                data.forEach(visit => {
                    const room = visit.room;
                    if (room && ROOM_NAMES[room]) {
                        roomCounts[room] = (roomCounts[room] || 0) + 1;
                    }
                });

                // Convert to array and sort
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
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    // Top room info
    const topRoom = useMemo(() => roomStats[0], [roomStats]);

    if (!isVisible) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed top-1/2 -translate-y-1/2 right-0 z-50 w-10 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-l-xl shadow-lg flex items-center justify-center text-white hover:w-12 transition-all"
                onClick={() => setIsVisible(true)}
            >
                <Trophy className="w-5 h-5" />
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-1/2 -translate-y-1/2 right-0 z-50 w-56"
        >
            <div className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-md rounded-l-2xl shadow-2xl border border-r-0 border-gray-200/50 dark:border-dark-border-accent overflow-hidden">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2 text-white">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-semibold">Room Leaderboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            className="text-white/80 hover:text-white transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-white/80" />
                        ) : (
                            <ChevronUp className="w-4 h-4 text-white/80" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {loading ? (
                                <div className="p-4 text-center text-gray-400 dark:text-slate-500">
                                    <div className="animate-pulse">Memuat...</div>
                                </div>
                            ) : roomStats.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 dark:text-slate-500 text-sm">
                                    Belum ada data
                                </div>
                            ) : (
                                <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                                    {roomStats.map((room, index) => (
                                        <motion.div
                                            key={room.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex items-center gap-3 p-2 rounded-lg ${index === 0
                                                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                                                }`}
                                        >
                                            {/* Rank Badge */}
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index < 3
                                                    ? `bg-gradient-to-br ${MEDAL_COLORS[index + 1]} text-white shadow-sm`
                                                    : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-slate-400'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>

                                            {/* Room Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm truncate ${index === 0
                                                    ? 'font-semibold text-gray-900 dark:text-slate-100'
                                                    : 'text-gray-700 dark:text-slate-300'
                                                    }`}>
                                                    {room.name}
                                                </p>
                                            </div>

                                            {/* Count */}
                                            <div className="flex items-center gap-1">
                                                {index === 0 && <Flame className="w-3 h-3 text-orange-500" />}
                                                <span className={`text-sm font-medium ${index === 0
                                                    ? 'text-amber-600 dark:text-amber-400'
                                                    : 'text-gray-500 dark:text-slate-400'
                                                    }`}>
                                                    {room.count.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            {topRoom && (
                                <div className="px-4 py-2 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-750">
                                    <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
                                        🏆 <span className="text-gray-600 dark:text-slate-400">{topRoom.name}</span> paling populer!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default FloatingLeaderboard;
