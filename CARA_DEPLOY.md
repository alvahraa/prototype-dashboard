# Cara Deploy Aplikasi Perpustakaan Dashboard

## Ringkasan

Aplikasi Anda sudah siap untuk di-deploy ke hosting Node.js! Saya telah menyiapkan semua file yang diperlukan.

## Menjalankan di Komputer Sendiri

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
- Perubahan hanya mempengaruhi production mode (saat NODE_ENV=production)

## Yang Sudah Disiapkan

1. **Backend Server** (`backend/server.js`)
   - Sudah dikonfigurasi untuk serve static files React di production
   - CORS sudah dikonfigurasi untuk production domain
   - Auto-detect environment (development/production)

2. **Environment Variables**
   - File `.env.example` untuk konfigurasi
   - File `backend/.env.example` untuk backend

3. **Deployment Scripts**
   - `deploy.sh` (untuk Linux/Mac)
   - `deploy.bat` (untuk Windows)
   - `ecosystem.config.js` (untuk PM2)

4. **Dokumentasi**
   - `DEPLOYMENT.md` - Panduan lengkap
   - `QUICK_START_DEPLOYMENT.md` - Panduan cepat

## Langkah-Langkah Deploy

### Opsi 1: Menggunakan Script (Paling Mudah)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opsi 2: Manual

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Build React app
npm run build

# 3. Setup environment variables
# - Copy .env.example menjadi .env
# - Copy backend/.env.example menjadi backend/.env
# - Edit dengan konfigurasi yang benar
```

### Upload ke Server

1. Upload seluruh folder ke hosting Node.js Anda
2. SSH ke server
3. Install dependencies (jika belum):
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```
4. Setup environment variables di server
5. Jalankan aplikasi:
   ```bash
   cd backend
   npm start
   ```

**Dengan PM2 (Recommended):**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name perpustakaan-api
pm2 save
pm2 startup
```

## ⚙️ Konfigurasi Environment Variables

### File `.env` (di root project)

```env
REACT_APP_DATA_MODE=production
REACT_APP_BACKEND_URL=https://your-domain.com/api
REACT_APP_GATE_API_URL=https://gate.unisula.ac.id/api/gate
REACT_APP_SLIMS_API_URL=https://slims.unisula.ac.id/api
```

### File `backend/.env`

```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com,https://www.unisula.ac.id
```

**PENTING:** Ganti semua URL dengan URL hosting Anda yang sebenarnya!

## Platform Hosting yang Direkomendasikan

### 1. Railway (Paling Mudah)
- Free tier tersedia (dengan batasan)
- Auto-deploy dari GitHub
- Setup dalam 5 menit
- Harga: Free tier tersedia, paid mulai dari $5/bulan
- Website: https://railway.app

### 2. Render
- Free tier dengan SSL
- Auto-deploy dari Git
- Harga: Free tier tersedia, paid mulai dari $7/bulan
- Website: https://render.com

### 3. VPS (DigitalOcean, Vultr, dll)
- Lebih murah untuk jangka panjang
- Full control
- Perlu setup manual
- Harga: Mulai dari $4-6/bulan

## Informasi Biaya Hosting

### Hosting Gratis (Free Tier)
- **Railway**: Free tier tersedia dengan batasan (500 jam/bulan, perlu kartu kredit)
- **Render**: Free tier tersedia dengan batasan (sleep setelah 15 menit tidak aktif)
- **Vercel/Netlify**: Tidak cocok untuk aplikasi ini (khusus frontend static)

### Hosting Berbayar (Recommended untuk Production)
- **Railway**: Mulai dari $5/bulan
- **Render**: Mulai dari $7/bulan
- **DigitalOcean App Platform**: Mulai dari $5/bulan
- **VPS (DigitalOcean/Vultr)**: Mulai dari $4-6/bulan (paling murah untuk jangka panjang)

### Rekomendasi
- **Untuk Testing/Development**: Gunakan free tier Railway atau Render
- **Untuk Production**: VPS lebih murah untuk jangka panjang ($4-6/bulan)
- **Untuk Kemudahan**: Railway atau Render ($5-7/bulan, lebih mudah setup)

## Checklist Sebelum Deploy

- [ ] Build berhasil (`npm run build` - folder `build/` ada)
- [ ] Environment variables sudah dikonfigurasi
- [ ] URL di `.env` sudah sesuai dengan hosting Anda
- [ ] CORS `ALLOWED_ORIGINS` sudah di-set
- [ ] Dependencies terinstall di server
- [ ] Port sudah benar (default: 3001)

## Troubleshooting

### Aplikasi tidak bisa diakses
- Check apakah aplikasi berjalan: `pm2 list` atau `ps aux | grep node`
- Check port sudah benar
- Check firewall settings

### CORS Error
- Pastikan `ALLOWED_ORIGINS` di `backend/.env` sudah benar
- Include protocol (https://) di URL
- Restart server setelah mengubah `.env`

### Build gagal
- Pastikan Node.js versi 16+
- Hapus `node_modules` dan install ulang

## Dokumentasi Lengkap

Untuk panduan lebih detail, lihat:
- `DEPLOYMENT.md` - Panduan lengkap dengan troubleshooting
- `QUICK_START_DEPLOYMENT.md` - Quick start guide

## Tips

1. **Gunakan PM2** untuk process management (auto-restart jika crash)
2. **Setup SSL/HTTPS** jika menggunakan domain
3. **Backup database** secara berkala
4. **Monitor logs** dengan `pm2 logs perpustakaan-api`

---

**Selamat! Aplikasi Anda siap untuk di-deploy!**

Jika ada pertanyaan, silakan buka `DEPLOYMENT.md` untuk panduan lengkap.

