# 📚 Dashboard Analytics Perpustakaan Unnisula

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Dashboard analytics modern untuk monitoring perpustakaan dengan visualisasi data lengkap dan sistem rekomendasi.**

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Struktur](#-struktur-project) • [Kontribusi](#-kontribusi)

</div>

---

## 🎯 Overview

Dashboard Analytics Perpustakaan Unnisula adalah aplikasi web berbasis React yang menyediakan:
- Visualisasi data kunjungan dan peminjaman perpustakaan
- Sistem rekomendasi buku menggunakan algoritma Collaborative Filtering dan Content-Based Filtering
- Interface modern dengan animasi smooth dan responsive design
- Integrasi API untuk data real-time (mendukung mode dummy untuk development)

---

## ✨ Fitur Utama

### 🔐 Authentication
- Login page dengan animated gradient wallpaper
- Floating particles effect
- Session persistence dengan localStorage

### 📊 Dashboard Overview
- **KPI Cards**: Total buku, pengunjung, peminjaman dengan animasi counting
- **Trend Chart**: Line chart kunjungan dengan period selector
- **Category Chart**: Bar chart kategori terpopuler
- **Date Range Filter**: Filter data berdasarkan rentang waktu
- **Auto Refresh**: Data update otomatis dengan configurable interval

### 👥 Analisis Kunjungan
- **Peak Hours Heatmap**: Jam sibuk dengan gradient colors
- **Faculty Distribution**: Pie chart distribusi per fakultas
- **Visitor Table**: Tabel dengan search, sort, dan live duration
- **Statistics Cards**: Durasi rata-rata, jam tersibuk, total bulanan

### 📖 Analisis Peminjaman
- **Top 10 Books Grid**: Buku terpopuler dengan ranking badges
- **Category Bar Chart**: Kategori horizontal bar chart
- **Loan Trend Chart**: Area chart trend 6 bulan
- **Late Returns Stats**: Progress bar keterlambatan

### 🎯 Sistem Rekomendasi
- **Trending Books**: Top 10 minggu ini dengan ranked list
- **Collaborative Filtering**: "Yang pinjam ini juga pinjam..."
- **Content-Based**: Rekomendasi berdasarkan kategori favorit
- **Algorithm Explanation**: Penjelasan cara kerja algoritma

---

## 🚀 Instalasi

### Prerequisites
- Node.js 16+ 
- npm atau yarn

### Quick Start

```bash
# Clone repository
git clone https://github.com/alvahraa/perpustakaan-dashboard.git

# Masuk ke direktori project
cd perpustakaan-dashboard

# Install dependencies
npm install

# Jalankan development server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Environment Variables

Salin `.env.example` ke `.env.local` dan sesuaikan nilai:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_DATA_MODE` | Mode data: `dummy` atau `production` | `dummy` |
| `REACT_APP_GATE_API_URL` | URL Gate System API | `http://localhost:8080/api/gate` |
| `REACT_APP_SLIMS_API_URL` | URL SLiMS API | `http://localhost/slims/api` |
| `REACT_APP_REFRESH_INTERVAL` | Auto refresh interval (ms) | `300000` |

---

## 📁 Struktur Project

```
perpustakaan-dashboard/
├── public/
│   ├── images/              # Folder untuk upload gambar
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── Common/          # Shared components (Loading, Error, etc)
│   │   ├── Dashboard/       # KPICards, TrendChart, CategoryChart
│   │   ├── Layout/          # Sidebar, Header
│   │   ├── Loans/           # TopBooksGrid, CategoryBar, LateStats
│   │   ├── Recommendations/ # Trending, Collaborative, ContentBased
│   │   └── Visitors/        # PeakHours, FacultyPie, VisitorTable
│   │
│   ├── data/
│   │   └── generateDummyData.js  # Generator data dummy
│   │
│   ├── hooks/
│   │   ├── index.js
│   │   └── useDataFetch.js       # Custom hooks untuk data fetching
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── VisitorsPage.jsx
│   │   ├── LoansPage.jsx
│   │   ├── RecommendationsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── api.js                # API configuration
│   │   ├── visitorService.js     # Visitor data service
│   │   ├── loanService.js        # Loan data service
│   │   ├── bookService.js        # Book data service
│   │   └── index.js
│   │
│   ├── utils/
│   │   └── analytics.js          # Analytics functions (20+)
│   │
│   ├── App.js
│   ├── index.js
│   └── index.css
│
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library dengan Hooks |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Recharts** | Charts & Visualizations |
| **Lucide React** | Modern Icon Library |
| **date-fns** | Date Utilities |

---

## 🧮 Algoritma Rekomendasi

### 1. Trending Books
```javascript
// Filter loans dalam 7 hari terakhir
// Count per book, sort descending
// Return top N
```

### 2. Collaborative Filtering
```javascript
// 1. Find users yang pinjam targetBook
// 2. Find buku lain yang dipinjam users tersebut
// 3. Rank by frequency (similarity score)
// "People who borrowed X also borrowed Y"
```

### 3. Content-Based Filtering
```javascript
// 1. Get riwayat peminjaman user
// 2. Find kategori favorit (most frequent)
// 3. Recommend buku dari kategori sama (sorted by rating)
```

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #000000 | Buttons, active states |
| `--secondary` | #f5f5f5 | Backgrounds |
| `--text` | #333333 | Body text |
| `--text-secondary` | #666666 | Muted text |

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

---

## 📊 Data Dummy

| Entity | Count | Description |
|--------|-------|-------------|
| **Visitors** | 1000 | 30 hari, pola realistis |
| **Books** | 200 | 6 kategori, ISBN unik |
| **Loans** | 2000 | Status: active, returned, late |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## ⚠️ Troubleshooting

### CSS Lint Warnings
Warning `@tailwind` dan `@apply` di editor adalah **NORMAL**.
```json
// VS Code settings.json
{ "css.lint.unknownAtRules": "ignore" }
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm tidak dikenali
```powershell
# Gunakan path lengkap
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Authors

- **Perpustakaan Unnisula** - *Initial work*

---

<div align="center">

**Made with ❤️ for better library analytics**

⭐ Star this repo if you find it useful!

</div>
