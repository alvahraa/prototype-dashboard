const { setupApp } = require('../backend/server');

// Initialize app instance
let app;

module.exports = async (req, res) => {
    try {
        if (!app) {
            app = await setupApp();
        }

        // Explicitly handle the request using the Express app
        return app(req, res);
    } catch (error) {
        console.error('Serverless Init Error:', error);
        res.status(500).json({
            error: 'Failed to initialize server',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
