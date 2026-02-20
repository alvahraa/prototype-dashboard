/**
 * API Configuration
 * 
 * Base configuration untuk semua API calls.
 * Mendukung 2 mode:
 * - dummy: Menggunakan data dari generateDummyData.js
 * - production: Menggunakan API real (Gate System + SLiMS)
 */

// Environment variables
const config = {
  // Data mode: 'dummy', 'production', or 'hybrid' (combines both)
  dataMode: process.env.REACT_APP_DATA_MODE || 'dummy',

  // Backend API (our SQLite backend for attendance)
  backendApi: {
    baseUrl: process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'),
  },

  // Gate System API (kunjungan)
  gateApi: {
    baseUrl: process.env.REACT_APP_GATE_API_URL || 'http://localhost:8080/api/gate',
    apiKey: process.env.REACT_APP_GATE_API_KEY || '',
  },

  // SLiMS API (peminjaman & buku)
  slimsApi: {
    baseUrl: process.env.REACT_APP_SLIMS_API_URL || 'http://localhost/slims/api',
    apiKey: process.env.REACT_APP_SLIMS_API_KEY || '',
  },

  // Auto refresh interval (10 menit default - lebih efisien)
  // Disabled auto-refresh to prevent loops by default
  refreshInterval: parseInt(process.env.REACT_APP_REFRESH_INTERVAL || '0', 10),

  // Request timeout (ms) untuk mencegah loading tidak berhenti saat backend hang
  requestTimeoutMs: parseInt(process.env.REACT_APP_REQUEST_TIMEOUT_MS || '8000', 10),
};

/**
 * Generic fetch wrapper dengan error handling
 */
async function fetchApi(url, options = {}) {
  // AbortController untuk timeout agar request tidak menggantung terlalu lama
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, config.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API Timeout:', url);
      return {
        data: null,
        error: 'Koneksi ke server terlalu lama (timeout). Pastikan server backend berjalan dengan benar.',
      };
    }

    console.error('API Error:', error);
    return { data: null, error: error.message || 'Gagal terhubung ke server' };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch dari Gate API
 */
async function fetchGateApi(endpoint, options = {}) {
  const url = `${config.gateApi.baseUrl}${endpoint}`;
  return fetchApi(url, {
    ...options,
    headers: {
      'X-API-Key': config.gateApi.apiKey,
      ...options.headers,
    },
  });
}

/**
 * Fetch dari SLiMS API
 */
async function fetchSlimsApi(endpoint, options = {}) {
  const url = `${config.slimsApi.baseUrl}${endpoint}`;
  return fetchApi(url, {
    ...options,
    headers: {
      'X-API-Key': config.slimsApi.apiKey,
      ...options.headers,
    },
  });
}

/**
 * Fetch dari Backend API (SQLite attendance system)
 */
async function fetchBackendApi(endpoint, options = {}) {
  const url = `${config.backendApi.baseUrl}${endpoint}`;
  return fetchApi(url, options);
}

export { config, fetchApi, fetchGateApi, fetchSlimsApi, fetchBackendApi };

