# Contributing to Perpustakaan Dashboard

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## 📋 Code of Conduct

Proyek ini menggunakan [Contributor Covenant](https://www.contributor-covenant.org/) sebagai pedoman perilaku. Dengan berpartisipasi, Anda diharapkan untuk mematuhi kode ini.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm atau yarn
- Git

### Setup Development

```bash
# Fork repository ini terlebih dahulu

# Clone fork Anda
git clone https://github.com/alvahraa/perpustakaan-dashboard.git
cd perpustakaan-dashboard

# Install dependencies
npm install

# Jalankan development server
npm start
```

## 🔄 Development Workflow

### 1. Buat Branch Baru

```bash
# Untuk fitur baru
git checkout -b feature/nama-fitur

# Untuk bugfix
git checkout -b fix/nama-bug

# Untuk dokumentasi
git checkout -b docs/nama-update
```

### 2. Commit Guidelines

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new recommendation algorithm
fix: resolve chart rendering issue
docs: update README installation guide
style: format code with prettier
refactor: simplify analytics functions
test: add unit tests for services
chore: update dependencies
```

### 3. Push & Pull Request

```bash
git push origin feature/nama-fitur
```

Kemudian buat Pull Request di GitHub dengan deskripsi yang jelas.

## 📁 Project Structure

```
src/
├── components/     # React components (organized by feature)
├── data/          # Data generators
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
└── utils/         # Utility functions
```

## 🎨 Code Style

- Gunakan **functional components** dengan hooks
- Ikuti naming convention:
  - Components: `PascalCase` (e.g., `KPICards.jsx`)
  - Hooks: `camelCase` dengan prefix `use` (e.g., `useDataFetch.js`)
  - Utils: `camelCase` (e.g., `analytics.js`)
- Tambahkan JSDoc comments untuk fungsi penting
- Gunakan Tailwind CSS untuk styling

## ✅ Checklist Sebelum PR

- [ ] Code sudah di-test secara lokal
- [ ] Tidak ada error di console
- [ ] Responsive design sudah dicek
- [ ] Commit message mengikuti convention
- [ ] Branch sudah up-to-date dengan `main`

## 💬 Need Help?

Jika ada pertanyaan, silakan buka [Issue](https://github.com/YOUR_USERNAME/perpustakaan-dashboard/issues) baru.

---

Happy coding! 🚀
