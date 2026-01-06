/**
 * Loan Service
 * 
 * Service untuk data peminjaman dari SLiMS.
 * Mendukung mode dummy dan production.
 */

import { config, fetchSlimsApi } from './api';
import { loans as dummyLoans } from '../data/generateDummyData';

/**
 * Get all loans data
 * @param {Object} options - { startDate, endDate, status }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getLoans(options = {}) {
  // Dummy mode
  if (config.dataMode === 'dummy') {
    let data = [...dummyLoans];
    
    // Filter by date
    if (options.startDate || options.endDate) {
      data = data.filter(l => {
        const loanDate = new Date(l.loanDate);
        if (options.startDate && loanDate < new Date(options.startDate)) return false;
        if (options.endDate && loanDate > new Date(options.endDate)) return false;
        return true;
      });
    }
    
    // Filter by status
    if (options.status) {
      data = data.filter(l => l.status === options.status);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data, error: null };
  }

  // Production mode
  // TODO: Sesuaikan dengan endpoint SLiMS
  const params = new URLSearchParams();
  if (options.startDate) params.append('start_date', options.startDate);
  if (options.endDate) params.append('end_date', options.endDate);
  if (options.status) params.append('status', options.status);
  
  return fetchSlimsApi(`/loans?${params.toString()}`);
}

/**
 * Get active loans (currently borrowed)
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getActiveLoans() {
  return getLoans({ status: 'active' });
}

/**
 * Get late loans
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getLateLoans() {
  return getLoans({ status: 'late' });
}

/**
 * Get loan statistics
 * @param {Object} options - { startDate, endDate }
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getLoanStats(options = {}) {
  const { data: loans, error } = await getLoans(options);
  
  if (error) return { data: null, error };
  
  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === 'active').length,
    returned: loans.filter(l => l.status === 'returned').length,
    late: loans.filter(l => l.status === 'late').length,
  };
  
  return { data: stats, error: null };
}

/**
 * Get loans by user
 * @param {string} userId - NIM/ID user
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getLoansByUser(userId) {
  if (config.dataMode === 'dummy') {
    const data = dummyLoans.filter(l => l.userId === userId);
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data, error: null };
  }

  return fetchSlimsApi(`/loans/user/${userId}`);
}

/**
 * Get loans by book
 * @param {string} bookId - ID buku
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getLoansByBook(bookId) {
  if (config.dataMode === 'dummy') {
    const data = dummyLoans.filter(l => l.bookId === bookId);
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data, error: null };
  }

  return fetchSlimsApi(`/loans/book/${bookId}`);
}
