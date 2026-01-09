# Prototype Dashboard - Library Analytics System

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

**Sistem dashboard analytics modern untuk monitoring perpustakaan dengan visualisasi data dan sistem rekomendasi buku berbasis algoritma.**

[Fitur](#fitur-utama) • [Mekanisme](#mekanisme-dan-algoritma) • [Instalasi](#instalasi) • [Struktur](#struktur-project)

</div>

---

> ⚠️ **CATATAN PENTING:**  
> Sistem ini masih berupa **PROTOTYPE** dan menggunakan **data dummy** untuk demonstrasi.  
> Belum diuji coba dengan database real (Gate System / SLiMS).  
> Diperlukan integrasi dan pengujian lebih lanjut sebelum digunakan di lingkungan produksi.

---

## Demo Screenshots

> **Catatan:** Tambahkan screenshot demo di folder `public/images/demo/`

| Halaman | Screenshot |
|---------|-----------|
| Login | ![Login](./public/images/demo/login_page.png) |
| Dashboard | ![Dashboard](./public/images/demo/dashboard_main.png) |
| Kunjungan | ![Kunjungan](./public/images/demo/visitors_page.png) |
| Peminjaman | ![Peminjaman](./public/images/demo/loans_page.png) |
| Rekomendasi | ![Rekomendasi](./public/images/demo/recommendations_page.png) |

---

## Fitur Utama

### 1. Dashboard Overview
- **KPI Cards**: Menampilkan 4 metrik utama (total buku, pengunjung hari ini, peminjaman aktif, pengunjung di perpustakaan)
- **Trend Chart**: Grafik line chart kunjungan harian
- **Category Chart**: Bar chart peminjaman per kategori buku
- **Top Books**: 5 buku terpopuler bulan ini

### 2. Analisis Kunjungan
- **Peak Hours Heatmap**: Visualisasi jam sibuk perpustakaan
- **Faculty Distribution**: Pie chart distribusi pengunjung per fakultas
- **Visitor Table**: Tabel pengunjung dengan fitur search, sort, dan filter
- **Live Duration**: Durasi kunjungan real-time untuk pengunjung aktif

### 3. Analisis Peminjaman
- **Top 10 Books**: Grid buku terpopuler dengan ranking badges
- **Category Popularity**: Horizontal bar chart kategori
- **Loan Trend**: Area chart trend peminjaman 6 bulan
- **Late Returns**: Progress bar statistik keterlambatan

### 4. Sistem Rekomendasi (Algoritma)
- **Trending Books**: Top 10 buku trending minggu ini (frequency counting)
- **Collaborative Filtering**: "Yang pinjam ini juga pinjam..." (co-occurrence analysis)
- **Content-Based Filtering**: Rekomendasi berdasarkan kategori favorit (category matching)

### 5. Motion Design System

Dashboard menggunakan **Framer Motion** untuk animasi profesional dan smooth:

#### Sidebar Navigation
- **Staggered Entry**: Menu items muncul satu per satu dengan efek slide-in
- **layoutId Transition**: Active menu pill bergerak smooth antar menu item
- **Micro-interactions**: Hover lift dan tap feedback pada semua tombol

#### Chart Animations (Recharts)
- **Line Chart**: Animasi "pencil sketch" - garis digambar dari kiri ke kanan (2 detik)
- **Bar Chart**: Animasi grow - bar tumbuh dari bawah ke atas (1.5 detik)
- **Glassmorphism Tooltips**: Tooltip dengan efek backdrop-blur dan transparansi

#### Login Page
- **Mesh Gradient Background**: Animated organic blob shapes
- **Glassmorphism Card**: Backdrop blur dengan semi-transparent background
- **Input Micro-interactions**: Scale up dan glow effect saat focus

#### UI Components
- **MotionCard**: Card dengan hover lift effect
- **MotionButton**: Button dengan tactile press feedback (whileTap scale)
- **MotionContainer**: Staggered children animation

**Packages:**
```
framer-motion  - Animation library
clsx           - Conditional class names
tailwind-merge - Merge Tailwind classes
```

---

## Mekanisme dan Algoritma

### 1. Visitor Trend Analysis

**Lokasi:** `src/utils/analytics.js` - fungsi `getVisitorTrend()`

**Mekanisme:**
```
Input: Array visitor data, jumlah hari (default: 30)
Process:
  1. Filter visitors berdasarkan rentang tanggal
  2. Group by tanggal (menggunakan date-fns format 'yyyy-MM-dd')
  3. Count jumlah visitor per hari
  4. Sort berdasarkan tanggal ascending
Output: Array [{date, count, dayName}]
```

**Filter yang digunakan:**
- Date range filter (startDate - endDate)
- Grouping menggunakan JavaScript `reduce()`

---

### 2. Peak Hours Analysis (Jam Sibuk)

**Lokasi:** `src/utils/analytics.js` - fungsi `getPeakHours()`

**Mekanisme:**
```
Input: Array visitor data
Process:
  1. Extract jam masuk (entryTime) dari setiap visitor
  2. Group by jam (7, 8, 9, ..., 21)
  3. Count jumlah visitor per jam
  4. Calculate persentase relatif terhadap jam tersibuk
Output: Array [{hour, count, percentage, label}]
```

**Logika:**
- Jam operasional: 07:00 - 21:00 (14 jam)
- Peak detection: Jam dengan count tertinggi
- Persentase dihitung: `(count / maxCount) * 100`

---

### 3. Faculty Distribution

**Lokasi:** `src/utils/analytics.js` - fungsi `getFacultyDistribution()`

**Mekanisme:**
```
Input: Array visitor data
Process:
  1. Group visitors by fakultas
  2. Count per fakultas
  3. Calculate persentase dari total
  4. Sort descending by count
Output: Array [{faculty, count, percentage, color}]
```

**Color Mapping:**
- 9 fakultas dengan warna berbeda untuk Pie Chart
- Menggunakan predefined color palette

---

### 4. Category Popularity

**Lokasi:** `src/utils/analytics.js` - fungsi `getCategoryPopularity()`

**Mekanisme:**
```
Input: Array loans, Array books
Process:
  1. Join loans dengan books berdasarkan bookId
  2. Group by kategori buku
  3. Count peminjaman per kategori
  4. Sort descending by count
Output: Array [{category, count, percentage}]
```

---

### 5. Top Books Algorithm

**Lokasi:** `src/utils/analytics.js` - fungsi `getTopBooks()`

**Mekanisme:**
```
Input: Array loans, Array books, limit (default: 10)
Process:
  1. Count peminjaman per bookId menggunakan reduce()
  2. Join dengan data buku untuk mendapat detail (title, author, category)
  3. Sort descending by totalLoans
  4. Slice untuk mendapat top N buku
Output: Array [{id, title, author, category, totalLoans}]
```

---

### 6. Sistem Rekomendasi

#### A. Trending Books

**Lokasi:** `src/utils/analytics.js` - fungsi `getTrendingBooks()`

**Mekanisme:**
```
Input: Array loans, Array books, period (7 hari)
Process:
  1. Filter loans dalam period terakhir
  2. Count peminjaman per buku
  3. Calculate trend score: count dalam period / count total
  4. Sort by trend score descending
Output: Array [{book, trendScore, weeklyCount}]
```

**Logika Trend Score:**
- Buku dengan peningkatan peminjaman mendapat score lebih tinggi
- Formula: `weeklyCount / avgWeeklyCount`

---

#### B. Collaborative Filtering

**Lokasi:** `src/utils/analytics.js` - fungsi `getCollaborativeRecommendations()`

**Mekanisme:**
```
Input: targetBookId, Array loans
Process:
  1. Find semua user yang pernah pinjam targetBook
  2. Find semua buku lain yang dipinjam user tersebut
  3. Count frequency peminjaman (co-occurrence)
  4. Rank by frequency (similarity score)
  5. Filter out targetBook dari hasil
Output: Array [{book, similarityScore, coOccurrence}]
```

**Logika "People who borrowed X also borrowed Y":**
```javascript
// Pseudocode
targetUsers = loans.filter(l => l.bookId === targetBook).map(l => l.userId)
otherBooks = loans.filter(l => targetUsers.includes(l.userId) && l.bookId !== targetBook)
recommendations = count(otherBooks.bookId).sortDesc()
```

---

#### C. Content-Based Filtering

**Lokasi:** `src/utils/analytics.js` - fungsi `getContentBasedRecommendations()`

**Mekanisme:**
```
Input: userId, Array loans, Array books
Process:
  1. Get riwayat peminjaman user
  2. Extract kategori dari buku yang pernah dipinjam
  3. Find kategori favorit (most frequent)
  4. Get buku-buku dari kategori yang sama (yang belum pernah dipinjam)
  5. Sort by rating dan availability
Output: Array [{book, matchScore, reason}]
```

**Category Matching:**
```javascript
// Pseudocode
userBooks = loans.filter(l => l.userId === userId).map(l => l.bookId)
userCategories = books.filter(b => userBooks.includes(b.id)).map(b => b.category)
favoriteCategory = mostFrequent(userCategories)
recommendations = books.filter(b => b.category === favoriteCategory && !userBooks.includes(b.id))
```

---

### 7. Data Filtering System

**Date Range Filter:**
```javascript
// Digunakan di semua halaman
const filtered = data.filter(item => {
  const itemDate = new Date(item.timestamp);
  return itemDate >= startDate && itemDate <= endDate;
});
```

**Search Filter (Visitor Table):**
```javascript
const searched = visitors.filter(v => 
  v.name.toLowerCase().includes(query) ||
  v.nim.includes(query) ||
  v.faculty.toLowerCase().includes(query)
);
```

**Status Filter (Loans):**
```javascript
// Filter: all | active | returned | late
const filtered = loans.filter(l => 
  status === 'all' || l.status === status
);
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Data Sources                          │
├─────────────────────────────────────────────────────────────┤
│  [Gate System API]  →  Visitor Data (entry/exit time)       │
│  [SLiMS API]        →  Books & Loans Data                   │
│  [Dummy Data]       →  Demo/Development Mode                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  visitorService.js  │  loanService.js  │  bookService.js    │
│  - getVisitors()    │  - getLoans()    │  - getBooks()      │
│  - getActiveVisitors│  - getLoanStats()│  - getBookById()   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Hooks                              │
├─────────────────────────────────────────────────────────────┤
│  useDataFetch()     │  Custom hooks for data management     │
│  useVisitors()      │  Auto-refresh, loading states         │
│  useLoans()         │  Error handling                       │
│  useDashboardData() │  Combined data fetching               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Analytics Layer                            │
├─────────────────────────────────────────────────────────────┤
│  analytics.js (20+ functions)                               │
│  - getVisitorTrend() - getPeakHours() - getTopBooks()       │
│  - getCategoryPopularity() - getCollaborativeRec()          │
│  - getContentBasedRec() - getDashboardSummary()             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                            │
├─────────────────────────────────────────────────────────────┤
│  Pages: Dashboard, Visitors, Loans, Recommendations         │
│  Components: Charts, Tables, Cards, Filters                 │
│  Visualizations: Recharts (Line, Bar, Pie, Area charts)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library dengan Hooks | 18.x |
| **Tailwind CSS** | Utility-first Styling | 3.x |
| **Recharts** | Data Visualization | 2.x |
| **Lucide React** | Modern Icons | Latest |
| **date-fns** | Date Manipulation | 3.x |

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
│   ├── images/
│   │   ├── demo/          # Screenshot untuk dokumentasi
│   │   └── assets/        # Logo dan icon
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── Common/        # Loading, Error, DatePicker, etc.
│   │   ├── Dashboard/     # KPICards, TrendChart, CategoryChart
│   │   ├── Layout/        # Sidebar, Header
│   │   ├── Loans/         # TopBooksGrid, LoanTrendChart
│   │   ├── Recommendations/# Trending, Collaborative, ContentBased
│   │   └── Visitors/      # PeakHours, FacultyPie, VisitorTable
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
│   │   ├── RecommendationsPage.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── services/
│   │   ├── api.js               # API configuration
│   │   ├── visitorService.js    # Visitor CRUD
│   │   ├── loanService.js       # Loan CRUD
│   │   └── bookService.js       # Book CRUD
│   │
│   ├── utils/
│   │   └── analytics.js         # 20+ analytic functions
│   │
│   ├── App.js
│   └── index.css
│
├── package.json
└── README.md
```

---

## Mode Data

Dashboard mendukung 2 mode:

| Mode | Keterangan |
|------|------------|
| `dummy` | Menggunakan data dummy (1000 visitors, 200 books, 2000 loans) |
| `production` | Terhubung ke Gate System & SLiMS API |

Default mode adalah `dummy` untuk development dan demo.

---

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/NamaFitur`)
3. Commit perubahan (`git commit -m 'Add NamaFitur'`)
4. Push ke branch (`git push origin feature/NamaFitur`)
5. Buat Pull Request

---

## Author

**Alvah Rabbany** - *Proyek Prototype Dashboard Analytics*

---

<div align="center">

**Prototype Dashboard untuk Monitoring Perpustakaan Modern**

</div>
