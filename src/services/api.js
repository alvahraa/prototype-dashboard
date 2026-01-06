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
  // Data mode: 'dummy' atau 'production'
  dataMode: process.env.REACT_APP_DATA_MODE || 'dummy',
  
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
  
  // Auto refresh interval (5 menit default)
  refreshInterval: parseInt(process.env.REACT_APP_REFRESH_INTERVAL || '300000', 10),
};

/**
 * Generic fetch wrapper dengan error handling
 */
async function fetchApi(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error.message };
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

export { config, fetchApi, fetchGateApi, fetchSlimsApi };
