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

// Seed default operating hours if not already set
async function seedOperatingHours() {
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
}

// Seed default admin if no admins exist
async function seedDefaultAdmin() {
    const adminCheck = await pool.query('SELECT COUNT(*) FROM admins');
    const adminCount = parseInt(adminCheck.rows[0].count);
    if (adminCount === 0) {
        const bcrypt = require('bcryptjs');
        // Use async bcrypt — never block the event loop — Fix #10
        const hash = await bcrypt.hash('admin123', 10);
        await pool.query(
            'INSERT INTO admins (username, password_hash, display_name) VALUES ($1, $2, $3)',
            ['admin', hash, 'Administrator']
        );
        console.log('✓ Default admin seeded');
    }
}

async function initDatabase() {
    try {
        console.log('Initializing database connection...');

        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✓ Connected to Neon PostgreSQL');

        // ONE round-trip for all DDL (batch = fewer network RTTs on Neon cold start) — Fix #8
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
            );
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                display_name TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_visits_ruangan ON visits(ruangan);
            CREATE INDEX IF NOT EXISTS idx_visits_visit_time ON visits(visit_time);
            CREATE INDEX IF NOT EXISTS idx_visits_nim ON visits(nim);
            CREATE INDEX IF NOT EXISTS idx_visits_room_time ON visits(ruangan, visit_time);
            ALTER TABLE visits ADD COLUMN IF NOT EXISTS locker_number TEXT;
            ALTER TABLE visits ADD COLUMN IF NOT EXISTS locker_returned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
            ALTER TABLE visits ADD COLUMN IF NOT EXISTS umur INTEGER;
            ALTER TABLE visits ADD COLUMN IF NOT EXISTS faculty TEXT;
            ALTER TABLE visits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log('✓ Schema initialized');

        // Seed checks run in parallel — both are independent
        await Promise.all([seedOperatingHours(), seedDefaultAdmin()]);

    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    }
}

module.exports = {
    initDatabase,
    query,
    getDb: () => pool // Backward compatibility wrapper
};
