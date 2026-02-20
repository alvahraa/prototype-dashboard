# Panduan Deploy ke Render

Panduan lengkap step-by-step untuk deploy aplikasi Perpustakaan Dashboard ke Render.

## Persiapan

1. Pastikan Anda sudah punya akun GitHub (gratis)
2. Pastikan kode sudah di-push ke GitHub repository
3. Buat akun Render di https://render.com (gratis)

## Langkah-Langkah Deploy

### Langkah 1: Push Kode ke GitHub

Jika belum, push kode Anda ke GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Langkah 2: Buat Web Service di Render

1. Login ke https://render.com
2. Klik tombol **"New +"** di dashboard
3. Pilih **"Web Service"**
4. Connect repository GitHub Anda
   - Jika belum connect, klik "Configure account" dan authorize Render
   - Pilih repository `perpustakaan-dashboard`
5. Klik **"Connect"**

### Langkah 3: Konfigurasi Build & Start Commands

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
npm install && cd backend && npm install && cd .. && npm run build
```

**Start Command:**
```bash
cd backend && node server.js
```

**Plan:**
- Pilih **Free** untuk testing (dengan batasan)
- Atau **Starter** ($7/bulan) untuk production

### Langkah 4: Setup Environment Variables

Scroll ke bawah ke bagian **"Environment Variables"**, klik **"Add Environment Variable"** dan tambahkan:

**1. NODE_ENV**
```
Key: NODE_ENV
Value: production
```

**2. PORT**
```
Key: PORT
Value: 3001
```

**3. REACT_APP_DATA_MODE**
```
Key: REACT_APP_DATA_MODE
Value: production
```

**4. REACT_APP_BACKEND_URL**
```
Key: REACT_APP_BACKEND_URL
Value: https://your-app-name.onrender.com/api
```
*Ganti `your-app-name` dengan nama aplikasi Anda di Render*

**5. ALLOWED_ORIGINS**
```
Key: ALLOWED_ORIGINS
Value: https://your-app-name.onrender.com
```
*Ganti `your-app-name` dengan nama aplikasi Anda di Render*

**6. REACT_APP_GATE_API_URL** (jika ada)
```
Key: REACT_APP_GATE_API_URL
Value: https://gate.unisula.ac.id/api/gate
```

**7. REACT_APP_GATE_API_KEY** (jika ada)
```
Key: REACT_APP_GATE_API_KEY
Value: your-api-key-here
```

**8. REACT_APP_SLIMS_API_URL** (jika ada)
```
Key: REACT_APP_SLIMS_API_URL
Value: https://slims.unisula.ac.id/api
```

**9. REACT_APP_SLIMS_API_KEY** (jika ada)
```
Key: REACT_APP_SLIMS_API_KEY
Value: your-api-key-here
```

**10. REACT_APP_REFRESH_INTERVAL**
```
Key: REACT_APP_REFRESH_INTERVAL
Value: 0
```

**11. REACT_APP_REQUEST_TIMEOUT_MS**
```
Key: REACT_APP_REQUEST_TIMEOUT_MS
Value: 8000
```

### Langkah 5: Deploy

1. Klik tombol **"Create Web Service"** di bagian bawah
2. Render akan mulai build dan deploy aplikasi Anda
3. Tunggu proses build selesai (biasanya 5-10 menit pertama kali)
4. Setelah selesai, aplikasi akan otomatis online!

### Langkah 6: Dapatkan URL Aplikasi

Setelah deploy selesai, Anda akan mendapat URL seperti:
```
https://perpustakaan-dashboard.onrender.com
```

**PENTING:** Setelah mendapat URL, update environment variable:
- `REACT_APP_BACKEND_URL` menjadi: `https://perpustakaan-dashboard.onrender.com/api`
- `ALLOWED_ORIGINS` menjadi: `https://perpustakaan-dashboard.onrender.com`

Lalu **redeploy** aplikasi (Render akan auto-redeploy jika ada perubahan di GitHub, atau klik "Manual Deploy" di dashboard).

## Setelah Deploy

### Update Environment Variables dengan URL yang Benar

1. Masuk ke dashboard Render
2. Klik aplikasi Anda
3. Masuk ke tab **"Environment"**
4. Update:
   - `REACT_APP_BACKEND_URL`: `https://your-app-name.onrender.com/api`
   - `ALLOWED_ORIGINS`: `https://your-app-name.onrender.com`
5. Klik **"Save Changes"**
6. Render akan otomatis redeploy

### Verifikasi Aplikasi

1. Buka URL aplikasi di browser
2. Test semua fitur
3. Check console browser untuk error
4. Check logs di Render dashboard (tab "Logs")

## Troubleshooting

### Problem: Build gagal

**Solusi:**
1. Check logs di Render dashboard
2. Pastikan Node.js version di Render sesuai (Render otomatis detect)
3. Pastikan semua dependencies terinstall dengan benar

### Problem: Aplikasi tidak bisa diakses

**Solusi:**
1. Check apakah aplikasi sudah selesai deploy (status "Live")
2. Check logs untuk error
3. Pastikan PORT sudah benar (3001)
4. Pastikan start command benar: `cd backend && node server.js`

### Problem: CORS Error

**Solusi:**
1. Pastikan `ALLOWED_ORIGINS` sudah di-set dengan URL lengkap (dengan https://)
2. Restart aplikasi di Render dashboard

### Problem: Environment variables tidak ter-load

**Solusi:**
1. Pastikan semua environment variables sudah di-set di Render dashboard
2. Redeploy aplikasi setelah mengubah environment variables
3. Pastikan nama variable benar (case-sensitive)

### Problem: Aplikasi sleep (Free tier)

**Solusi:**
- Free tier Render akan sleep setelah 15 menit tidak aktif
- Aplikasi akan wake up otomatis saat ada request (butuh waktu ~30 detik)
- Untuk menghindari sleep, upgrade ke paid plan ($7/bulan)

## Tips

1. **Gunakan Custom Domain (Opsional)**
   - Di Render dashboard, masuk ke tab "Settings"
   - Scroll ke "Custom Domains"
   - Tambahkan domain Anda (perlu setup DNS)

2. **Monitor Logs**
   - Selalu check logs di Render dashboard untuk debugging
   - Logs real-time tersedia di tab "Logs"

3. **Auto-Deploy**
   - Render akan otomatis deploy setiap kali Anda push ke GitHub
   - Atau bisa disable auto-deploy dan deploy manual

4. **Database Persistence**
   - SQLite database akan tersimpan di folder `backend/data/`
   - Data akan persist selama aplikasi tidak di-hapus
   - Untuk production, pertimbangkan menggunakan database eksternal

## Checklist Setelah Deploy

- [ ] Aplikasi bisa diakses via URL Render
- [ ] Semua environment variables sudah di-set
- [ ] `REACT_APP_BACKEND_URL` sudah update dengan URL Render
- [ ] `ALLOWED_ORIGINS` sudah update dengan URL Render
- [ ] Test semua fitur aplikasi
- [ ] Check logs tidak ada error
- [ ] Database bisa dibuat dan diakses

## Biaya

- **Free Tier**: Gratis, tapi aplikasi akan sleep setelah 15 menit tidak aktif
- **Starter Plan**: $7/bulan (sekitar Rp 105.000) - aplikasi tidak akan sleep, lebih cepat

## Support

Jika ada masalah:
1. Check logs di Render dashboard
2. Check dokumentasi Render: https://render.com/docs
3. Buat issue di GitHub repository

---

**Selamat! Aplikasi Anda sudah online di Render!**

