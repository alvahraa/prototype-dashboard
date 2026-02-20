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
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3005', 'http://localhost:3006',
        'http://127.0.0.1:3000', 'http://127.0.0.1:3002', 'http://127.0.0.1:3005', 'http://127.0.0.1:3006',
        'http://192.168.1.5:3000', 'http://192.168.1.5:3002', 'http://192.168.1.5:3005', 'http://192.168.1.5:3006'
    ];

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

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

    // Serve static files from React app in production (AFTER API routes)
    // Serve Form Absensi (Static & Explicit Route)
    const absensiPath = path.join(__dirname, '../public/absensi');
    app.use('/absensi', express.static(absensiPath));

    // Handle React routing
    if (process.env.NODE_ENV === 'production') {
        const buildPath = path.join(__dirname, '..', 'build');
        app.use(express.static(buildPath));

        // Only serve index.html for non-API routes
        app.get('*', (req, res) => {
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
