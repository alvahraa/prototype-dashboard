/**
 * Authentication Routes
 * 
 * Handles admin login, registration, and password management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { query } = require('../database');

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

        const result = await query('SELECT * FROM admins WHERE username = $1', [username]);

        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }

        const user = result.rows[0];

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

        // Check if username exists
        const checkResult = await query('SELECT id FROM admins WHERE username = $1', [username]);
        if (checkResult.rowCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'Username sudah digunakan'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new admin
        await query(
            'INSERT INTO admins (username, password_hash, display_name) VALUES ($1, $2, $3)',
            [username, passwordHash, displayName || username]
        );

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

        const result = await query('SELECT * FROM admins WHERE username = $1', [username]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User tidak ditemukan'
            });
        }

        const user = result.rows[0];

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
        await query(
            'UPDATE admins SET password_hash = $1 WHERE id = $2',
            [passwordHash, user.id]
        );

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
router.get('/admins', async (req, res) => {
    try {
        const result = await query('SELECT id, username, display_name, created_at FROM admins ORDER BY created_at DESC');

        const admins = result.rows.map(row => ({
            id: row.id,
            username: row.username,
            displayName: row.display_name,
            createdAt: row.created_at
        }));

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
        const result = await query('SELECT COUNT(*) as count FROM admins');
        const count = parseInt(result.rows[0].count);

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

        await query(
            'INSERT INTO admins (username, password_hash, display_name) VALUES ($1, $2, $3)',
            ['admin', passwordHash, 'Administrator']
        );

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
