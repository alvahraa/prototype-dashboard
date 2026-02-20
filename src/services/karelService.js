/**
 * Karel Service
 * 
 * Service untuk data kunjungan ruang karel dari database.
 */

import { fetchBackendApi } from './api';

/**
 * Get all Karel visits from database
 * @param {Object} options - { startDate, endDate }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getKarelVisits(options = {}) {
    const params = new URLSearchParams();
    params.append('ruangan', 'karel');
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    params.append('limit', '5000');

    try {
        const { data: response, error } = await fetchBackendApi(`/visits?${params.toString()}`);

        if (error) {
            return { data: [], error };
        }

        const visits = (response?.data || []).map(v => ({
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

        return { data: visits, error: null };
    } catch (e) {
        return { data: [], error: e.message };
    }
}

/**
 * Get today's Karel visits
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getTodayKarelVisits() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return getKarelVisits({
        startDate: today.toISOString(),
        endDate: new Date().toISOString(),
    });
}

/**
 * Get Karel visit statistics
 * @param {Object} options - { startDate, endDate }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getKarelStats(options = {}) {
    const { data: visits, error } = await getKarelVisits(options);

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
