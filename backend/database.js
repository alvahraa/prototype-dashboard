/**
 * Database configuration for Perpustakaan UNISSULA
 * Uses sql.js (pure JavaScript SQLite)
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
let dbPath;
if (process.env.NODE_ENV === 'production') {
    dbPath = path.join('/tmp', 'library.db');
} else {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, 'library.db');
}

let db = null;

async function initDatabase() {
    const SQL = await initSqlJs();

    // In production (Vercel), log the path we are using
    if (process.env.NODE_ENV === 'production') {
        console.log('Using database at:', dbPath);
    }

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
        console.log('✓ Loaded existing database');
    } else {
        db = new SQL.Database();
        console.log('✓ Created new database');
    }

    // Initialize schema
    db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      nim TEXT NOT NULL,
      prodi TEXT NOT NULL,
      faculty TEXT,
      gender TEXT CHECK(gender IN ('L', 'P')),
      ruangan TEXT NOT NULL,
      locker_number TEXT,
      visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Admins table for authentication
    db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Settings table for configurable values (operating hours, etc.)
    db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Seed default operating hours if not set
    const existingHours = db.exec("SELECT value FROM settings WHERE key = 'operating_hours'");
    if (existingHours.length === 0) {
        db.run(`INSERT INTO settings (key, value) VALUES ('operating_hours', ?)`, [
            JSON.stringify({
                senin: { buka: '08:00', tutup: '17:00', aktif: true },
                selasa: { buka: '08:00', tutup: '17:00', aktif: true },
                rabu: { buka: '08:00', tutup: '17:00', aktif: true },
                kamis: { buka: '08:00', tutup: '17:00', aktif: true },
                jumat: { buka: '08:00', tutup: '17:00', aktif: true },
                sabtu: { buka: '08:00', tutup: '12:00', aktif: true },
                minggu: { buka: '00:00', tutup: '00:00', aktif: false },
            })
        ]);
    }

    // Create indexes if not exists
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_ruangan ON visits(ruangan)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_visit_time ON visits(visit_time)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_nim ON visits(nim)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_room_time ON visits(ruangan, visit_time)`);

    // Migration: Add umur column if not exists
    try {
        db.run("ALTER TABLE visits ADD COLUMN umur INTEGER");
        console.log('✓ Added umur column to visits table');
    } catch (e) {
        // Column likely already exists, ignore
    }

    // Migration: Add locker_number column if not exists
    try {
        db.run("ALTER TABLE visits ADD COLUMN locker_number TEXT");
        console.log('✓ Added locker_number column to visits table');
    } catch (e) {
        // Column likely already exists, ignore
    }

    // Migration: Add locker_returned_at column if not exists
    try {
        db.run("ALTER TABLE visits ADD COLUMN locker_returned_at DATETIME DEFAULT NULL");
        console.log('✓ Added locker_returned_at column to visits table');
    } catch (e) {
        // Column likely already exists, ignore
    }

    console.log('✓ Database schema initialized');

    // Save to file (initial save is synchronous)
    flushDatabase();

    return db;
}

// Internal: immediate synchronous write
function flushDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Debounced save: batches writes to at most once per 5 seconds
// Prevents event loop blocking during high traffic
let saveTimer = null;
function saveDatabase() {
    if (saveTimer) return; // Already scheduled
    saveTimer = setTimeout(() => {
        flushDatabase();
        saveTimer = null;
    }, 5000);
}

// Graceful shutdown: flush pending writes before exit
function handleShutdown() {
    if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
    }
    flushDatabase();
    console.log('✓ Database flushed to disk');
    process.exit(0);
}
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

function getDb() {
    return db;
}

module.exports = { initDatabase, getDb, saveDatabase };
