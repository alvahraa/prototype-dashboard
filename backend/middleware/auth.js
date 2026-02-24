/**
 * JWT Authentication Middleware
 * 
 * Verifies the Bearer token on protected routes.
 * Usage: router.put('/some-route', requireAuth, handler)
 */

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: missing or invalid Authorization header'
        });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod');
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: invalid or expired token'
        });
    }
}

module.exports = { requireAuth };
