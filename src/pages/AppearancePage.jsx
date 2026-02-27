import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, User, Info } from 'lucide-react';
import { MotionPage } from '../components/Common';
import { fetchBackendApi } from '../services/api';
import logoWhite from '../assets/logo-unisula.jpeg';

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
                if (data && data.length > 50) {
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

    const ImageUploadCard = ({ title, description, storageKey, customValue, defaultPreview }) => {
        const hasCustom = !!customValue;
        const displayPreview = customValue || defaultPreview;
        const isNode = typeof displayPreview !== 'string';

        return (
            <div className="bg-white dark:bg-transparent rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                        {hasCustom && <span className="flex w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-50 dark:ring-indigo-900/30" title="Kustom Aktif" />}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-5 pb-5 relative group">
                    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50 transition-all duration-300 border border-slate-100 dark:border-slate-800/60 group-hover:bg-slate-100/50 dark:group-hover:bg-slate-800/80">
                        {isNode ? (
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                {displayPreview}
                            </div>
                        ) : (
                            <img
                                src={displayPreview}
                                alt={title}
                                className={`max-h-[85%] max-w-[85%] object-contain ${hasCustom ? 'rounded-lg drop-shadow-sm' : 'opacity-60 grayscale-[40%]'}`}
                            />
                        )}

                        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px] rounded-xl dark:bg-slate-900/40">
                            <label className="px-5 py-2 bg-white text-slate-900 rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm border border-slate-200 font-medium text-sm flex items-center gap-2">
                                <Upload size={16} />
                                {hasCustom ? 'Ubah' : 'Upload'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, storageKey)}
                                />
                            </label>
                            {hasCustom && (
                                <button
                                    onClick={() => removeImage(storageKey)}
                                    className="px-5 py-2 bg-transparent text-rose-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 transition-colors font-medium text-sm"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <MotionPage>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full" />
            </div>
        </MotionPage>
    );

    return (
        <MotionPage>
            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-6 lg:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Pengaturan Tampilan</h1>
                        <p className="text-slate-500 text-sm max-w-xl">Sesuaikan logo instansi, branding dashboard, dan foto profil administrator. Gambar disimpan dalam basis data dengan batas ukuran 2MB.</p>
                    </div>
                    <div className="hidden lg:flex w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl items-center justify-center text-indigo-500">
                        <ImageIcon size={28} />
                    </div>
                </div>

                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl flex items-center justify-center gap-3 \${
                            notification.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' 
                                : 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="font-medium text-sm">{notification.message}</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ImageUploadCard
                        title="Logo Aplikasi Dashboard"
                        description="Ditampilkan pada sidebar di antarmuka administrator."
                        storageKey="app_logo_dashboard"
                        customValue={settings.app_logo_dashboard}
                        defaultPreview={logoWhite}
                    />
                    <ImageUploadCard
                        title="Foto Profil Admin"
                        description="Mewakili identitas Anda pada bagian kanan atas header."
                        storageKey="admin_profile_pic"
                        customValue={settings.admin_profile_pic}
                        defaultPreview={<User size={40} className="text-slate-400" />}
                    />
                    <ImageUploadCard
                        title="Logo Portal Absensi"
                        description="Ditampilkan secara publik pada halaman depan form absensi."
                        storageKey="app_logo_absensi"
                        customValue={settings.app_logo_absensi}
                        defaultPreview="/absensi/logo-unisula.jpeg"
                    />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 flex gap-4 items-start">
                    <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm mb-1">Status Pengaturan Gambar</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Aplikasi menggunakan gambar bawaan sistem (default) jika Anda belum mengunggah gambar kustom. Kotak dialog unggah akan selalu merepresentasikan gambar yang sedang aktif digunakan saat ini. Titik indikator biru ( <span className="inline-block w-2 h-2 bg-indigo-500 ring-2 ring-indigo-50 dark:ring-indigo-900/30 align-middle rounded-full mx-1"></span> ) menandakan gambar kustom dari pengguna sedang aktif.
                        </p>
                    </div>
                </div>
            </div>
        </MotionPage>
    );
};

export default AppearancePage;
