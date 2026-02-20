/**
 * Visits API Routes
 * Endpoints for managing library attendance
 * Refactored for PostgreSQL
 */

const express = require('express');
const router = express.Router();
const { getDb, query } = require('../database');

// Faculty mapping from prodi
const FACULTY_MAP = {
    'S1 Kedokteran Umum': 'Fakultas Kedokteran',
    'S2 Biomedik': 'Fakultas Kedokteran',
    'S3 Biomedik': 'Fakultas Kedokteran',
    'S1 Kedokteran Gigi': 'Fakultas Kedokteran Gigi',
    'S2 Kedokteran Gigi': 'Fakultas Kedokteran Gigi',
    'S1 Teknik Sipil': 'Fakultas Teknik',
    'S2 Teknik Sipil': 'Fakultas Teknik',
    'S3 Teknik Sipil': 'Fakultas Teknik',
    'S1 Planologi': 'Fakultas Teknik',
    'S2 Planologi': 'Fakultas Teknik',
    'S1 Ilmu Hukum': 'Fakultas Hukum',
    'S2 Ilmu Hukum': 'Fakultas Hukum',
    'S2 Kenotariatan': 'Fakultas Hukum',
    'S3 Doktor Ilmu Hukum': 'Fakultas Hukum',
    'D3 Akuntansi': 'Fakultas Ekonomi',
    'S1 Akuntansi': 'Fakultas Ekonomi',
    'S2 Akuntansi': 'Fakultas Ekonomi',
    'S1 Manajemen': 'Fakultas Ekonomi',
    'S2 Manajemen': 'Fakultas Ekonomi',
    'S3 Manajemen': 'Fakultas Ekonomi',
    'S1 Hukum Keluarga': 'Fakultas Agama Islam',
    'S1 Pendidikan Agama Islam': 'Fakultas Agama Islam',
    'S2 Pendidikan Agama Islam': 'Fakultas Agama Islam',
    'S1 Teknik Industri': 'Fakultas Teknologi Industri',
    'S1 Teknik Informatika': 'Fakultas Teknologi Industri',
    'S1 Teknik Elektro': 'Fakultas Teknologi Industri',
    'S2 Teknik Elektro': 'Fakultas Teknologi Industri',
    'S1 Psikologi': 'Fakultas Psikologi',
    'D3 Keperawatan': 'Fakultas Ilmu Keperawatan',
    'S1 Keperawatan': 'Fakultas Ilmu Keperawatan',
    'S2 Keperawatan': 'Fakultas Ilmu Keperawatan',
    'S1 Ilmu Komunikasi': 'Fakultas Ilmu Komunikasi',
    'S1 Pendidikan Bahasa Inggris': 'Fakultas Bahasa, Sastra dan Budaya',
    'S1 Sastra Inggris': 'Fakultas Bahasa, Sastra dan Budaya',
    'S1 Pendidikan Matematika': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S2 Matematika': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S1 PBSI': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S2 PBSI': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S1 PGSD': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S2 PGSD': 'Fakultas Keguruan dan Ilmu Pendidikan',
    'S1 Farmasi': 'Fakultas Farmasi',
    'S1 Kebidanan': 'Fakultas Farmasi'
};

// Valid rooms
const VALID_ROOMS = ['audiovisual', 'referensi', 'sirkulasi_l1', 'sirkulasi_l2', 'sirkulasi_l3', 'karel', 'smartlab', 'bicorner'];

/**
 * POST /api/visits
 * Submit new attendance
 */
