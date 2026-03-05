# Dashboard Analytics - Perpustakaan UNISSULA

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Sistem dashboard analytics untuk monitoring data kunjungan, peminjaman buku, dan operasional Perpustakaan UNISSULA.**

</div>

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Deploy ke Server (Production)](#deploy-ke-server-production)
- [Struktur Folder](#struktur-folder)
- [Akun Default](#akun-default)
- [Lisensi](#lisensi)

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard Overview** | KPI cards, trend kunjungan, dan statistik ringkas |
| **Analisis Kunjungan** | Peak hours, distribusi fakultas, log pengunjung |
| **Analisis Peminjaman** | Trend bulanan, keterlambatan |
| **Manajemen Loker** | Tracking peminjaman & pengembalian loker |
| **Jam Operasional** | Konfigurasi jam buka/tutup per hari |
| **Form Absensi** | Form kunjungan yang bisa diakses publik |
| **Multi-Ruangan** | Audiovisual, BI Corner, Karel, Referensi, Sirkulasi, SmartLab |
| **Dark Mode** | Tema gelap profesional dengan sinkronisasi otomatis |
| **Admin Panel** | Manajemen admin, appearance, dan pengaturan |
| **Export Excel** | Export data kunjungan dan peminjaman ke Excel |

---

## Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **React 18** | Frontend UI |
| **Tailwind CSS 3** | Styling |
| **Recharts** | Visualisasi data & grafik |
| **Framer Motion** | Animasi & transisi |
| **Node.js + Express** | Backend API |
| **PostgreSQL** | Database (via Neon atau lokal) |
| **PM2** | Process manager untuk production |

---

## Prasyarat

Pastikan sudah terinstall di komputer/server:

| Software | Versi Minimum | Download |
|----------|---------------|----------|
| **Node.js** | v18.x atau lebih baru | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.x (otomatis dengan Node.js) | — |
| **Git** | Terbaru | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | v15+ (atau gunakan Neon cloud) | [postgresql.org](https://www.postgresql.org/download/) |

---

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/alvahraa/prototype-dashboard.git
cd prototype-dashboard
```

### 2. Install Dependencies Frontend

```bash
npm install
```

### 3. Install Dependencies Backend

```bash
cd backend
npm install
cd ..
```

### 4. Konfigurasi Environment

Salin file contoh environment:

```bash
# Untuk backend
copy .env.example .env
```

> Di Linux/Mac gunakan `cp .env.example .env`

Edit file `.env` dan isi dengan konfigurasi yang sesuai. Lihat bagian [Konfigurasi Environment](#konfigurasi-environment) untuk detail setiap variabel.

### 5. Setup Database

Jika menggunakan **PostgreSQL lokal**:

```sql
-- Buat database baru
CREATE DATABASE perpustakaan_unissula;
```

Kemudian isi `DATABASE_URL` di file `.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/perpustakaan_unissula
```

Jika menggunakan **Neon (cloud PostgreSQL)**, dapatkan connection string dari dashboard Neon dan masukkan ke `DATABASE_URL`.

> **Catatan:** Tabel database akan dibuat otomatis saat server pertama kali dijalankan.

---

## Konfigurasi Environment

Buat file `.env` di root project. Variabel yang dibutuhkan:

```env
# === DATABASE ===
# Connection string PostgreSQL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://username:password@localhost:5432/perpustakaan_unissula

# === KEAMANAN ===
# Secret key untuk JWT authentication (ganti dengan string random yang kuat)
JWT_SECRET=ganti-dengan-secret-key-yang-kuat-dan-panjang

# === SERVER ===
# Port untuk backend API (default: 3001)
PORT=3001

# === FRONTEND (opsional) ===
# Mode data: 'dummy' untuk demo, 'production' untuk data real
REACT_APP_DATA_MODE=production

# URL backend API (untuk koneksi frontend ke backend)
REACT_APP_API_URL=http://localhost:3001

# Interval refresh data dalam milidetik (default: 300000 = 5 menit)
REACT_APP_REFRESH_INTERVAL=300000
```

> ⚠️ **PENTING:** Jangan pernah commit file `.env` ke Git. File ini sudah ada di `.gitignore`.

---

## Menjalankan Aplikasi

### Mode Development (untuk testing lokal)

Jalankan **dua terminal** secara bersamaan:

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
```
Server API akan berjalan di `http://localhost:3001`

**Terminal 2 — Frontend:**
```bash
npm start
```
Dashboard akan terbuka di `http://localhost:3000`

### Cara Cepat (Windows)

Gunakan script otomatis:
```bash
start-all.bat
```

### Cara Cepat (Linux/Mac)

```bash
chmod +x start-all.sh
./start-all.sh
```

---

## Deploy ke Server (Production)

### Langkah 1: Build Frontend

```bash
npm run build
```

Ini akan menghasilkan folder `build/` berisi file statis yang siap di-serve.

### Langkah 2: Konfigurasi Environment Production

Buat file `.env` di server:

```env
DATABASE_URL=postgresql://user:password@host:5432/perpustakaan_unissula
JWT_SECRET=secret-key-production-yang-sangat-kuat
PORT=3001
NODE_ENV=production
```

### Langkah 3: Jalankan dengan PM2

Install PM2 secara global:
```bash
npm install -g pm2
```

Jalankan server:
```bash
pm2 start ecosystem.config.js --env production
```

Perintah PM2 yang berguna:
```bash
pm2 status              # Lihat status server
pm2 logs perpustakaan-api  # Lihat log
pm2 restart perpustakaan-api  # Restart server
pm2 stop perpustakaan-api     # Stop server
pm2 save                # Simpan konfigurasi agar auto-start saat reboot
pm2 startup             # Setup auto-start saat booting
```

### Langkah 4: Setup Reverse Proxy (Opsional, Rekomendasi)

Jika menggunakan **Nginx** sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name perpustakaan.unissula.ac.id;

    # Frontend (file statis dari build/)
    location / {
        root /path/to/prototype-dashboard/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Form Absensi
    location /absensi/ {
        proxy_pass http://localhost:3001;
    }
}
```

---

## Struktur Folder

```
prototype-dashboard/
│
├── backend/                  # Backend API (Node.js + Express)
│   ├── server.js             # Entry point server
│   ├── database.js           # Koneksi & inisialisasi database
│   ├── middleware/            # Middleware (auth, dll)
│   ├── routes/               # API endpoints
│   │   ├── auth.js           # Login & manajemen admin
│   │   ├── visits.js         # Data kunjungan & statistik
│   │   └── settings.js       # Pengaturan aplikasi
│   └── package.json
│
├── src/                      # Frontend React
│   ├── components/           # Komponen UI
│   │   ├── Common/           # Komponen shared (Tabs, DatePicker, dll)
│   │   ├── Dashboard/        # KPI Cards, Chart, dll
│   │   ├── Layout/           # Sidebar, Header
│   │   ├── Visitors/         # Komponen halaman kunjungan
│   │   ├── Loans/            # Komponen halaman peminjaman
│   │   ├── Audiovisual/      # Ruang audiovisual
│   │   ├── BICorner/         # BI Corner
│   │   ├── Karel/            # Ruang Karel
│   │   ├── Referensi/        # Ruang referensi
│   │   ├── Sirkulasi/        # Sirkulasi
│   │   └── SmartLab/         # SmartLab
│   ├── pages/                # Halaman-halaman utama
│   ├── services/             # Service layer (API calls)
│   ├── utils/                # Utility functions (analytics, export)
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React context (state global)
│   ├── App.js                # Root component
│   └── index.css             # Global styles
│
├── public/                   # File statis
│   ├── absensi/              # Form absensi (standalone HTML)
│   └── images/               # Gambar & aset
│
├── api/                      # Vercel serverless entry point
│   └── index.js
│
├── .env.example              # Template konfigurasi environment
├── ecosystem.config.js       # Konfigurasi PM2 untuk production
├── start-all.bat             # Script start (Windows)
├── start-all.sh              # Script start (Linux/Mac)
├── vercel.json               # Konfigurasi Vercel deployment
├── tailwind.config.js        # Konfigurasi Tailwind CSS
├── package.json              # Dependencies frontend
└── README.md                 # Dokumentasi ini
```

### File Penting untuk Instalasi

| File/Folder | Fungsi | Wajib? |
|-------------|--------|--------|
| `.env` | Konfigurasi database, JWT, port | ✅ Ya |
| `backend/` | Seluruh backend API | ✅ Ya |
| `src/` | Seluruh source code frontend | ✅ Ya |
| `public/` | File statis & form absensi | ✅ Ya |
| `package.json` | Dependencies | ✅ Ya |
| `build/` | Hasil build (generate sendiri) | ⚠️ Untuk production |
| `ecosystem.config.js` | PM2 config | ⚠️ Jika pakai PM2 |
| `vercel.json` | Vercel config | ❌ Hanya untuk Vercel |

---

## Akun Default

Saat pertama kali dijalankan, sistem akan otomatis membuat akun admin default:

| Field | Nilai |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **PENTING:** Segera ubah password default setelah login pertama melalui menu Admin.

---

## Form Absensi

Form kunjungan dapat diakses di:
```
http://localhost:3001/absensi
```

Di production:
```
https://domain-anda.com/absensi
```

Form ini bisa dibuka di tablet atau komputer yang diletakkan di meja resepsionis perpustakaan.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `npm install` gagal | Pastikan Node.js v18+ terinstall, hapus `node_modules` & `package-lock.json` lalu coba lagi |
| Database connection error | Periksa `DATABASE_URL` di `.env`, pastikan PostgreSQL aktif |
| Port sudah dipakai | Ganti `PORT` di `.env` ke port lain (misal: 3002) |
| Halaman blank setelah build | Pastikan `homepage` di `package.json` sesuai dengan URL deploy |
| Form absensi tidak muncul | Pastikan backend berjalan dan akses via `/absensi` |

---

## Lisensi

Software ini dilisensikan kepada Perpustakaan UNISSULA dengan **hak penuh** untuk menggunakan, memodifikasi, dan mengembangkan.  
Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

<div align="center">

**Dikembangkan oleh Alvah Rabbany**  
Email: alvahrabbany22@gmail.com | GitHub: [alvahraa](https://github.com/alvahraa)  
untuk **Perpustakaan Universitas Islam Sultan Agung (UNISSULA)**

(c) 2026 Alvah Rabbany

</div>
