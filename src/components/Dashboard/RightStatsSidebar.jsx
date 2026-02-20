import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Activity, Calendar, Clock, Settings } from 'lucide-react';
import { getOperatingHours } from '../../services/settingsService';

/**
 * RightStatsSidebar Component
 * 
 * Static Right Column Widget
 * - Operating hours card (fetched from API, links to settings page)
 * - Top Rooms leaderboard
 * - Date card
 */

import { config } from '../../services/api';

const API_BASE = config.backendApi.baseUrl;

const ROOM_NAMES = {
    audiovisual: 'Audiovisual',
    referensi: 'Referensi',
    sirkulasi_l1: 'Baca L1',
    sirkulasi_l2: 'Baca L2',
    sirkulasi_l3: 'Baca L3',
    karel: 'Karel',
    smartlab: 'SmartLab',
    bicorner: 'BI Corner',
};

const DAY_LABELS = {
    senin: 'Sen', selasa: 'Sel', rabu: 'Rab', kamis: 'Kam',
    jumat: 'Jum', sabtu: 'Sab', minggu: 'Min',
};

const DAY_ORDER = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

function getTodayKey() {
    const dayMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return dayMap[new Date().getDay()];
}

function RightStatsSidebar() {
    const [roomStats, setRoomStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [operatingHours, setOperatingHours] = useState(null);

    // Fetch operating hours
    useEffect(() => {
        const fetchHours = async () => {
            const { data } = await getOperatingHours();
            if (data) setOperatingHours(data);
        };
        fetchHours();
    }, []);

    // Fetch room stats using server-side aggregation (not raw data)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE}/visits/stats?days=30`);
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();

                const byRoom = result.data?.byRoom || [];
                const sorted = byRoom.map(item => ({
                    id: item.ruangan,
                    name: ROOM_NAMES[item.ruangan] || item.ruangan,
                    count: item.count,
                }));

                setRoomStats(sorted);
            } catch (error) {
                console.error('Error fetching room stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const topRooms = useMemo(() => roomStats.slice(0, 5), [roomStats]);

    const todayKey = getTodayKey();
    const todayHours = operatingHours?.[todayKey];
    // Check if currently open based on time
    const checkIsOpen = (schedule) => {
        if (!schedule || !schedule.aktif) return false;
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return currentTime >= schedule.buka && currentTime < schedule.tutup;
    };

    const isOpen = checkIsOpen(todayHours);

    // Navigate to operating hours settings page
    const goToSettings = () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'operating-hours' }));
    };

    // Listen for updates from settings page
    useEffect(() => {
        const handleUpdate = () => {
            const fetchHours = async () => {
                const { data } = await getOperatingHours();
                if (data) setOperatingHours(data);
            };
            fetchHours();
        };

        window.addEventListener('operating-hours-changed', handleUpdate);
        return () => window.removeEventListener('operating-hours-changed', handleUpdate);
    }, []);

    return (
        <div className="w-full space-y-6">

            {/* 1. Operating Hours Card */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">Jam Operasional</h3>
                            <p className="text-xs text-gray-400">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={goToSettings}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors group"
                        title="Atur Jam Operasional"
                    >
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </button>
                </div>

                {/* Today's hours */}
                <div className={`flex items-center justify-between p-3 rounded-xl ${isOpen
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : 'bg-rose-50 dark:bg-rose-900/20'
                    }`}>
                    <span className={`text-xs font-semibold ${isOpen
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                        }`}>
                        {isOpen ? 'Buka' : 'Tutup'}
                    </span>
                    <span className={`text-sm font-bold ${isOpen
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-rose-800 dark:text-rose-200'
                        }`}>
                        {isOpen ? `${todayHours.buka} - ${todayHours.tutup}` : '—'}
                    </span>
                </div>

                {/* Mini schedule preview */}
                <div className="mt-3 grid grid-cols-7 gap-1">
                    {DAY_ORDER.map(day => {
                        const isToday = day === todayKey;
                        const dayData = operatingHours?.[day];
                        const active = dayData?.aktif;
                        return (
                            <div
                                key={day}
                                className={`text-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${isToday
                                    ? 'bg-blue-500 text-white ring-2 ring-blue-500/30'
                                    : active
                                        ? 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-slate-300'
                                        : 'bg-gray-50 dark:bg-dark-750 text-gray-300 dark:text-slate-600 line-through'
                                    }`}
                                title={active ? `${dayData.buka} - ${dayData.tutup}` : 'Tutup'}
                            >
                                {DAY_LABELS[day]}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Top Rooms Leaderboard */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        Top Rooms
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Live</span>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin w-5 h-5 border-2 border-gray-200 border-t-amber-500 rounded-full" />
                        </div>
                    ) : (
                        topRooms.map((room, index) => {
                            const getBadgeStyle = (idx) => {
                                switch (idx) {
                                    case 0: return 'bg-yellow-500 text-white ring-2 ring-yellow-500/30';
                                    case 1: return 'bg-slate-400 text-white';
                                    case 2: return 'bg-orange-500 text-white';
                                    default: return 'text-gray-400 bg-transparent';
                                }
                            };

                            const getBarStyle = (idx) => {
                                switch (idx) {
                                    case 0: return 'bg-yellow-500';
                                    case 1: return 'bg-slate-400';
                                    case 2: return 'bg-orange-500';
                                    default: return 'bg-indigo-500/30';
                                }
                            };

                            return (
                                <div key={room.id}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors ${getBadgeStyle(index)}`}>
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-gray-600 dark:text-slate-300">
                                                {room.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">{room.count}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(room.count / (roomStats[0]?.count || 1)) * 100}%` }}
                                            className={`h-full rounded-full ${getBarStyle(index)}`}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 3. Date / Calendar Snippet */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-indigo-100 text-xs font-medium mb-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                    </p>
                    <h3 className="text-2xl font-bold">
                        {new Date().getDate()} <span className="text-lg font-normal">{new Date().toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-indigo-100 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                        <Activity className="w-3 h-3" />
                        <span>Server Normal</span>
                    </div>
                </div>
                <Calendar className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
            </div>

        </div>
    );
}

export default RightStatsSidebar;
