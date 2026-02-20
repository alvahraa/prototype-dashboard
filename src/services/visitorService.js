/**
 * Visitor Service
 * 
 * Service untuk data kunjungan.
 * Mode 'backend' = langsung dari SQLite database
 */

import { config, fetchBackendApi } from './api';

/**
 * Get all visitors data from backend database
 * @param {Object} options - { startDate, endDate, ruangan }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getVisitors(options = {}) {
  const params = new URLSearchParams();
  if (options.startDate) params.append('startDate', options.startDate);
  if (options.endDate) params.append('endDate', options.endDate);
  if (options.ruangan) params.append('ruangan', options.ruangan);
  if (options.locker_number) params.append('locker_number', options.locker_number);
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

    // Convert backend data to dashboard format
    const visitors = response.data.map(v => ({
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
      locker_number: v.locker_number,
      locker_returned_at: v.locker_returned_at,
      status: 'exited'
    }));

    return { data: visitors, error: null };
  } catch (e) {
    console.error('Fetch error:', e);
    return { data: [], error: e.message };
  }
}

/**
 * Return a locker (admin override)
 * @param {number} visitId - Visit ID to mark locker as returned
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function returnLocker(visitId) {
  try {
    const { data, error } = await fetchBackendApi(`/visits/${visitId}/return-locker`, {
      method: 'PUT'
    });
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

/**
 * Get today's visitors
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getTodayVisitors() {
  // Use local date format (YYYY-MM-DD) to match SQLite's datetime('now', 'localtime')
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day} 00:00:00`;
  const nowStr = `${year}-${month}-${day} 23:59:59`;

  return getVisitors({
    startDate: todayStr,
    endDate: nowStr,
  });
}

/**
 * Get active visitors (currently in library)
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getActiveVisitors() {
  const { data } = await getVisitors();
  const activeData = data.filter(v => v.status === 'active' || v.status === 'inside');
  return { data: activeData, error: null };
}

/**
 * Get visitor statistics from backend
 * @param {Object} options - { ruangan, days }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getVisitorStats(options = {}) {
  const params = new URLSearchParams();
  if (options.ruangan) params.append('ruangan', options.ruangan);
  if (options.days) params.append('days', options.days.toString());

  try {
    const { data: response, error } = await fetchBackendApi(`/visits/stats?${params.toString()}`);

    if (error) {
      return { data: null, error };
    }

    return { data: response?.data || null, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}
