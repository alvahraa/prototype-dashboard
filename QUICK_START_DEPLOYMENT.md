# Quick Start Deployment Guide

Panduan cepat untuk deploy aplikasi Perpustakaan Dashboard ke hosting Node.js.

## Langkah Cepat (5 Menit)

### 1. Build Aplikasi

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Manual:**
```bash
npm install
cd backend && npm install && cd ..
npm run build
```

### 2. Setup Environment Variables

**Buat file `.env` di root:**
```env
REACT_APP_DATA_MODE=production
REACT_APP_BACKEND_URL=https://your-domain.com/api
```

**Buat file `backend/.env`:**
```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com
```

### 3. Upload ke Server

Upload seluruh folder ke hosting Node.js Anda.

### 4. Jalankan di Server

```bash
cd backend
npm install
npm start
```

**Dengan PM2 (Recommended):**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name perpustakaan-api
pm2 save
```

## Platform Hosting Cepat

### Railway (Paling Mudah)
- Harga: Free tier tersedia, paid mulai $5/bulan
1. Sign up di https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy otomatis

### Render
- Harga: Free tier tersedia, paid mulai $7/bulan
1. Create Web Service di https://render.com
2. Connect repository
3. Build: `npm install && cd backend && npm install && cd .. && npm run build`
4. Start: `cd backend && node server.js`

## Menjalankan di Komputer Sendiri

YA, aplikasi tetap bisa dijalankan di komputer sendiri seperti biasa:

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
npm start
```

Tidak ada perubahan pada cara development. Perubahan hanya untuk production deployment.

## Checklist

- [ ] Build berhasil (`build/` folder ada)
- [ ] Environment variables sudah di-set
- [ ] Dependencies terinstall di server
- [ ] Aplikasi berjalan (check dengan `pm2 list`)

## Dokumentasi Lengkap

Lihat `DEPLOYMENT.md` untuk panduan lengkap dan troubleshooting.

---

**Selamat Deploy!**

