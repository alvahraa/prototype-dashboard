/**
 * Authentication Routes
 * 
 * Handles admin login, registration, and password management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getDb, saveDatabase } = require('../database');

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username dan password harus diisi'
            });
        }

        const db = getDb();
        const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
        stmt.bind([username]);

        if (!stmt.step()) {
            return res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }

        const user = stmt.getAsObject();
        stmt.free();

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }

        // Generate simple token (in production, use JWT)
        const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    displayName: user.display_name || user.username
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/register
 * Create new admin account
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, displayName } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username dan password harus diisi'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password minimal 6 karakter'
            });
        }

        const db = getDb();

        // Check if username exists
        const checkStmt = db.prepare('SELECT id FROM admins WHERE username = ?');
        checkStmt.bind([username]);
        if (checkStmt.step()) {
            checkStmt.free();
            return res.status(400).json({
                success: false,
                error: 'Username sudah digunakan'
            });
        }
        checkStmt.free();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new admin
        db.run(
            'INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)',
            [username, passwordHash, displayName || username]
        );

        saveDatabase();

        res.json({
            success: true,
            message: 'Admin berhasil dibuat'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * PUT /api/auth/password
 * Change password for existing admin
 */
router.put('/password', async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Semua field harus diisi'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password baru minimal 6 karakter'
            });
        }

        const db = getDb();
        const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
        stmt.bind([username]);

        if (!stmt.step()) {
            return res.status(404).json({
                success: false,
                error: 'User tidak ditemukan'
            });
        }

        const user = stmt.getAsObject();
        stmt.free();

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Password saat ini salah'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        db.run(
            'UPDATE admins SET password_hash = ? WHERE id = ?',
            [passwordHash, user.id]
        );

        saveDatabase();

        res.json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/auth/admins
 * Get list of all admins (for admin management)
 */
router.get('/admins', (req, res) => {
    try {
        const db = getDb();
        const results = db.exec('SELECT id, username, display_name, created_at FROM admins ORDER BY created_at DESC');

        const admins = results.length > 0
            ? results[0].values.map(row => ({
                id: row[0],
                username: row[1],
                displayName: row[2],
                createdAt: row[3]
            }))
            : [];

        res.json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/init
 * Initialize default admin if none exists
 */
router.post('/init', async (req, res) => {
    try {
        const db = getDb();
        const results = db.exec('SELECT COUNT(*) as count FROM admins');
        const count = results.length > 0 ? results[0].values[0][0] : 0;

        if (count > 0) {
            return res.json({
                success: true,
                message: 'Admin sudah ada',
                initialized: false
            });
        }

        // Create default admin
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        db.run(
            'INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)',
            ['admin', passwordHash, 'Administrator']
        );

        saveDatabase();

        res.json({
            success: true,
            message: 'Default admin created: admin / admin123',
            initialized: true
        });
    } catch (error) {
        console.error('Init error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
