/**
 * Settings Service
 * 
 * Service untuk mengambil dan mengupdate pengaturan perpustakaan (jam operasional, dll).
 */

import { fetchBackendApi } from './api';

/**
 * Get operating hours from backend
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getOperatingHours() {
    try {
        const { data: response, error } = await fetchBackendApi('/settings/operating-hours');
        if (error) return { data: null, error };
        return { data: response?.data || null, error: null };
    } catch (error) {
        console.error('Error fetching operating hours:', error);
        return { data: null, error: error.message };
    }
}

/**
 * Update operating hours
 * @param {Object} hours - { senin: { buka, tutup, aktif }, ... }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function updateOperatingHours(hours) {
    try {
        const { data: response, error } = await fetchBackendApi('/settings/operating-hours', {
            method: 'PUT',
            body: JSON.stringify(hours),
        });
        if (error) return { data: null, error };
        return { data: response?.data || null, error: null };
    } catch (error) {
        console.error('Error updating operating hours:', error);
        return { data: null, error: error.message };
    }
}
