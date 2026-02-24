const { setupApp } = require('../backend/server');

// Initialize app instance (cached between warm invocations)
let app;

module.exports = async (req, res) => {
    try {
        if (!app) {
            console.log('Cold start: initializing app...');
            app = await setupApp();
            console.log('App initialized successfully');
        }

        return app(req, res);
    } catch (error) {
        // Log full details for Vercel Function logs only — NEVER expose to client
        console.error('[Cold Start FAILED]', error);
        res.status(500).json({
            error: 'Service temporarily unavailable. Please try again.'
        });
    }
};
