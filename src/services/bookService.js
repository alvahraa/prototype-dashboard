/**
 * Book Service
 * 
 * Service untuk data buku dari SLiMS.
 * Mendukung mode dummy dan production.
 */

import { config, fetchSlimsApi } from './api';
import { books as dummyBooks } from '../data/generateDummyData';

/**
 * Get all books
 * @param {Object} options - { category, search, limit }
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getBooks(options = {}) {
  // Dummy mode
  if (config.dataMode === 'dummy') {
    let data = [...dummyBooks];
    
    // Filter by category
    if (options.category) {
      data = data.filter(b => b.category === options.category);
    }
    
    // Search by title/author
    if (options.search) {
      const search = options.search.toLowerCase();
      data = data.filter(b => 
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
      );
    }
    
    // Limit results
    if (options.limit) {
      data = data.slice(0, options.limit);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data, error: null };
  }

  // Production mode
  const params = new URLSearchParams();
  if (options.category) params.append('category', options.category);
  if (options.search) params.append('search', options.search);
  if (options.limit) params.append('limit', options.limit);
  
  return fetchSlimsApi(`/books?${params.toString()}`);
}

/**
 * Get book by ID
 * @param {string} bookId - ID buku
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export async function getBookById(bookId) {
  if (config.dataMode === 'dummy') {
    const book = dummyBooks.find(b => b.id === bookId);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { data: book || null, error: book ? null : 'Book not found' };
  }

  return fetchSlimsApi(`/books/${bookId}`);
}

/**
 * Get book categories
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function getCategories() {
  if (config.dataMode === 'dummy') {
    const categories = [...new Set(dummyBooks.map(b => b.category))];
    await new Promise(resolve => setTimeout(resolve, 100));
    return { data: categories, error: null };
  }

  return fetchSlimsApi('/books/categories');
}

/**
 * Get total book count
 * @returns {Promise<{data: number, error: string|null}>}
 */
export async function getTotalBooks() {
  if (config.dataMode === 'dummy') {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { data: dummyBooks.length, error: null };
  }

  const { data, error } = await fetchSlimsApi('/books/count');
  return { data: data?.count || 0, error };
}

/**
 * Search books
 * @param {string} query - Search query
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function searchBooks(query) {
  return getBooks({ search: query, limit: 20 });
}
