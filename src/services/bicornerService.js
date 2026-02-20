/**
 * BI Corner Service
 * 
 * Service untuk data kunjungan BI Corner
 */

import { config, fetchBackendApi } from './api';

/**
 * Get BI Corner visits
 */
export async function getBICornerVisits(options = {}) {
    const params = new URLSearchParams();
    params.append('ruangan', 'bicorner');
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    params.append('limit', '5000');

    try {
        const { data: response, error } = await fetchBackendApi(`/visits?${params.toString()}`);

        if (error) {
            console.error('API Error:', error);
            return { data: [], error };
        }

        if (!response?.data) {
            return { data: [], error: null };
        }

        const visits = response.data.map(v => ({
            id: v.id,
            nama: v.nama,
            nim: v.nim,
            faculty: v.faculty,
            prodi: v.prodi,
            gender: v.gender,
            umur: v.umur,
            ruangan: v.ruangan,
            visitTime: v.visit_time,
            entryTime: v.visit_time,
            status: 'exited'
        }));

        return { data: visits, error: null };
    } catch (e) {
        console.error('Fetch error:', e);
        return { data: [], error: e.message };
    }
}

/**
 * Get BI Corner stats
 */
export async function getBICornerStats(options = {}) {
    const params = new URLSearchParams();
    params.append('ruangan', 'bicorner');
    if (options.days) params.append('days', options.days.toString());

    try {
        const { data: response, error } = await fetchBackendApi(`/visits/stats?${params.toString()}`);

        if (error) {
            return { data: null, error };
        }

        // Transform data to match frontend expectations
        const rawStats = response?.data || {};

        // Map Gender 'L'/'P' to 'Laki-laki'/'Perempuan'
        const genderMap = { 'L': 'Laki-laki', 'P': 'Perempuan' };

        const genderDistribution = (rawStats.byGender || []).map(g => ({
            name: genderMap[g.gender] || g.gender,
            count: g.count,
            percentage: rawStats.totalVisits ? Math.round((g.count / rawStats.totalVisits) * 100) : 0
        }));

        const transformedStats = {
            total: rawStats.totalVisits || 0,
            genderDistribution,
            // Pass other stats if needed
            ...rawStats
        };

        return { data: transformedStats, error: null };
    } catch (e) {
        return { data: null, error: e.message };
    }
}
