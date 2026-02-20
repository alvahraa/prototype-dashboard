/**
 * Visits API Routes
 * Endpoints for managing library attendance
 */

const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database');

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
router.post('/', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(503).json({ success: false, error: 'Database not initialized' });
        }

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

        // Use transaction for multiple inserts
        db.run('BEGIN TRANSACTION');

        try {
            const stmt = db.prepare(`
                INSERT INTO visits (nama, nim, prodi, faculty, gender, ruangan, umur, locker_number, visit_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
            `);

            roomsToInsert.forEach(room => {
                stmt.run([nama, nim, prodi, faculty, gender, room, umur || null, locker_number || null]);
            });

            stmt.free();
            db.run('COMMIT');

            // Save to file
            saveDatabase();

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
            db.run('ROLLBACK');
            throw insertError;
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
router.get('/', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(503).json({ success: false, error: 'Database not initialized' });
        }

        const { ruangan, startDate, endDate, locker_number, limit = 1000 } = req.query;
        const safeLimitNum = Math.min(Math.max(parseInt(limit) || 1000, 1), 5000);

        let query = 'SELECT * FROM visits WHERE 1=1';
        const params = [];

        if (locker_number) {
            query += ' AND locker_number = ?';
            params.push(locker_number);
        }

        if (ruangan) {
            query += ' AND ruangan = ?';
            params.push(ruangan);
        }

        if (startDate) {
            query += ' AND visit_time >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND visit_time <= ?';
            params.push(endDate);
        }

        query += ` ORDER BY visit_time DESC LIMIT ${safeLimitNum}`;

        const result = db.exec(query, params);

        // Convert to array of objects
        const visits = [];
        if (result.length > 0) {
            const columns = result[0].columns;
            result[0].values.forEach(row => {
                const visit = {};
                columns.forEach((col, i) => visit[col] = row[i]);
                visits.push(visit);
            });
        }

        res.json({
            success: true,
            count: visits.length,
            data: visits
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
router.get('/stats', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(503).json({ success: false, error: 'Database not initialized' });
        }

        const { ruangan, days = 30 } = req.query;
        const safeDays = Math.min(Math.max(parseInt(days) || 30, 1), 3650);

        // Helper: parameterized query runner
        const runQuery = (sql, params = []) => {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return rows;
        };

        // Build parameterized WHERE clause
        const baseWhere = `WHERE visit_time >= datetime('now', '-' || ? || ' days', 'localtime')`;
        const baseParams = [String(safeDays)];

        let whereClause = baseWhere;
        let whereParams = [...baseParams];
        if (ruangan) {
            whereClause += ' AND ruangan = ?';
            whereParams.push(ruangan);
        }

        // Total visits
        const totalResult = runQuery(
            `SELECT COUNT(*) as total FROM visits ${whereClause}`,
            whereParams
        );
        const totalVisits = totalResult[0]?.total || 0;

        // Visits by room
        const byRoom = runQuery(
            `SELECT ruangan, COUNT(*) as count FROM visits ${whereClause} GROUP BY ruangan ORDER BY count DESC`,
            whereParams
        );

        // Visits by faculty
        const byFaculty = runQuery(
            `SELECT faculty, COUNT(*) as count FROM visits ${whereClause} GROUP BY faculty ORDER BY count DESC`,
            whereParams
        );

        // Visits by gender
        const byGender = runQuery(
            `SELECT gender, COUNT(*) as count FROM visits ${whereClause} GROUP BY gender`,
            whereParams
        );

        // Daily trend (last 7 days) — also parameterized
        const trendParams = ruangan ? [ruangan] : [];
        const dailyTrend = runQuery(
            `SELECT DATE(visit_time) as date, COUNT(*) as count FROM visits WHERE visit_time >= datetime('now', '-7 days', 'localtime')${ruangan ? ' AND ruangan = ?' : ''} GROUP BY DATE(visit_time) ORDER BY date`,
            trendParams
        );

        // Peak hours
        const peakHours = runQuery(
            `SELECT strftime('%H', visit_time) as hour, COUNT(*) as count FROM visits ${whereClause} GROUP BY hour ORDER BY count DESC LIMIT 5`,
            whereParams
        );

        res.json({
            success: true,
            data: {
                totalVisits,
                byRoom,
                byFaculty,
                byGender,
                dailyTrend,
                peakHours
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
 * Student/Librarian returns a locker by entering the locker number
 * Finds the latest active (un-returned) visit for that locker and marks it as returned
 * 
 * IMPORTANT: This route MUST be defined BEFORE /:id/return-locker
 * Otherwise Express matches "return-locker-by-number" as the :id param
 */
router.put('/return-locker-by-number', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(503).json({ success: false, error: 'Database not initialized' });
        }

        const { locker_number } = req.body;
        if (!locker_number) {
            return res.status(400).json({ success: false, error: 'Nomor loker harus diisi' });
        }

        // Find the latest active visit for this locker today
        const findStmt = db.prepare(`
            SELECT id, nama, nim, prodi, locker_number, visit_time, locker_returned_at 
            FROM visits 
            WHERE locker_number = ? 
              AND locker_returned_at IS NULL 
              AND DATE(visit_time) = DATE('now', 'localtime')
            ORDER BY visit_time DESC 
            LIMIT 1
        `);
        findStmt.bind([String(locker_number)]);

        if (!findStmt.step()) {
            findStmt.free();
            return res.status(404).json({
                success: false,
                error: `Tidak ditemukan peminjaman aktif untuk Loker #${locker_number} hari ini`
            });
        }

        const visit = findStmt.getAsObject();
        findStmt.free();

        // Mark as returned
        const updateStmt = db.prepare(`UPDATE visits SET locker_returned_at = datetime('now', 'localtime') WHERE id = ?`);
        updateStmt.run([visit.id]);
        updateStmt.free();
        saveDatabase();

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
 * Admin manually marks a locker as returned
 */
router.put('/:id/return-locker', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(503).json({ success: false, error: 'Database not initialized' });
        }

        const visitId = parseInt(req.params.id);
        if (isNaN(visitId)) {
            return res.status(400).json({ success: false, error: 'Invalid visit ID' });
        }

        // Check if visit exists and has a locker
        const checkStmt = db.prepare(`SELECT id, locker_number, locker_returned_at FROM visits WHERE id = ?`);
        checkStmt.bind([visitId]);

        if (!checkStmt.step()) {
            checkStmt.free();
            return res.status(404).json({ success: false, error: 'Visit not found' });
        }

        const row = checkStmt.getAsObject();
        checkStmt.free();

        if (!row.locker_number) {
            return res.status(400).json({ success: false, error: 'This visit has no locker assigned' });
        }

        if (row.locker_returned_at) {
            return res.status(400).json({ success: false, error: 'Locker already returned' });
        }

        // Mark as returned
        const updateStmt = db.prepare(`UPDATE visits SET locker_returned_at = datetime('now', 'localtime') WHERE id = ?`);
        updateStmt.run([visitId]);
        updateStmt.free();
        saveDatabase();

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

