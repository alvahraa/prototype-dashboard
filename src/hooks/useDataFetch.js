import { useState, useEffect, useCallback } from 'react';
import { config } from '../services/api';

/**
 * useDataFetch - Custom hook untuk data fetching dengan loading/error states
 * 
 * @param {Function} fetchFn - Async function yang return {data, error}
 * @param {Array} deps - Dependencies untuk re-fetch
 * @param {Object} options - { autoFetch, refreshInterval }
 * @returns {Object} { data, loading, error, refetch }
 */
export function useDataFetch(fetchFn, deps = [], options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { autoFetch = true, refreshInterval = null } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      setData(null);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, ...deps]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Auto refresh
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * useVisitors - Hook untuk data kunjungan
 */
export function useVisitors(options = {}) {
  const { getVisitors } = require('../services/visitorService');
  
  return useDataFetch(
    () => getVisitors(options),
    [options.startDate, options.endDate],
    { refreshInterval: config.refreshInterval }
  );
}

/**
 * useLoans - Hook untuk data peminjaman
 */
export function useLoans(options = {}) {
  const { getLoans } = require('../services/loanService');
  
  return useDataFetch(
    () => getLoans(options),
    [options.startDate, options.endDate, options.status],
    { refreshInterval: config.refreshInterval }
  );
}

/**
 * useBooks - Hook untuk data buku
 */
export function useBooks(options = {}) {
  const { getBooks } = require('../services/bookService');
  
  return useDataFetch(
    () => getBooks(options),
    [options.category, options.search, options.limit]
  );
}

/**
 * useDashboardData - Hook untuk semua data dashboard sekaligus
 */
export function useDashboardData(dateRange = {}) {
  const visitors = useVisitors(dateRange);
  const loans = useLoans(dateRange);
  const books = useBooks();

  const loading = visitors.loading || loans.loading || books.loading;
  const error = visitors.error || loans.error || books.error;

  const refetchAll = useCallback(() => {
    visitors.refetch();
    loans.refetch();
    books.refetch();
  }, [visitors, loans, books]);

  return {
    visitors: visitors.data,
    loans: loans.data,
    books: books.data,
    loading,
    error,
    refetch: refetchAll,
  };
}
