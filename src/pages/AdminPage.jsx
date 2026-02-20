import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Key, Save, RefreshCw,
    AlertCircle, CheckCircle, Eye, EyeOff, Loader2,
    Shield, Calendar
} from 'lucide-react';

/**
 * AdminPage - User Management Dashboard
 * 
 * Professional admin management interface
 */

const API_BASE = 'http://localhost:3001/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function AdminPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');

    // Create account form
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Change password form
    const [changeUsername, setChangeUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPasswordChange, setNewPasswordChange] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPasswordChange, setShowNewPasswordChange] = useState(false);

    // Feedback
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchAdmins = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/auth/admins`);
            const result = await response.json();
            if (result.success) {
                setAdmins(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPassword,
                    displayName: newDisplayName || newUsername
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Akun admin berhasil dibuat!' });
                setNewUsername('');
                setNewPassword('');
                setNewDisplayName('');
                fetchAdmins();
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal terhubung ke server' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/auth/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: changeUsername,
                    currentPassword,
                    newPassword: newPasswordChange
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Password berhasil diubah!' });
                setChangeUsername('');
                setCurrentPassword('');
                setNewPasswordChange('');
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal terhubung ke server' });
        } finally {
            setSubmitting(false);
        }
    };

    const tabs = [
        { id: 'list', label: 'Daftar Admin', icon: Users },
        { id: 'create', label: 'Buat Akun', icon: UserPlus },
        { id: 'password', label: 'Ganti Password', icon: Key },
    ];

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
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                            Manajemen Admin
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Kelola akun administrator dashboard
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.open('/?mode=public', '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Public View</span>
                    </button>
                    <button
                        onClick={fetchAdmins}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Refresh</span>
                    </button>
                </div>
            </motion.div>

            {/* Message */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl ${message.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <p className={`text-sm ${message.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                        }`}>
                        {message.text}
                    </p>
                </motion.div>
            )}

            {/* Tab Selector */}
            <motion.div variants={itemVariants} className="flex border-b border-gray-200 dark:border-dark-border">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </motion.div>

            {/* Tab Content */}
            <motion.div variants={itemVariants} className="card">
                {/* Admin List */}
                {activeTab === 'list' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Daftar Administrator
                        </h3>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                        ) : admins.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 dark:text-slate-500">
                                Belum ada admin terdaftar
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-dark-border">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Username</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Nama Tampilan</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Dibuat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map((admin) => (
                                            <tr key={admin.id} className="border-b border-gray-100 dark:border-dark-border-accent">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-slate-100">{admin.username}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-700 dark:text-slate-300">{admin.displayName}</td>
                                                <td className="py-3 px-4 text-gray-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID') : '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Account */}
                {activeTab === 'create' && (
                    <form onSubmit={handleCreateAccount} className="max-w-md space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Buat Akun Baru
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Masukkan username"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nama Tampilan</label>
                            <input
                                type="text"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                placeholder="Nama yang ditampilkan (opsional)"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            Buat Akun
                        </button>
                    </form>
                )}

                {/* Change Password */}
                {activeTab === 'password' && (
                    <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Ganti Password
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
                            <input
                                type="text"
                                value={changeUsername}
                                onChange={(e) => setChangeUsername(e.target.value)}
                                placeholder="Username yang akan diubah"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password Saat Ini</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Masukkan password lama"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password Baru</label>
                            <div className="relative">
                                <input
                                    type={showNewPasswordChange ? 'text' : 'password'}
                                    value={newPasswordChange}
                                    onChange={(e) => setNewPasswordChange(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPasswordChange(!showNewPasswordChange)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPasswordChange ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Simpan Password
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
}

export default AdminPage;