router.post('/', async (req, res) => {
    try {
        const { nama, nim, prodi, gender, ruangan, locker_number, umur } = req.body;

        // Validation
        if (!nama || !nim || !prodi || !gender || !ruangan) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: nama, nim, prodi, gender, ruangan'
            });
        }

        if (!['L', 'P'].includes(gender)) {
            return res.status(400).json({
                success: false,
                error: 'Gender must be L (Laki-laki) or P (Perempuan)'
            });
        }

        // Get faculty from prodi
        const faculty = FACULTY_MAP[prodi] || 'Unknown';

        // Prepare rooms array (handle single string or array)
        let roomsToInsert = [];
        if (Array.isArray(ruangan)) {
            roomsToInsert = ruangan;
        } else {
            roomsToInsert = [ruangan];
        }

        // Validate all rooms
        const invalidRooms = roomsToInsert.filter(r => !VALID_ROOMS.includes(r));
        if (invalidRooms.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Invalid room(s): ${invalidRooms.join(', ')}. Valid rooms: ${VALID_ROOMS.join(', ')}`
            });
        }

        const pool = getDb();
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const queryText = `
                INSERT INTO visits (nama, nim, prodi, faculty, gender, ruangan, umur, locker_number, visit_time)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
            `;

            for (const room of roomsToInsert) {
                await client.query(queryText, [
                    nama, nim, prodi, faculty, gender, room, umur || null, locker_number || null
                ]);
            }

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Attendance recorded successfully',
                data: {
                    nama,
                    nim,
                    rooms: roomsToInsert,
                    locker: locker_number
                }
            });

        } catch (insertError) {
            await client.query('ROLLBACK');
            throw insertError;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error creating visit:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * GET /api/visits
 * Get visits with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const { ruangan, startDate, endDate, locker_number, limit = 1000 } = req.query;
        const safeLimitNum = Math.min(Math.max(parseInt(limit) || 1000, 1), 5000);

        let sql = 'SELECT * FROM visits WHERE 1=1';
        const params = [];
        let paramIdx = 1;

        if (locker_number) {
            sql += ` AND locker_number = $${paramIdx++}`;
            params.push(locker_number);
        }

        if (ruangan) {
            sql += ` AND ruangan = $${paramIdx++}`;
            params.push(ruangan);
        }

        if (startDate) {
            sql += ` AND visit_time >= $${paramIdx++}`;
            params.push(startDate);
        }

        if (endDate) {
            sql += ` AND visit_time <= $${paramIdx++}`;
            params.push(endDate);
        }

        sql += ` ORDER BY visit_time DESC LIMIT $${paramIdx}`;
        params.push(safeLimitNum);

        const result = await query(sql, params);

        res.json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });

    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * GET /api/visits/stats
 * Get aggregated statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const { ruangan, days = 30 } = req.query;
        const safeDays = Math.min(Math.max(parseInt(days) || 30, 1), 3650);

        // Helper: parameterized query runner is now just 'query'

        // Base WHERE clause for Postgres
        // usage: NOW() - ($1 || ' days')::interval
        let baseWhere = `WHERE visit_time >= NOW() - ($1 || ' days')::interval`;
        let baseParams = [String(safeDays)];
        let paramIdx = 2; // Next param index

        if (ruangan) {
            baseWhere += ` AND ruangan = $${paramIdx}`;
            baseParams.push(ruangan);
            paramIdx++; // 3
        }

        // Total visits
        const totalResult = await query(
            `SELECT COUNT(*) as total FROM visits ${baseWhere}`,
            baseParams
        );
        const totalVisits = parseInt(totalResult.rows[0]?.total || 0);

        // Visits by room
        const byRoomResult = await query(
            `SELECT ruangan, COUNT(*) as count FROM visits ${baseWhere} GROUP BY ruangan ORDER BY count DESC`,
            baseParams
        );

        // Visits by faculty
        const byFacultyResult = await query(
            `SELECT faculty, COUNT(*) as count FROM visits ${baseWhere} GROUP BY faculty ORDER BY count DESC`,
            baseParams
        );

        // Visits by gender
        const byGenderResult = await query(
            `SELECT gender, COUNT(*) as count FROM visits ${baseWhere} GROUP BY gender`,
            baseParams
        );

        // Daily trend (last 7 days)
        // Note: Re-building params for this specific query
        let trendSql = `SELECT DATE(visit_time) as date, COUNT(*) as count FROM visits WHERE visit_time >= NOW() - INTERVAL '7 days'`;
        let trendParams = [];
        let trendParamIdx = 1;

        if (ruangan) {
            trendSql += ` AND ruangan = $${trendParamIdx}`;
            trendParams.push(ruangan);
        }
        trendSql += ` GROUP BY DATE(visit_time) ORDER BY date`;

        const dailyTrendResult = await query(trendSql, trendParams);

        // Peak hours
        const peakHoursResult = await query(
            `SELECT TO_CHAR(visit_time, 'HH24') as hour, COUNT(*) as count FROM visits ${baseWhere} GROUP BY hour ORDER BY count DESC LIMIT 5`,
            baseParams
        );

        res.json({
            success: true,
            data: {
                totalVisits,
                byRoom: byRoomResult.rows,
                byFaculty: byFacultyResult.rows,
                byGender: byGenderResult.rows,
                dailyTrend: dailyTrendResult.rows,
                peakHours: peakHoursResult.rows
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * PUT /api/visits/return-locker-by-number
 */
router.put('/return-locker-by-number', async (req, res) => {
    try {
        const { locker_number } = req.body;
        if (!locker_number) {
            return res.status(400).json({ success: false, error: 'Nomor loker harus diisi' });
        }

        // Find the latest active visit for this locker today
        // Postgres: CURRENT_DATE
        const findResult = await query(`
            SELECT id, nama, nim, prodi, locker_number, visit_time, locker_returned_at 
            FROM visits 
            WHERE locker_number = $1 
              AND locker_returned_at IS NULL 
              AND DATE(visit_time) = CURRENT_DATE
            ORDER BY visit_time DESC 
            LIMIT 1
        `, [String(locker_number)]);

        if (findResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: `Tidak ditemukan peminjaman aktif untuk Loker #${locker_number} hari ini`
            });
        }

        const visit = findResult.rows[0];

        // Mark as returned
        await query(
            `UPDATE visits SET locker_returned_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [visit.id]
        );

        res.json({
            success: true,
            message: `Loker #${locker_number} berhasil dikembalikan`,
            data: {
                nama: visit.nama,
                nim: visit.nim,
                prodi: visit.prodi,
                locker_number: visit.locker_number,
                visit_time: visit.visit_time
            }
        });

    } catch (error) {
        console.error('Error returning locker by number:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * PUT /api/visits/:id/return-locker
 */
router.put('/:id/return-locker', async (req, res) => {
    try {
        const visitId = parseInt(req.params.id);
        if (isNaN(visitId)) {
            return res.status(400).json({ success: false, error: 'Invalid visit ID' });
        }

        // Check if visit exists and has a locker
        const checkResult = await query(
            `SELECT id, locker_number, locker_returned_at FROM visits WHERE id = $1`,
            [visitId]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Visit not found' });
        }

        const row = checkResult.rows[0];

        if (!row.locker_number) {
            return res.status(400).json({ success: false, error: 'This visit has no locker assigned' });
        }

        if (row.locker_returned_at) {
            return res.status(400).json({ success: false, error: 'Locker already returned' });
        }

        // Mark as returned
        await query(
            `UPDATE visits SET locker_returned_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [visitId]
        );

        res.json({
            success: true,
            message: `Loker #${row.locker_number} berhasil dikembalikan`
        });

    } catch (error) {
        console.error('Error returning locker:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
