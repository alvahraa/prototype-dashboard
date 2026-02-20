/**
 * Settings Route
 * 
 * GET  /api/settings/operating-hours  - Get operating hours
 * PUT  /api/settings/operating-hours  - Update operating hours
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database');

/**
 * GET /operating-hours
 * Returns the current operating hours configuration
 */
router.get('/operating-hours', async (req, res) => {
    try {
        const result = await query("SELECT value FROM settings WHERE key = $1", ['operating_hours']);

        if (result.rowCount > 0) {
            // Postgres returns JSON columns as objects automatically, but we defined it as TEXT in schema 
            // to match previous behavior, so we parse it.
            const hours = JSON.parse(result.rows[0].value);
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
router.put('/operating-hours', async (req, res) => {
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

        const jsonValue = JSON.stringify(hours);

        // Upsert using Postgres syntax
        await query(
            `INSERT INTO settings (key, value) VALUES ($1, $2)
             ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
            ['operating_hours', jsonValue]
        );

        res.json({ success: true, data: hours, message: 'Jam operasional berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating operating hours:', error);
        res.status(500).json({ success: false, error: 'Failed to update operating hours' });
    }
});

module.exports = router;
