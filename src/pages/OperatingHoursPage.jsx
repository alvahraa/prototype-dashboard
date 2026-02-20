import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Save, Check, RotateCcw, Sun, Moon, AlertCircle } from 'lucide-react';
import { getOperatingHours, updateOperatingHours } from '../services/settingsService';

/**
 * OperatingHoursPage - Halaman Khusus Pengaturan Jam Operasional
 * 
 * Feature:
 * - Lihat & edit jam buka/tutup per hari
 * - Toggle aktif/non-aktif per hari
 * - Simpan ke database
 * - Preview status hari ini
 */

const DAY_ORDER = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

const DAY_LABELS = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
    sabtu: 'Sabtu',
    minggu: 'Minggu',
};

const DAY_ICONS = {
    senin: '🟢',
    selasa: '🟢',
    rabu: '🟢',
    kamis: '🟢',
    jumat: '🟢',
    sabtu: '🟡',
    minggu: '🔴',
};

function getTodayKey() {
    const dayMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return dayMap[new Date().getDay()];
}

const DEFAULT_HOURS = {
    senin: { buka: '08:00', tutup: '17:00', aktif: true },
    selasa: { buka: '08:00', tutup: '17:00', aktif: true },
    rabu: { buka: '08:00', tutup: '17:00', aktif: true },
    kamis: { buka: '08:00', tutup: '17:00', aktif: true },
    jumat: { buka: '08:00', tutup: '17:00', aktif: true },
    sabtu: { buka: '08:00', tutup: '12:00', aktif: true },
    minggu: { buka: '00:00', tutup: '00:00', aktif: false },
};

