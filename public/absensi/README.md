# 📱 Form Absensi — Perpustakaan UNISSULA

<div align="center">

**Aplikasi Form Absensi Mandiri untuk Pengunjung Perpustakaan UNISSULA.**

</div>

---

## 🚀 Fitur Utama

- **Pilihan Ruangan Tersedia**: Pengunjung dapat memilih ruangan yang dituju secara langsung (contoh: Audiovisual, Referensi, Sirkulasi, dll).
- **Scan QR Code Ruangan**: Otomatis mencentang ruangan jika diakses melalui hasil scan QR Code khusus ruangan (parameter `?room=kode_ruangan`).
- **Peminjaman & Pengembalian Kunci Loker**: Mendukung alur peminjaman loker untuk penitipan barang dan pengembalian kunci mandiri.
- **Identifikasi Pengunjung**: Kolom pencatatan NIM, Nama, Prodi/Fakultas, Jenis Kelamin, dan Umur.

---

## 🛠️ Cara Penggunaan (Deployment/Hosting)

Form absensi ini adalah aplikasi frontend mandiri berbasis HTML, CSS, dan JavaScript Vanilla (Tanpa framework JSX/React).

Anda cukup **menghosting (deploy)** isi dari repositori ini ke layanan hosting statis manapun seperti:
- **Vercel** (Cukup hubungkan repo GitHub dan deploy, tidak perlu build settings khusus)
- **Netlify**
- **GitHub Pages**
- Server Apache / Nginx / cPanel (Cukup upload semua file ke dalam folder `public_html` atau direktori web yang sesuai).

### ⚙️ Konfigurasi Koneksi ke Backend (Dashboard)

Agar absensi berhasil dikirim ke server dashboard utama, pastikan untuk mengubah koneksi API di file `script.js`.

Buka file **`script.js`**, lalu perhatikan baris konfigurasi di bagian atas:

```javascript
const API_CONFIG = {
    // Ubah URL ini menjadi URL dari backend Dashboard Perpustakaan Anda
    // Contoh: 'https://backend-dashboard-anda.up.railway.app/api'
    baseUrl: 'https://backend-perpus.vercel.app/api', 
    useMockData: false
};
```

Ganti nilai `baseUrl` dengan link/domain API production dari server instalasi Dashboard Utama.

---

## 📝 Lisensi

Aplikasi Form Absensi ini merupakan bagian dari sistem manajemen perpustakaan yang dikembangkan khusus untuk UNISSULA.  
Perpustakaan UNISSULA memiliki **hak penuh** untuk menggunakan, menginstal, memodifikasi, dan mengembangkan perangkat lunak ini.

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

<div align="center">

**Dikembangkan oleh Alvah Rabbany**  
Email: alvahrabbany22@gmail.com | GitHub: [alvahraa](https://github.com/alvahraa)  
untuk **Perpustakaan Universitas Islam Sultan Agung (UNISSULA)**

(c) 2026 Alvah Rabbany

</div>
