/**
 * Settings Route
 * 
 * GET  /api/settings/operating-hours  - Get operating hours
 * PUT  /api/settings/operating-hours  - Update operating hours
 */

const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database');

/**
 * GET /operating-hours
 * Returns the current operating hours configuration
 */
router.get('/operating-hours', (req, res) => {
    try {
        const db = getDb();
        const result = db.exec("SELECT value FROM settings WHERE key = 'operating_hours'");

        if (result.length > 0 && result[0].values.length > 0) {
            const hours = JSON.parse(result[0].values[0][0]);
            res.json({ success: true, data: hours });
        } else {
            // Return defaults if not set
            res.json({
                success: true,
                data: {
                    senin: { buka: '08:00', tutup: '17:00', aktif: true },
                    selasa: { buka: '08:00', tutup: '17:00', aktif: true },
                    rabu: { buka: '08:00', tutup: '17:00', aktif: true },
                    kamis: { buka: '08:00', tutup: '17:00', aktif: true },
                    jumat: { buka: '08:00', tutup: '17:00', aktif: true },
                    sabtu: { buka: '08:00', tutup: '12:00', aktif: true },
                    minggu: { buka: '00:00', tutup: '00:00', aktif: false },
                }
            });
        }
    } catch (error) {
        console.error('Error fetching operating hours:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch operating hours' });
    }
});

/**
 * PUT /operating-hours
 * Updates the operating hours configuration
 * Body: { senin: { buka: '08:00', tutup: '17:00', aktif: true }, ... }
 */
router.put('/operating-hours', (req, res) => {
    try {
        const hours = req.body;

        // Basic validation
        const validDays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        for (const day of validDays) {
            if (!hours[day]) {
                return res.status(400).json({
                    success: false,
                    error: `Missing data for ${day}`
                });
            }
            if (!hours[day].buka || !hours[day].tutup) {
                return res.status(400).json({
                    success: false,
                    error: `Missing buka/tutup for ${day}`
                });
            }
        }

        const db = getDb();
        const jsonValue = JSON.stringify(hours);

        // Upsert: Update if exists, insert if not
        const existing = db.exec("SELECT key FROM settings WHERE key = 'operating_hours'");
        if (existing.length > 0 && existing[0].values.length > 0) {
            db.run(
                "UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = 'operating_hours'",
                [jsonValue]
            );
        } else {
            db.run(
                "INSERT INTO settings (key, value) VALUES ('operating_hours', ?)",
                [jsonValue]
            );
        }

        saveDatabase();

        res.json({ success: true, data: hours, message: 'Jam operasional berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating operating hours:', error);
        res.status(500).json({ success: false, error: 'Failed to update operating hours' });
    }
});

module.exports = router;
