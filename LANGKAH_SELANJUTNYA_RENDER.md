# Langkah Selanjutnya Setelah Setup File untuk Render

Anda sudah membuat file untuk deploy ke Render. Sekarang ikuti langkah-langkah berikut:

## File yang Sudah Disiapkan

1. `render-build.sh` - Script untuk build di Render
2. `render.yaml` - Konfigurasi Render (opsional)
3. `DEPLOY_RENDER.md` - Panduan lengkap deploy ke Render

## Langkah-Langkah Deploy ke Render

### Langkah 1: Pastikan Kode Sudah di GitHub

```bash
# Check status
git status

# Jika ada perubahan, commit dan push
git add .
git commit -m "Add Render deployment files"
git push origin main
```

### Langkah 2: Buat Akun Render (Jika Belum)

1. Buka https://render.com
2. Klik "Get Started for Free"
3. Sign up dengan GitHub (paling mudah)
4. Authorize Render untuk akses repository

### Langkah 3: Buat Web Service di Render

1. Di dashboard Render, klik **"New +"**
2. Pilih **"Web Service"**
3. Connect repository GitHub Anda
   - Pilih repository `perpustakaan-dashboard`
   - Klik **"Connect"**

### Langkah 4: Konfigurasi Build & Start

Di halaman konfigurasi, isi:

**Name:**
```
perpustakaan-dashboard
```

**Environment:**
```
Node
```

**Build Command:**
```bash
chmod +x render-build.sh && ./render-build.sh
```
ATAU manual:
```bash
npm install && cd backend && npm install && cd .. && npm run build
```

**Start Command:**
```bash
cd backend && node server.js
```

**Plan:**
- Pilih **Free** untuk testing
- Atau **Starter** ($7/bulan) untuk production

### Langkah 5: Setup Environment Variables

Scroll ke bagian **"Environment Variables"**, tambahkan:

**Wajib:**
```
NODE_ENV = production
PORT = 3001
REACT_APP_DATA_MODE = production
REACT_APP_REFRESH_INTERVAL = 0
REACT_APP_REQUEST_TIMEOUT_MS = 8000
```

**Setelah Deploy (Update dengan URL Render Anda):**
```
REACT_APP_BACKEND_URL = https://your-app-name.onrender.com/api
ALLOWED_ORIGINS = https://your-app-name.onrender.com
```

**Opsional (jika ada):**
```
REACT_APP_GATE_API_URL = https://gate.unisula.ac.id/api/gate
REACT_APP_GATE_API_KEY = your-api-key
REACT_APP_SLIMS_API_URL = https://slims.unisula.ac.id/api
REACT_APP_SLIMS_API_KEY = your-api-key
```

### Langkah 6: Deploy

1. Klik **"Create Web Service"**
2. Tunggu build selesai (5-10 menit pertama kali)
3. Setelah selesai, dapatkan URL aplikasi

### Langkah 7: Update Environment Variables dengan URL

Setelah deploy selesai, Anda akan dapat URL seperti:
```
https://perpustakaan-dashboard-xxxx.onrender.com
```

**Update environment variables:**
1. Masuk ke dashboard Render
2. Klik aplikasi Anda
3. Tab **"Environment"**
4. Update:
   - `REACT_APP_BACKEND_URL` = `https://your-app-name.onrender.com/api`
   - `ALLOWED_ORIGINS` = `https://your-app-name.onrender.com`
5. Klik **"Save Changes"**
6. Render akan otomatis redeploy

### Langkah 8: Test Aplikasi

1. Buka URL aplikasi di browser
2. Test semua fitur
3. Check console browser untuk error
4. Check logs di Render dashboard

## Checklist

- [ ] Kode sudah di-push ke GitHub
- [ ] Akun Render sudah dibuat
- [ ] Web Service sudah dibuat di Render
- [ ] Build command sudah di-set
- [ ] Start command sudah di-set
- [ ] Environment variables sudah di-set
- [ ] Deploy sudah selesai
- [ ] URL aplikasi sudah didapat
- [ ] Environment variables sudah di-update dengan URL Render
- [ ] Aplikasi sudah di-test

## Troubleshooting Cepat

### Build gagal?
- Check logs di Render dashboard
- Pastikan semua dependencies ada di package.json

### Aplikasi tidak bisa diakses?
- Check status di dashboard (harus "Live")
- Check logs untuk error
- Pastikan PORT = 3001

### CORS Error?
- Pastikan `ALLOWED_ORIGINS` sudah di-set dengan URL lengkap
- Restart aplikasi

### Environment variables tidak ter-load?
- Pastikan sudah di-set di Render dashboard
- Redeploy setelah mengubah environment variables

## Dokumentasi Lengkap

Untuk panduan lebih detail, lihat:
- `DEPLOY_RENDER.md` - Panduan lengkap step-by-step

## Catatan Penting

1. **Free Tier**: Aplikasi akan sleep setelah 15 menit tidak aktif. Akan wake up otomatis saat ada request (butuh ~30 detik).

2. **Database**: SQLite database akan tersimpan di `backend/data/`. Data akan persist selama aplikasi tidak di-hapus.

3. **Auto-Deploy**: Render akan otomatis deploy setiap kali Anda push ke GitHub (jika auto-deploy enabled).

4. **Custom Domain**: Bisa setup custom domain di tab "Settings" > "Custom Domains".

---

**Selamat! Ikuti langkah-langkah di atas untuk deploy aplikasi Anda ke Render!**

