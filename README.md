# Prototype Dashboard - Library Analytics System

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

**Sistem dashboard analytics modern untuk monitoring perpustakaan dengan visualisasi data real-time.**

[Tujuan](#tujuan-project) | [Fitur](#fitur-utama) | [Mekanisme](#mekanisme-dan-logic) | [Instalasi](#instalasi)

</div>

---

> **CATATAN PENTING:**  
> Sistem ini masih berupa **PROTOTYPE** dan menggunakan **data dummy** untuk demonstrasi.  
> Belum diuji coba dengan database real (Gate System / SLiMS).  
> Diperlukan integrasi dan pengujian lebih lanjut sebelum digunakan di lingkungan produksi.

---

## Tujuan Project

### Latar Belakang

Perpustakaan modern membutuhkan sistem monitoring yang dapat memberikan insight real-time tentang:
- Pola kunjungan mahasiswa dan dosen
- Tren peminjaman buku
- Efisiensi operasional perpustakaan
- Data-driven decision making untuk pengadaan buku dan jam operasional

### Tujuan Utama

1. **Visualisasi Data Real-Time**
   - Menampilkan data kunjungan dan peminjaman dalam bentuk grafik yang mudah dipahami
   - Memberikan overview cepat melalui KPI cards

2. **Analisis Pola Kunjungan**
   - Mengidentifikasi jam sibuk perpustakaan (peak hours)
   - Memahami distribusi pengunjung berdasarkan fakultas
   - Tracking durasi kunjungan

3. **Monitoring Peminjaman**
   - Mengetahui buku-buku paling populer
   - Analisis keterlambatan pengembalian
   - Trend peminjaman bulanan

4. **Prototype untuk Integrasi**
   - Sebagai proof-of-concept sebelum integrasi dengan Gate System dan SLiMS
   - Template untuk pengembangan dashboard perpustakaan lainnya

---

## Fitur Utama

### 1. Dashboard Overview

Halaman utama menampilkan ringkasan data perpustakaan:

| Komponen | Fungsi |
|----------|--------|
| KPI Cards | 4 metrik utama dengan animated counting |
| Trend Chart | Line chart kunjungan 7 hari terakhir |
| Category Chart | Bar chart peminjaman per kategori |
| Top Books | 5 buku terpopuler bulan ini |

### 2. Analisis Kunjungan

Halaman dengan fokus pada data pengunjung:

| Tab | Konten |
|-----|--------|
| Overview | Stats cards dan Peak Hours heatmap |
| Visitor Logs | Tabel pengunjung dengan search dan filter |
| Demographics | Pie chart distribusi per fakultas |

### 3. Analisis Peminjaman

Halaman dengan fokus pada data peminjaman:

| Tab | Konten |
|-----|--------|
| Analytics | Keterlambatan stats, trend chart, category chart |
| Top Books | Grid 10 buku terpopuler dengan visual cards |
| Loan History | Tabel riwayat peminjaman dengan export |

### 4. Dark Mode Professional

Sistem theming dengan dua mode:
- **Light Mode**: Clean dan professional untuk penggunaan siang hari
- **Dark Mode**: Premium dark aesthetic untuk kenyamanan mata

Fitur dark mode:
- Persistent di localStorage
- Sinkronisasi dengan preferensi sistem
- Typography hierarchy untuk menghindari eye strain

### 5. Command Palette

Keyboard shortcut `Ctrl + K` untuk akses cepat:
- Navigasi ke semua halaman
- Toggle dark mode
- Use system theme

### 6. System Console (Stealth Mode)

Console tersembunyi untuk administrasi sistem, diakses dengan `Ctrl + Shift + X`:
- Query data langsung
- Run diagnostics
- System status monitoring

---

## Mekanisme dan Logic

### 1. Arsitektur Data Flow

```
[Data Sources]
      |
      v
[Service Layer] --> API fetching, error handling
      |
      v
[React Hooks] --> State management, caching
      |
      v
[Analytics Functions] --> Data processing
      |
      v
[UI Components] --> Visualization
```

### 2. Visitor Trend Analysis

**Lokasi**: `src/utils/analytics.js` - `getVisitorTrend()`

**Logic**:
```javascript
// Input: Array visitor data, jumlah hari
// Process:
//   1. Filter visitors berdasarkan rentang tanggal
//   2. Group by tanggal menggunakan reduce()
//   3. Count jumlah visitor per hari
//   4. Sort berdasarkan tanggal ascending
// Output: Array [{date, count, dayName}]
```

**Kegunaan**: Menampilkan trend kunjungan untuk identifikasi pola harian dan prediksi traffic.

### 3. Peak Hours Detection

**Lokasi**: `src/utils/analytics.js` - `calculatePeakHours()`

**Logic**:
```javascript
// Input: Array visitor data
// Process:
//   1. Extract jam masuk (entryTime) dari setiap visitor
//   2. Group by jam (7, 8, 9, ..., 21)
//   3. Count jumlah visitor per jam
//   4. Calculate persentase relatif terhadap jam tersibuk
//   5. Mark jam dengan visits > 80% dari max sebagai "peak"
// Output: Array [{hour, visits, isPeak, percentage}]
```

**Kegunaan**: Mengidentifikasi jam sibuk untuk optimasi staffing dan resource allocation.

### 4. Faculty Distribution

**Lokasi**: `src/utils/analytics.js` - `getFacultyDistribution()`

**Logic**:
```javascript
// Input: Array visitor data
// Process:
//   1. Group visitors by fakultas
//   2. Count per fakultas
//   3. Calculate persentase dari total
//   4. Sort descending by count
// Output: Array [{name, count, percentage}]
```

**Kegunaan**: Memahami segmentasi pengunjung untuk targeting program literasi.

### 5. Top Books Algorithm

**Lokasi**: `src/utils/analytics.js` - `getTopBooks()`

**Logic**:
```javascript
// Input: Array loans, Array books, limit
// Process:
//   1. Count peminjaman per bookId menggunakan reduce()
//   2. Join dengan data buku untuk mendapat title, author, category
//   3. Sort descending by totalLoans
//   4. Slice untuk mendapat top N buku
// Output: Array [{id, title, author, category, totalLoans}]
```

**Kegunaan**: Mengetahui buku populer untuk pengadaan dan penempatan display.

### 6. Late Returns Analysis

**Lokasi**: `src/utils/analytics.js` - `analyzeLateReturns()`

**Logic**:
```javascript
// Input: Array loans
// Process:
//   1. Filter loans yang sudah dikembalikan
//   2. Hitung selisih returnDate - dueDate
//   3. Jika selisih > 0, tandai sebagai late
//   4. Calculate lateRate = (totalLate / totalReturned) * 100
//   5. Calculate avgLateDays = sum(lateDays) / totalLate
// Output: {lateRate, avgLateDays, totalLate, totalReturned}
```

**Kegunaan**: Monitoring tingkat keterlambatan untuk policy adjustment.

### 7. Category Popularity

**Lokasi**: `src/utils/analytics.js` - `getCategoryPopularity()`

**Logic**:
```javascript
// Input: Array loans, Array books
// Process:
//   1. Join loans dengan books berdasarkan bookId
//   2. Group by kategori buku
//   3. Count peminjaman per kategori
//   4. Calculate persentase dari total
//   5. Sort descending by count
// Output: Array [{category, count, percentage}]
```

**Kegunaan**: Insight untuk pengadaan buku berdasarkan demand.

### 8. Duration Tracking

**Lokasi**: `src/utils/analytics.js` - `calculateAverageDuration()`

**Logic**:
```javascript
// Input: Array visitor data
// Process:
//   1. Filter visitors yang sudah exit (memiliki exitTime)
//   2. Calculate duration = exitTime - entryTime (dalam menit)
//   3. Calculate average dan median
//   4. Format ke string (contoh: "1 jam 30 menit")
// Output: {average, median, formattedAverage, formattedMedian}
```

**Kegunaan**: Mengukur engagement pengunjung di perpustakaan.

---

## Data Filtering System

### Date Range Filter

Semua halaman mendukung filter berdasarkan rentang tanggal:

```javascript
const filtered = data.filter(item => {
  const itemDate = new Date(item.timestamp);
  return itemDate >= startDate && itemDate <= endDate;
});
```

### Search Filter

Visitor table mendukung pencarian teks:

```javascript
const searched = visitors.filter(v => 
  v.name.toLowerCase().includes(query) ||
  v.nim.includes(query) ||
  v.faculty.toLowerCase().includes(query)
);
```

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Library dengan Hooks | 18.x |
| Tailwind CSS | Utility-first Styling | 3.x |
| Recharts | Data Visualization | 2.x |
| Framer Motion | Animation Library | Latest |
| Lucide React | Modern Icons | Latest |
| date-fns | Date Manipulation | 3.x |
| xlsx | Excel Export | Latest |

---

## Instalasi

### Prerequisites
- Node.js 16+
- npm atau yarn

### Quick Start

```bash
# Clone repository
git clone https://github.com/alvahraa/prototype-dashboard.git

# Masuk ke direktori
cd prototype-dashboard

# Install dependencies
npm install

# Jalankan development server
npm start
```

Buka http://localhost:3000 di browser.

---

## Struktur Project

```
prototype-dashboard/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Common/        # Shared components (Tabs, DatePicker, etc.)
│   │   ├── Dashboard/     # KPICards, TrendChart, CategoryChart
│   │   ├── Layout/        # Sidebar, Header
│   │   ├── Loans/         # TopBooksGrid, LoanTrendChart, LateReturnStats
│   │   └── Visitors/      # PeakHoursHeatmap, FacultyPieChart, VisitorTable
│   │
│   ├── data/
│   │   └── generateDummyData.js  # Data dummy untuk demo
│   │
│   ├── hooks/
│   │   └── useDataFetch.js       # Custom hooks
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── VisitorsPage.jsx
│   │   ├── LoansPage.jsx
│   │   ├── ConsolePage.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── visitorService.js
│   │   ├── loanService.js
│   │   └── bookService.js
│   │
│   ├── utils/
│   │   ├── analytics.js          # Analytic functions
│   │   ├── exportToExcel.js      # Excel export utility
│   │   └── cn.js                 # Class name utility
│   │
│   ├── App.js
│   └── index.css
│
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + K | Open Command Palette |
| Ctrl + Shift + X | Open System Console (Stealth Mode) |
| Arrow Up/Down | Navigate in Command Palette |
| Enter | Select in Command Palette |
| Esc | Close modals |

---

## Mode Data

Dashboard mendukung 2 mode:

| Mode | Keterangan |
|------|------------|
| dummy | Menggunakan data dummy (1000 visitors, 200 books, 2000 loans) |
| production | Terhubung ke Gate System dan SLiMS API |

Default mode adalah `dummy` untuk development dan demo.

---

## Rencana Pengembangan

### Phase 1 (Current)
- Prototype dengan data dummy
- Visualisasi dasar
- Dark mode support

### Phase 2 (Planned)
- Integrasi Gate System API
- Integrasi SLiMS API
- Real-time data sync

### Phase 3 (Future)
- Role-based access control
- Report generation
- Email notifications

---

## Author

**Alvah Rabbany** - Proyek Magang - Prototype Dashboard Analytics Perpustakaan

---

<div align="center">

**Prototype Dashboard untuk Monitoring Perpustakaan Modern**

</div>
