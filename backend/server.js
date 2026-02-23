/**
 * Express Server for Perpustakaan UNISSULA API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration
// In production (Vercel), frontend & backend share same domain, allow all origins
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '5mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Initialize database and setup routes
async function setupApp() {
    await initDatabase();

    // Routes (after database is ready)
    // Clear cache to ensure fresh requires if called multiple times in serverless (though usually cold start handles this)
    const visitsRouter = require('./routes/visits');
    const authRouter = require('./routes/auth');
    const settingsRouter = require('./routes/settings');
    app.use('/api/visits', visitsRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/settings', settingsRouter);

    // Debug endpoint - user can visit this directly in browser to test
    app.get('/api/debug-locker', async (req, res) => {
        try {
            const { query } = require('./database');
            const result = await query('SELECT id, nama, locker_number, locker_returned_at, visit_time FROM visits ORDER BY id DESC LIMIT 10');
            res.json({
                status: 'ok',
                dbConnected: true,
                message: 'Buka URL ini di browser untuk cek apakah API berjalan',
                totalRows: result.rowCount,
                data: result.rows
            });
        } catch (e) {
            res.json({
                status: 'error',
                dbConnected: false,
                error: e.message,
                stack: e.stack
            });
        }
    });

    // Serve static files from React app in production (AFTER API routes)
    // Serve Form Absensi (Static & Explicit Route)
    const absensiPath = path.join(__dirname, '../public/absensi');
    app.use('/absensi', express.static(absensiPath));

    // Handle React routing
    if (process.env.NODE_ENV === 'production') {
        const buildPath = path.join(__dirname, '..', 'build');
        app.use(express.static(buildPath));

        // Fallback: serve index.html for non-API routes (React Router)
        // Use app.use() instead of app.get('*') for path-to-regexp compatibility
        app.use((req, res, next) => {
            if (req.path.startsWith('/api')) {
                return res.status(404).json({ error: 'API endpoint not found' });
            }
            res.sendFile(path.join(buildPath, 'index.html'));
        });
    } else {
        app.get('/', (req, res) => {
            res.json({ status: 'Dev API Running' });
        });
    }

    // Error handling
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    });

    return app;
}

// Start server if run directly
if (require.main === module) {
    setupApp().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}

module.exports = { app, setupApp };
