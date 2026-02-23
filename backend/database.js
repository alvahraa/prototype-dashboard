/**
 * Database configuration for Perpustakaan UNISSULA
 * Uses PostgreSQL (Neon) via 'pg' library
 */

const { Pool } = require('pg');

// Create a new pool using the connection string from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon/cloud PostgreSQL connections
    },
    max: 10, // Neon free tier supports limited connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Helper to run queries
const query = (text, params) => pool.query(text, params);

async function initDatabase() {
    try {
        console.log('Initializing database connection...');

        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✓ Connected to Neon PostgreSQL');

        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS visits (
                id SERIAL PRIMARY KEY,
                nama TEXT NOT NULL,
                nim TEXT NOT NULL,
                prodi TEXT NOT NULL,
                faculty TEXT,
                gender TEXT CHECK(gender IN ('L', 'P')),
                ruangan TEXT NOT NULL,
                locker_number TEXT,
                locker_returned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
                umur INTEGER,
                visit_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Index for visits
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visits_ruangan ON visits(ruangan)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visits_visit_time ON visits(visit_time)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visits_nim ON visits(nim)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visits_room_time ON visits(ruangan, visit_time)`);

        // Ensure columns exist (ALTER TABLE is safe if column already exists)
        // This fixes cases where table was created by an older version of the code
        await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS locker_number TEXT`);
        await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS locker_returned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL`);
        await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS umur INTEGER`);
        await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS faculty TEXT`);
        await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        console.log('✓ Ensured all columns exist');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                display_name TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✓ Database schema initialized');

        // Seed default operating hours if not set
        const hoursCheck = await pool.query("SELECT value FROM settings WHERE key = 'operating_hours'");
        if (hoursCheck.rowCount === 0) {
            const defaultHours = JSON.stringify({
                senin: { buka: '08:00', tutup: '17:00', aktif: true },
                selasa: { buka: '08:00', tutup: '17:00', aktif: true },
                rabu: { buka: '08:00', tutup: '17:00', aktif: true },
                kamis: { buka: '08:00', tutup: '17:00', aktif: true },
                jumat: { buka: '08:00', tutup: '17:00', aktif: true },
                sabtu: { buka: '08:00', tutup: '12:00', aktif: true },
                minggu: { buka: '00:00', tutup: '00:00', aktif: false },
            });
            await pool.query("INSERT INTO settings (key, value) VALUES ('operating_hours', $1)", [defaultHours]);
            console.log('✓ Default operating hours seeded');
        }

        // Seed default admin if no admins exist
        const adminCheck = await pool.query('SELECT COUNT(*) FROM admins');
        const adminCount = parseInt(adminCheck.rows[0].count);

        if (adminCount === 0) {
            const bcrypt = require('bcryptjs');
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync('admin123', salt);
            await pool.query(
                'INSERT INTO admins (username, password_hash, display_name) VALUES ($1, $2, $3)',
                ['admin', hash, 'Administrator']
            );
            console.log('✓ Default admin seeded (admin / admin123)');
        }

    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

module.exports = {
    initDatabase,
    query,
    getDb: () => pool // Backward compatibility wrapper
};
