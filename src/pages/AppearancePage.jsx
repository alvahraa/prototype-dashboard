import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { MotionPage } from '../components/Common';
import { fetchBackendApi } from '../services/api';

const AppearancePage = () => {
    const [settings, setSettings] = useState({
        app_logo_dashboard: null,
        admin_profile_pic: null,
        app_logo_absensi: null
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const loadSettings = async () => {
        setLoading(true);
        try {
            const keys = ['app_logo_dashboard', 'admin_profile_pic', 'app_logo_absensi'];
            const newSettings = { ...settings };

            for (const key of keys) {
                const { data } = await fetchBackendApi(`/settings/${key}`);
                if (data) {
                    newSettings[key] = data;
                }
            }
            setSettings(newSettings);
        } catch (error) {
            showNotification('Gagal memuat pengaturan', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Ukuran file maksimal 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setSettings(prev => ({ ...prev, [key]: base64String }));
            saveSetting(key, base64String);
        };
        reader.readAsDataURL(file);
    };

    const saveSetting = async (key, value) => {
        setSaving(true);
        try {
            const { error } = await fetchBackendApi(`/settings/${key}`, {
                method: 'PUT',
                body: JSON.stringify({ value })
            });

            if (error) throw new Error(error);
            showNotification('Berhasil disimpan', 'success');
        } catch (error) {
            showNotification(error.message || 'Gagal menyimpan', 'error');
        } finally {
            setSaving(false);
        }
    };

    const removeImage = (key) => {
        setSettings(prev => ({ ...prev, [key]: null }));
        saveSetting(key, '');
    };

    const ImageUploadCard = ({ title, description, storageKey, preview }) => (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl relative overflow-hidden group">
                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={preview}
                            alt={title}
                            className="max-h-32 object-contain rounded-lg shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg backdrop-blur-sm">
                            <label className="p-2 bg-indigo-500 text-white rounded-lg cursor-pointer hover:bg-indigo-600 transition-colors">
                                <Upload size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, storageKey)}
                                />
                            </label>
                            <button
                                onClick={() => removeImage(storageKey)}
                                className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ImageIcon size={32} />
                        </div>
                        <span className="text-sm font-medium">Klik untuk upload (Max 2MB)</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, storageKey)}
                        />
                    </label>
                )}
            </div>
        </div>
    );

    if (loading) return (
        <MotionPage>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full" />
            </div>
        </MotionPage>
    );

    return (
        <MotionPage>
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Pengaturan Tampilan</h1>
                        <p className="text-slate-500 text-sm">Sesuaikan logo instansi dan foto profil administrator</p>
                    </div>
                </div>

                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 \${
                            notification.type === 'success' 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="font-medium text-sm">{notification.message}</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ImageUploadCard
                        title="Logo Dashboard"
                        description="Muncul di pojok kiri atas aplikasi dashboard admin."
                        storageKey="app_logo_dashboard"
                        preview={settings.app_logo_dashboard}
                    />
                    <ImageUploadCard
                        title="Foto Profil Admin"
                        description="Mewakili identitas administrator di header dashboard."
                        storageKey="admin_profile_pic"
                        preview={settings.admin_profile_pic}
                    />
                    <ImageUploadCard
                        title="Logo Form Absensi"
                        description="Muncul di halaman form absensi pengunjung perpustakaan."
                        storageKey="app_logo_absensi"
                        preview={settings.app_logo_absensi}
                    />
                </div>

                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 flex gap-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg h-fit text-amber-600 dark:text-amber-400">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-1">Catatan Sistem</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
                            Gambar disimpan langsung di dalam database (Base64) untuk mengamankan data di sistem serverless (Vercel).
                            Jaga ukuran file tetap di bawah 2MB untuk memastikan performa yang optimal.
                        </p>
                    </div>
                </div>
            </div>
        </MotionPage>
    );
};

export default AppearancePage;
