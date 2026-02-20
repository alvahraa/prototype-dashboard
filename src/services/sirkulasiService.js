/**
 * Sirkulasi Service
 * 
 * Service untuk data kunjungan ruang sirkulasi dari database.
 */

import { fetchBackendApi } from './api';

/**
 * Get all sirkulasi visits from database
 * @param {Object} options - { startDate, endDate, lantai }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getSirkulasiVisits(options = {}) {
    const params = new URLSearchParams();

    // Support lantai filter
    if (options.lantai === 1) {
        params.append('ruangan', 'sirkulasi_l1');
    } else if (options.lantai === 2) {
        params.append('ruangan', 'sirkulasi_l2');
    } else if (options.lantai === 3) {
        params.append('ruangan', 'sirkulasi_l3');
    }
    // If no lantai specified, we'll handle all in stats

    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    params.append('limit', '5000');

    try {
        const { data: response, error } = await fetchBackendApi(`/visits?${params.toString()}`);

        if (error) {
            return { data: [], error };
        }

        let visits = (response?.data || []).map(v => ({
            id: v.id,
            nama: v.nama,
            nim: v.nim,
            faculty: v.faculty,
            prodi: v.prodi,
            gender: v.gender,
            umur: v.umur,
            ruangan: v.ruangan,
            visitTime: v.visit_time,
            entryTime: v.visit_time, // Added for frontend compatibility
            status: 'exited'
        }));

        // If no specific lantai, filter for all sirkulasi rooms
        if (!options.lantai) {
            visits = visits.filter(v => v.ruangan === 'sirkulasi_l1' || v.ruangan === 'sirkulasi_l2' || v.ruangan === 'sirkulasi_l3');
        }

        return { data: visits, error: null };
    } catch (e) {
        return { data: [], error: e.message };
    }
}

/**
 * Get today's sirkulasi visits
 * @param {number} lantai - 1 or 2
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getTodaySirkulasiVisits(lantai) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return getSirkulasiVisits({
        lantai,
        startDate: today.toISOString(),
        endDate: new Date().toISOString(),
    });
}

/**
 * Get sirkulasi visit statistics
 * @param {Object} options - { startDate, endDate, lantai }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getSirkulasiStats(options = {}) {
    const { data: visits, error } = await getSirkulasiVisits(options);

    if (error) return { data: null, error };
    if (visits.length === 0) {
        return { data: { total: 0, genderDistribution: [], facultyDistribution: [] }, error: null };
    }

    const genderCount = visits.reduce((acc, v) => {
        acc[v.gender] = (acc[v.gender] || 0) + 1;
        return acc;
    }, {});

    const facultyCount = visits.reduce((acc, v) => {
        acc[v.faculty] = (acc[v.faculty] || 0) + 1;
        return acc;
    }, {});

    const stats = {
        total: visits.length,
        genderDistribution: Object.entries(genderCount).map(([name, count]) => ({
            name: name === 'L' ? 'Laki-laki' : name === 'P' ? 'Perempuan' : name,
            count,
            percentage: Math.round((count / visits.length) * 100)
        })),
        facultyDistribution: Object.entries(facultyCount)
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / visits.length) * 100)
            }))
            .sort((a, b) => b.count - a.count),
    };

    return { data: stats, error: null };
}
