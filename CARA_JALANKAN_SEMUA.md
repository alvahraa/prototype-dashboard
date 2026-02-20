# Cara Menjalankan Semua Server

Panduan untuk menjalankan Dashboard, Backend API, dan Form Absensi sekaligus.

## Metode 1: Menggunakan Script (Paling Mudah)

### Windows:
```bash
start-all.bat
```

### Linux/Mac:
```bash
chmod +x start-all.sh
./start-all.sh
```

Script ini akan otomatis menjalankan:
1. Backend API di port 3001
2. Frontend Dashboard di port 3000
3. Form Absensi di port 8080

## Metode 2: Manual (3 Terminal Terpisah)

### Terminal 1: Backend API
```bash
cd backend
npm install
npm start
```
Backend akan berjalan di: http://localhost:3001

### Terminal 2: Frontend Dashboard
```bash
npm install
npm start
```
Frontend akan berjalan di: http://localhost:3000

### Terminal 3: Form Absensi (Opsional)
```bash
cd form-absensi
python -m http.server 8080
```
Form Absensi akan berjalan di: http://localhost:8080

**ATAU** buka langsung di browser:
```
file:///path/to/form-absensi/index.html
```

## URL Aplikasi

Setelah semua server berjalan:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Form Absensi**: http://localhost:8080 (jika menggunakan server)
  atau buka langsung file `form-absensi/index.html` di browser

## Catatan Penting

1. **Backend harus berjalan terlebih dahulu** sebelum frontend dan form absensi bisa digunakan
2. Form Absensi membutuhkan Backend API untuk menyimpan data
3. Jika port sudah digunakan, ubah port di konfigurasi masing-masing

## Troubleshooting

### Port sudah digunakan?
- Backend (3001): Ubah di `backend/server.js` atau set `PORT` environment variable
- Frontend (3000): React akan otomatis cari port lain (3001, 3002, dll)
- Form Absensi (8080): Ubah port di command `python -m http.server <port>`

### Backend tidak bisa start?
- Pastikan dependencies sudah terinstall: `cd backend && npm install`
- Check apakah port 3001 sudah digunakan
- Check logs untuk error

### Frontend tidak bisa start?
- Pastikan dependencies sudah terinstall: `npm install`
- Check apakah ada error di console
- Pastikan backend sudah berjalan

### Form Absensi tidak bisa submit?
- Pastikan Backend API sudah berjalan di port 3001
- Check console browser untuk error
- Pastikan CORS sudah dikonfigurasi dengan benar di backend

## Menghentikan Server

### Jika menggunakan script:
- Tekan `Ctrl+C` di terminal
- Atau tutup window terminal yang terbuka

### Jika manual:
- Tekan `Ctrl+C` di masing-masing terminal

---

**Selamat! Semua server sudah berjalan!**

