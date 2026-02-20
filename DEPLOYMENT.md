# Panduan Deployment - Perpustakaan Dashboard

Panduan lengkap untuk meng-deploy aplikasi Perpustakaan Dashboard ke hosting Node.js.

## Daftar Isi

1. [Persiapan](#persiapan)
2. [Build Aplikasi](#build-aplikasi)
3. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
4. [Deployment ke Hosting Node.js](#deployment-ke-hosting-nodejs)
5. [Platform Hosting yang Direkomendasikan](#platform-hosting-yang-direkomendasikan)
6. [Troubleshooting](#troubleshooting)

---

## Menjalankan di Komputer Sendiri (Development)

**YA, Anda tetap bisa menjalankan aplikasi di komputer sendiri!**

Perubahan yang dibuat TIDAK mengganggu cara menjalankan aplikasi di development mode. Untuk menjalankan di komputer sendiri:

```bash
# Terminal 1: Jalankan backend
cd backend
npm install
npm start

# Terminal 2: Jalankan frontend
npm install
npm start
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

**Catatan:** 
- Di development mode, backend TIDAK akan serve static files React
- Frontend dan backend berjalan terpisah (seperti sebelumnya)
- Semua fitur development tetap berfungsi normal

---

## Persiapan

### 1. Persyaratan Sistem

- **Node.js**: Versi 16 atau lebih tinggi
- **npm**: Versi 7 atau lebih tinggi
- **Git**: Untuk clone repository (opsional)

### 2. File yang Diperlukan

Pastikan Anda memiliki:
- File `.env` dengan konfigurasi yang benar
- Database SQLite (akan dibuat otomatis jika belum ada)
- Akses ke hosting Node.js (opsional - aplikasi tetap bisa dijalankan di komputer sendiri)

---

## Build Aplikasi

### Langkah 1: Install Dependencies

```bash
# Install dependencies untuk frontend
npm install

# Install dependencies untuk backend
cd backend
npm install
cd ..
```

### Langkah 2: Build Frontend React

```bash
# Build aplikasi React untuk production
npm run build
```

Ini akan membuat folder `build/` yang berisi file-file statis yang siap di-deploy.

### Langkah 3: Verifikasi Build

Pastikan folder `build/` telah dibuat dan berisi:
- `index.html`
- `static/` (folder dengan CSS, JS, dan assets)

---

## Konfigurasi Environment Variables

### 1. Buat File `.env` di Root Project

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

### 2. Buat File `.env` di Folder Backend

```bash
cp backend/.env.example backend/.env
```

### 3. Isi Konfigurasi

#### File `.env` (Root)

```env
# Mode production
REACT_APP_DATA_MODE=production

# URL Backend API (ganti dengan URL hosting Anda)
REACT_APP_BACKEND_URL=https://api.perpustakaan.unisula.ac.id/api

# Gate System API (jika ada)
REACT_APP_GATE_API_URL=https://gate.unisula.ac.id/api/gate
REACT_APP_GATE_API_KEY=your-api-key-here

# SLiMS API (jika ada)
REACT_APP_SLIMS_API_URL=https://slims.unisula.ac.id/api
REACT_APP_SLIMS_API_KEY=your-api-key-here

# Timeout settings
REACT_APP_REFRESH_INTERVAL=0
REACT_APP_REQUEST_TIMEOUT_MS=8000
```

#### File `backend/.env`

```env
NODE_ENV=production
PORT=3001

# CORS - Ganti dengan domain Anda
ALLOWED_ORIGINS=https://perpustakaan.unisula.ac.id,https://www.unisula.ac.id
```

**PENTING**: 
- Ganti semua URL dengan URL hosting Anda yang sebenarnya
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)

---

## Deployment ke Hosting Node.js

### Metode 1: Upload Manual

#### Langkah 1: Upload File ke Server

Upload seluruh folder project ke server hosting Anda menggunakan:
- **FTP/SFTP** (FileZilla, WinSCP, dll)
- **cPanel File Manager**
- **SSH** dengan `scp` atau `rsync`

#### Langkah 2: Install Dependencies di Server

SSH ke server Anda dan jalankan:

```bash
# Masuk ke folder project
cd /path/to/perpustakaan-dashboard

# Install dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Build frontend
npm run build
```

#### Langkah 3: Setup Environment Variables

Buat file `.env` dan `backend/.env` di server dengan konfigurasi yang sesuai.

#### Langkah 4: Jalankan Aplikasi

```bash
# Dari folder backend
cd backend
node server.js
```

Atau gunakan **PM2** untuk process management:

```bash
# Install PM2 global
npm install -g pm2

# Jalankan dengan PM2
cd backend
pm2 start server.js --name perpustakaan-api

# Simpan konfigurasi PM2
pm2 save
pm2 startup
```

### Metode 2: Menggunakan Git (Recommended)

#### Langkah 1: Push ke Repository

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Langkah 2: Clone di Server

```bash
# SSH ke server
ssh user@your-server.com

# Clone repository
git clone https://github.com/your-username/perpustakaan-dashboard.git
cd perpustakaan-dashboard
```

#### Langkah 3: Setup di Server

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Setup environment variables
cp .env.example .env
cp backend/.env.example backend/.env
# Edit file .env dengan konfigurasi yang benar
```

#### Langkah 4: Deploy dengan PM2

```bash
# Install PM2
npm install -g pm2

# Start aplikasi
cd backend
pm2 start server.js --name perpustakaan-api

# Setup auto-restart
pm2 save
pm2 startup
```

---

## Platform Hosting yang Direkomendasikan

### Informasi Biaya Hosting

**Hosting Gratis (Free Tier):**
- Railway: Free tier tersedia dengan batasan (500 jam/bulan, perlu kartu kredit untuk verifikasi)
- Render: Free tier tersedia dengan batasan (aplikasi akan sleep setelah 15 menit tidak aktif)

**Hosting Berbayar (Recommended untuk Production):**
- Railway: Mulai dari $5/bulan (sekitar Rp 75.000/bulan)
- Render: Mulai dari $7/bulan (sekitar Rp 105.000/bulan)
- DigitalOcean App Platform: Mulai dari $5/bulan
- VPS (DigitalOcean/Vultr): Mulai dari $4-6/bulan (sekitar Rp 60.000-90.000/bulan) - PALING MURAH untuk jangka panjang

**Rekomendasi:**
- Untuk testing/development: Gunakan free tier Railway atau Render
- Untuk production: VPS lebih murah untuk jangka panjang ($4-6/bulan)
- Untuk kemudahan: Railway atau Render ($5-7/bulan, lebih mudah setup)

### 1. **Railway** (Recommended untuk Pemula)
- Mudah digunakan
- Auto-deploy dari Git
- Free tier tersedia (dengan batasan)
- Harga: Free tier tersedia, paid mulai dari $5/bulan (sekitar Rp 75.000/bulan)
- Website: https://railway.app

**Setup Railway:**
1. Sign up di Railway
2. Connect GitHub repository
3. Add environment variables di dashboard
4. Deploy otomatis

### 2. **Render**
- Free tier dengan SSL
- Auto-deploy dari Git
- Easy setup
- Harga: Free tier tersedia, paid mulai dari $7/bulan (sekitar Rp 105.000/bulan)
- Website: https://render.com

**Setup Render:**
1. Create new Web Service
2. Connect repository
3. Build command: `cd backend && npm install && cd .. && npm install && npm run build`
4. Start command: `cd backend && node server.js`

### 3. **Heroku**
- Populer dan stabil
- Add-ons tersedia
- Free tier sudah tidak tersedia
- Harga: Mulai dari $7/bulan
- Website: https://heroku.com

### 4. **DigitalOcean App Platform**
- Simple pricing
- Auto-scaling
- Harga: Mulai dari $5/bulan
- Website: https://www.digitalocean.com/products/app-platform

### 5. **VPS (Virtual Private Server)**
- Full control
- Lebih murah untuk jangka panjang
- Perlu setup manual
- Harga: Mulai dari $4-6/bulan (sekitar Rp 60.000-90.000/bulan) - PALING MURAH
- Rekomendasi: DigitalOcean, Vultr, Linode

**Setup VPS dengan PM2:**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Setup aplikasi (ikuti langkah di atas)
# ...

# Setup Nginx sebagai reverse proxy (opsional)
sudo apt install nginx
```

---

## Konfigurasi Nginx (Opsional)

Jika menggunakan VPS, Anda bisa setup Nginx sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name perpustakaan.unisula.ac.id;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Troubleshooting

### Problem: Aplikasi tidak bisa diakses

**Solusi:**
1. Pastikan port sudah benar di environment variable
2. Check firewall settings di server
3. Pastikan aplikasi berjalan: `pm2 list` atau `ps aux | grep node`

### Problem: CORS Error

**Solusi:**
1. Pastikan `ALLOWED_ORIGINS` di `backend/.env` sudah benar
2. Include domain lengkap dengan protocol (https://)
3. Restart server setelah mengubah `.env`

### Problem: Build gagal

**Solusi:**
1. Pastikan Node.js versi 16+
2. Hapus `node_modules` dan install ulang:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Problem: Database tidak terbuat

**Solusi:**
1. Pastikan folder `backend/data/` ada dan writable
2. Check permissions: `chmod 755 backend/data/`

### Problem: Static files tidak ter-load

**Solusi:**
1. Pastikan `npm run build` sudah dijalankan
2. Pastikan folder `build/` ada di root project
3. Check path di `backend/server.js` sudah benar

---

## Checklist Deployment

Sebelum go-live, pastikan:

- [ ] Environment variables sudah dikonfigurasi dengan benar
- [ ] Frontend sudah di-build (`npm run build`)
- [ ] Backend dependencies sudah terinstall
- [ ] Database folder ada dan writable
- [ ] CORS sudah dikonfigurasi untuk domain production
- [ ] Aplikasi berjalan dengan PM2 atau process manager
- [ ] SSL/HTTPS sudah setup (jika menggunakan domain)
- [ ] Backup database sudah dibuat
- [ ] Monitoring/logging sudah setup

---

## Support

Jika mengalami masalah, silakan:
1. Check log aplikasi: `pm2 logs perpustakaan-api`
2. Check error di browser console
3. Buat issue di GitHub repository

---

**Selamat Deploy!**

