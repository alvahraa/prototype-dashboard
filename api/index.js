const { setupApp } = require('../backend/server');

// Initialize app instance
let app;

module.exports = async (req, res) => {
    if (!app) {
        app = await setupApp();
    }

    // Explicitly handle the request using the Express app
    return app(req, res);
};