function OperatingHoursPage() {
    const [hours, setHours] = useState(null);
    const [editHours, setEditHours] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const todayKey = getTodayKey();

    // Fetch operating hours
    const fetchHours = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getOperatingHours();
        if (fetchError) {
            setError(fetchError);
            setEditHours(DEFAULT_HOURS);
        } else if (data) {
            setHours(data);
            setEditHours(data);
        } else {
            setEditHours(DEFAULT_HOURS);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchHours();
    }, [fetchHours]);

    // Detect changes
    useEffect(() => {
        if (hours && editHours) {
            setHasChanges(JSON.stringify(hours) !== JSON.stringify(editHours));
        }
    }, [hours, editHours]);

    const handleChange = (day, field, value) => {
        setEditHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
        setSaved(false);
    };

    const handleToggle = (day) => {
        setEditHours(prev => ({
            ...prev,
            [day]: { ...prev[day], aktif: !prev[day].aktif }
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        const { error: saveError } = await updateOperatingHours(editHours);
        setSaving(false);
        if (saveError) {
            setError(saveError);
        } else {
            setSaved(true);
            setHours(editHours);
            setHasChanges(false);
            // Notify other components (sidebar) to value refresh
            window.dispatchEvent(new Event('operating-hours-changed'));
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleReset = () => {
        if (hours) {
            setEditHours(hours);
            setSaved(false);
        }
    };

    const handleResetToDefault = () => {
        setEditHours(DEFAULT_HOURS);
        setSaved(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-slate-400">Memuat pengaturan...</p>
                </div>
            </div>
        );
    }

    const todayHours = editHours?.[todayKey];

    // Check if open right now
    const checkIsOpen = (schedule) => {
        if (!schedule || !schedule.aktif) return false;
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return currentTime >= schedule.buka && currentTime < schedule.tutup;
    };

    const isOpenToday = checkIsOpen(todayHours);

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                        <Clock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                            Jam Operasional
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Atur jam buka & tutup perpustakaan untuk setiap hari
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-xl transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Batal
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || saved || !hasChanges}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${saved
                            ? 'bg-emerald-500 text-white'
                            : hasChanges
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {saved ? (
                            <>
                                <Check className="w-4 h-4" />
                                Tersimpan!
                            </>
                        ) : saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 rounded-xl"
                    >
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Today's Status Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 border shadow-sm ${isOpenToday
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30'
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isOpenToday
                            ? 'bg-emerald-100 dark:bg-emerald-800/30'
                            : 'bg-rose-100 dark:bg-rose-800/30'
                            }`}>
                            {isOpenToday
                                ? <Sun className={`w-7 h-7 text-emerald-600 dark:text-emerald-400`} />
                                : <Moon className={`w-7 h-7 text-rose-600 dark:text-rose-400`} />
                            }
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                Status Hari Ini — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <p className={`text-2xl font-bold ${isOpenToday
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : 'text-rose-700 dark:text-rose-300'
                                }`}>
                                {isOpenToday ? 'BUKA' : 'TUTUP'}
                            </p>
                        </div>
                    </div>
                    {isOpenToday && todayHours && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-slate-400">Jam Buka</p>
                            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                {todayHours.buka} — {todayHours.tutup}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Schedule Editor */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-border-accent shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-dark-750 border-b border-gray-100 dark:border-dark-border-accent">
                    <div className="col-span-1 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                    </div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Hari
                    </div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Jam Buka
                    </div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Jam Tutup
                    </div>
                    <div className="col-span-2 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">
                        Durasi
                    </div>
                </div>

                {/* Day Rows */}
                {editHours && DAY_ORDER.map((day, index) => {
                    const dayData = editHours[day];
                    const isToday = day === todayKey;
                    const active = dayData?.aktif;

                    // Calculate duration
                    let duration = '—';
                    if (active && dayData.buka && dayData.tutup) {
                        const [bh, bm] = dayData.buka.split(':').map(Number);
                        const [th, tm] = dayData.tutup.split(':').map(Number);
                        const mins = (th * 60 + tm) - (bh * 60 + bm);
                        if (mins > 0) {
                            const h = Math.floor(mins / 60);
                            const m = mins % 60;
                            duration = `${h} jam${m > 0 ? ` ${m} mnt` : ''}`;
                        }
                    }

                    return (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 dark:border-dark-border-accent last:border-b-0 transition-all ${isToday
                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                : !active
                                    ? 'bg-gray-50/50 dark:bg-dark-750/30 opacity-60'
                                    : 'hover:bg-gray-50/50 dark:hover:bg-dark-750/30'
                                }`}
                        >
                            {/* Toggle */}
                            <div className="col-span-1">
                                <button
                                    onClick={() => handleToggle(day)}
                                    className={`w-12 h-7 rounded-full transition-all duration-300 relative flex items-center shadow-inner ${active ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-dark-600 justify-start'
                                        }`}
                                >
                                    <motion.div
                                        layout
                                        className="w-5 h-5 bg-white rounded-full shadow-md mx-1 flex items-center justify-center p-0.5"
                                    >
                                        {active ? (
                                            <Check className="w-3 h-3 text-blue-500" strokeWidth={3} />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                                        )}
                                    </motion.div>
                                </button>
                            </div>

                            {/* Day Label */}
                            <div className="col-span-3 flex items-center gap-3">
                                {isToday && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                                <span className={`text-sm font-semibold ${isToday
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-gray-800 dark:text-slate-200'
                                    }`}>
                                    {DAY_LABELS[day]}
                                </span>
                                {isToday && (
                                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                        HARI INI
                                    </span>
                                )}
                            </div>

                            {/* Open Time */}
                            <div className="col-span-3">
                                {active ? (
                                    <input
                                        type="time"
                                        value={dayData.buka}
                                        onChange={(e) => handleChange(day, 'buka', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-dark-border-accent bg-white dark:bg-dark-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-slate-500 italic">—</span>
                                )}
                            </div>

                            {/* Close Time */}
                            <div className="col-span-3">
                                {active ? (
                                    <input
                                        type="time"
                                        value={dayData.tutup}
                                        onChange={(e) => handleChange(day, 'tutup', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-dark-border-accent bg-white dark:bg-dark-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-slate-500 italic">—</span>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="col-span-2 text-right">
                                <span className={`text-sm font-medium ${active
                                    ? 'text-gray-700 dark:text-slate-300'
                                    : 'text-gray-400 dark:text-slate-500'
                                    }`}>
                                    {active ? duration : 'Tutup'}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleResetToDefault}
                    className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors underline underline-offset-2"
                >
                    Reset ke Default
                </button>

                <p className="text-xs text-gray-400 dark:text-slate-500">
                    Perubahan akan langsung diterapkan setelah disimpan
                </p>
            </div>

        </div>
    );
}

export default OperatingHoursPage;
