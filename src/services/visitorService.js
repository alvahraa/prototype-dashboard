/**
 * Visitor Service
 * 
 * Service untuk data kunjungan dari Gate System.
 * Mendukung mode dummy dan production.
 */

import { config, fetchGateApi } from './api';
import { visitors as dummyVisitors } from '../data/generateDummyData';

/**
 * Get all visitors data
 * @param {Object} options - { startDate, endDate }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getVisitors(options = {}) {
  // Dummy mode - return data dari generateDummyData
  if (config.dataMode === 'dummy') {
    let data = [...dummyVisitors];
    
    // Filter by date if provided
    if (options.startDate || options.endDate) {
      data = data.filter(v => {
        const entryDate = new Date(v.entryTime);
        if (options.startDate && entryDate < new Date(options.startDate)) return false;
        if (options.endDate && entryDate > new Date(options.endDate)) return false;
        return true;
      });
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { data, error: null };
  }

  // Production mode - fetch dari Gate API
  // TODO: Sesuaikan endpoint dengan Gate System yang digunakan
  const params = new URLSearchParams();
  if (options.startDate) params.append('start_date', options.startDate);
  if (options.endDate) params.append('end_date', options.endDate);
  
  return fetchGateApi(`/visitors?${params.toString()}`);
}

/**
 * Get today's visitors
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getTodayVisitors() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return getVisitors({
    startDate: today.toISOString(),
    endDate: new Date().toISOString(),
  });
}

/**
 * Get active visitors (currently in library)
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getActiveVisitors() {
  if (config.dataMode === 'dummy') {
    const data = dummyVisitors.filter(v => v.status === 'active');
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data, error: null };
  }

  return fetchGateApi('/visitors/active');
}

/**
 * Get visitor statistics
 * @param {Object} options - { startDate, endDate }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getVisitorStats(options = {}) {
  const { data: visitors, error } = await getVisitors(options);
  
  if (error) return { data: null, error };
  
  const stats = {
    total: visitors.length,
    active: visitors.filter(v => v.status === 'active').length,
    exited: visitors.filter(v => v.status === 'exited').length,
  };
  
  return { data: stats, error: null };
}
