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
        // Always show full details to help debug on Vercel
        console.error('Serverless Init Error:', error);
        res.status(500).json({
            error: 'Failed to initialize server',
            details: error.message,
            stack: error.stack
        });
    }
};
