/**
 * Dynamic Data Simulation Engine
 * 
 * Generates fresh, randomized data on every page reload.
 * Data includes:
 * - Variable visitor entries (high/low traffic days)
 * - 200 buku dengan berbagai kategori
 * - 2000 transaksi peminjaman with randomized statuses
 */

import { subDays, addMinutes, addDays } from 'date-fns';

// ============================================================================
// HELPER FUNCTIONS - True Random (fresh on each reload)
// ============================================================================

// Use Math.random() for fresh data on each page reload
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

function generateNIM(faculty, year) {
  const facultyCodes = {
    'Fakultas Teknik': '21060',
    'Fakultas Hukum': '21030',
    'Fakultas Ekonomi & Bisnis': '21020',
    'Fakultas Kedokteran': '21010',
    'Fakultas Keguruan & Ilmu Pendidikan': '21040',
    'Fakultas Ilmu Keperawatan': '21050',
    'Fakultas Agama Islam': '21070',
    'Fakultas Psikologi': '21080',
    'Fakultas Bahasa & Ilmu Komunikasi': '21090'

  };
  const code = facultyCodes[faculty] || '21060';
  const yearCode = year.toString().slice(-2);
  const sequence = randomInt(100001, 199999).toString();
  return code + yearCode + sequence;
}

function generateISBN() {
  const prefix = '978';
  const group = randomInt(0, 1);
  const publisher = randomInt(10000, 99999);
  const title = randomInt(100, 999);
  const check = randomInt(0, 9);
  return `${prefix}-${group}-${publisher}-${title}-${check}`;
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const FACULTIES = [
  {
    name: 'Fakultas Kedokteran',
    majors: ['S1 Kedokteran Umum', 'S2 Biomedik', 'S3 Biomedik']
  },
  {
    name: 'Fakultas Kedokteran Gigi',
    majors: ['S1 Kedokteran Gigi', 'S2 Kedokteran Gigi']
  },
  {
    name: 'Fakultas Teknik',
    majors: ['S1 Teknik Sipil', 'S2 Teknik Sipil', 'S3 Teknik Sipil', 'S1 Planologi', 'S2 Planologi']
  },
  {
    name: 'Fakultas Hukum',
    majors: ['S1 Ilmu Hukum', 'S2 Ilmu Hukum', 'S2 Kenotariatan', 'S3 Doktor Ilmu Hukum']
  },
  {
    name: 'Fakultas Ekonomi',
    majors: ['D3 Akuntansi', 'S1 Akuntansi', 'S2 Akuntansi', 'S1 Manajemen', 'S2 Manajemen', 'S3 Manajemen']
  },
  {
    name: 'Fakultas Agama Islam',
    majors: ['S1 Hukum Keluarga', 'S1 Pendidikan Agama Islam', 'S2 Pendidikan Agama Islam']
  },
  {
    name: 'Fakultas Teknologi Industri',
    majors: ['S1 Teknik Industri', 'S1 Teknik Informatika', 'S1 Teknik Elektro', 'S2 Teknik Elektro']
  },
  {
    name: 'Fakultas Psikologi',
    majors: ['S1 Psikologi']
  },
  {
    name: 'Fakultas Ilmu Keperawatan',
    majors: ['D3 Keperawatan', 'S1 Keperawatan', 'S2 Keperawatan']
  },
  {
    name: 'Fakultas Ilmu Komunikasi',
    majors: ['S1 Ilmu Komunikasi']
  },
  {
    name: 'Fakultas Bahasa, Sastra dan Budaya',
    majors: ['S1 Pendidikan Bahasa Inggris', 'S1 Sastra Inggris']
  },
  {
    name: 'Fakultas Keguruan dan Ilmu Pendidikan',
    majors: ['S1 Pendidikan Matematika', 'S2 Matematika', 'S1 PBSI', 'S2 PBSI', 'S1 PGSD', 'S2 PGSD']
  },
  {
    name: 'Fakultas Farmasi',
    majors: ['S1 Farmasi', 'S1 Kebidanan']
  }
];

const FACULTY_WEIGHTS = [12, 5, 10, 8, 15, 5, 18, 4, 6, 5, 4, 5, 3]; // FTI paling banyak

// Rooms - match form absensi exactly
const ROOMS = [
  { id: 'audiovisual', name: 'Audiovisual' },
  { id: 'referensi', name: 'Ruang Referensi' },
  { id: 'sirkulasi_l1', name: 'Sirkulasi - Lantai 1' },
  { id: 'sirkulasi_l2', name: 'Sirkulasi - Lantai 2' },
  { id: 'karel', name: 'Ruang Karel' },
  { id: 'smartlab', name: 'SmartLab' }
];

// Gender - match form absensi
const GENDERS = ['L', 'P'];

const FIRST_NAMES = [
  'Ahmad', 'Muhammad', 'Andi', 'Budi', 'Cahyo', 'Dimas', 'Eko', 'Fajar', 'Galih', 'Hadi',
  'Irfan', 'Joko', 'Kurnia', 'Lukman', 'Maulana', 'Nur', 'Oscar', 'Permadi', 'Qori', 'Rizky',
  'Satria', 'Teguh', 'Umar', 'Vino', 'Wahyu', 'Yusuf', 'Zaki', 'Aditya', 'Bayu', 'Candra',
  'Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
  'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
  'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'
];

const LAST_NAMES = [
  'Pratama', 'Wijaya', 'Susanto', 'Nugroho', 'Hidayat', 'Saputra', 'Putra', 'Santoso', 'Kusuma', 'Ramadhan',
  'Setiawan', 'Wibowo', 'Hartono', 'Suryadi', 'Firmansyah', 'Hakim', 'Prasetyo', 'Utomo', 'Permana', 'Fadillah',
  'Cahyono', 'Maulana', 'Fauzi', 'Kurniawan', 'Syahputra', 'Wibisono', 'Yulianto', 'Adriansyah', 'Budiman', 'Darmawan'
];

const BOOK_CATEGORIES = [
  { name: 'Teknologi Informasi', weight: 30 },
  { name: 'Ekonomi & Bisnis', weight: 20 },
  { name: 'Hukum', weight: 15 },
  { name: 'Kesehatan', weight: 15 },
  { name: 'Pendidikan', weight: 10 },
  { name: 'Umum', weight: 10 }
];

const BOOKS_BY_CATEGORY = {
  'Teknologi Informasi': [
    { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt' },
    { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gang of Four' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen' },
    { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson' },
    { title: 'Code Complete', author: 'Steve McConnell' },
    { title: 'The Art of Computer Programming', author: 'Donald Knuth' },
    { title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler' },
    { title: 'Head First Design Patterns', author: 'Eric Freeman' },
    { title: 'JS - The Good Parts', author: 'Douglas Crockford' },
    { title: 'Python Crash Course', author: 'Eric Matthes' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' },
    { title: 'Learning React', author: 'Alex Banks' },
    { title: 'Node.js Design Patterns', author: 'Mario Casciaro' },
    { title: 'Database System Concepts', author: 'Abraham Silberschatz' },
    { title: 'Computer Networks', author: 'Andrew S. Tanenbaum' },
    { title: 'Operating System Concepts', author: 'Abraham Silberschatz' },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell' },
    { title: 'Machine Learning', author: 'Tom Mitchell' },
    { title: 'Deep Learning', author: 'Ian Goodfellow' },
    { title: 'Data Science from Scratch', author: 'Joel Grus' },
    { title: 'Hands-On Machine Learning', author: 'Aurélien Géron' },
    { title: 'Computer Architecture', author: 'John L. Hennessy' },
    { title: 'Software Engineering', author: 'Ian Sommerville' },
    { title: 'Compilers: Principles, Techniques, and Tools', author: 'Alfred V. Aho' },
    { title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen' },
    { title: 'The Linux Command Line', author: 'William Shotts' },
    { title: 'Pro Git', author: 'Scott Chacon' },
    { title: 'Docker Deep Dive', author: 'Nigel Poulton' },
    { title: 'Kubernetes in Action', author: 'Marko Lukša' }
  ],
  'Ekonomi & Bisnis': [
    { title: 'Principles of Economics', author: 'N. Gregory Mankiw' },
    { title: 'Microeconomics', author: 'Paul Krugman' },
    { title: 'Macroeconomics', author: 'Olivier Blanchard' },
    { title: 'Financial Accounting', author: 'Jerry J. Weygandt' },
    { title: 'Management Accounting', author: 'Charles T. Horngren' },
    { title: 'Corporate Finance', author: 'Stephen A. Ross' },
    { title: 'Investments', author: 'Zvi Bodie' },
    { title: 'Marketing Management', author: 'Philip Kotler' },
    { title: 'Principles of Management', author: 'Stephen P. Robbins' },
    { title: 'Human Resource Management', author: 'Gary Dessler' },
    { title: 'Operations Management', author: 'Jay Heizer' },
    { title: 'Strategic Management', author: 'Fred R. David' },
    { title: 'Business Statistics', author: 'David F. Groebner' },
    { title: 'International Business', author: 'Charles W.L. Hill' },
    { title: 'Entrepreneurship', author: 'Robert D. Hisrich' },
    { title: 'Organizational Behavior', author: 'Stephen P. Robbins' },
    { title: 'Supply Chain Management', author: 'Sunil Chopra' },
    { title: 'Consumer Behavior', author: 'Leon G. Schiffman' },
    { title: 'Business Ethics', author: 'O.C. Ferrell' },
    { title: 'E-Commerce', author: 'Kenneth C. Laudon' }
  ],
  'Hukum': [
    { title: 'Pengantar Ilmu Hukum', author: 'Prof. Dr. Sudikno Mertokusumo' },
    { title: 'Hukum Pidana Indonesia', author: 'Prof. Moeljatno' },
    { title: 'Hukum Perdata Indonesia', author: 'Prof. Subekti' },
    { title: 'Hukum Tata Negara', author: 'Prof. Jimly Asshiddiqie' },
    { title: 'Hukum Administrasi Negara', author: 'Ridwan HR' },
    { title: 'Hukum Acara Pidana', author: 'M. Yahya Harahap' },
    { title: 'Hukum Acara Perdata', author: 'M. Yahya Harahap' },
    { title: 'Hukum Bisnis', author: 'Abdul R. Saliman' },
    { title: 'Hukum Perbankan', author: 'Muhammad Djumhana' },
    { title: 'Hukum Pajak', author: 'Rochmat Soemitro' },
    { title: 'Hukum Ketenagakerjaan', author: 'Lalu Husni' },
    { title: 'Hukum Lingkungan', author: 'Siti Sundari Rangkuti' },
    { title: 'Hukum Internasional', author: 'Mochtar Kusumaatmadja' },
    { title: 'Hukum Perjanjian', author: 'Prof. Subekti' },
    { title: 'Hukum Waris', author: 'Prof. Subekti' }
  ],
  'Kesehatan': [
    { title: 'Anatomi Manusia', author: 'Gerard J. Tortora' },
    { title: 'Fisiologi Manusia', author: 'Arthur C. Guyton' },
    { title: 'Patologi Robbins', author: 'Vinay Kumar' },
    { title: 'Farmakologi', author: 'Bertram G. Katzung' },
    { title: 'Mikrobiologi Kedokteran', author: 'Jawetz' },
    { title: 'Ilmu Bedah', author: 'R. Sjamsuhidajat' },
    { title: 'Ilmu Penyakit Dalam', author: 'Aru W. Sudoyo' },
    { title: 'Obstetri dan Ginekologi', author: 'Prawirohardjo' },
    { title: 'Ilmu Kesehatan Anak', author: 'Nelson' },
    { title: 'Diagnosis Fisik', author: 'Mark H. Swartz' },
    { title: 'Biokimia Harper', author: 'Robert K. Murray' },
    { title: 'Histologi', author: 'Leslie P. Gartner' },
    { title: 'Embriologi Kedokteran', author: 'Keith L. Moore' },
    { title: 'Keperawatan Medikal-Bedah', author: 'Brunner & Suddarth' },
    { title: 'Gizi dan Dietetik', author: 'Almatsier' }
  ],
  'Pendidikan': [
    { title: 'Psikologi Pendidikan', author: 'John W. Santrock' },
    { title: 'Strategi Pembelajaran', author: 'Wina Sanjaya' },
    { title: 'Evaluasi Pendidikan', author: 'Suharsimi Arikunto' },
    { title: 'Metodologi Penelitian Pendidikan', author: 'Sugiyono' },
    { title: 'Manajemen Pendidikan', author: 'Nanang Fattah' },
    { title: 'Kurikulum dan Pembelajaran', author: 'Oemar Hamalik' },
    { title: 'Teknologi Pendidikan', author: 'Deni Darmawan' },
    { title: 'Psikologi Perkembangan', author: 'Elizabeth B. Hurlock' },
    { title: 'Bimbingan dan Konseling', author: 'Prayitno' },
    { title: 'Administrasi Pendidikan', author: 'Engkoswara' }
  ],
  'Umum': [
    { title: 'Filsafat Ilmu', author: 'Jujun S. Suriasumantri' },
    { title: 'Sosiologi', author: 'Anthony Giddens' },
    { title: 'Antropologi', author: 'Koentjaraningrat' },
    { title: 'Sejarah Indonesia Modern', author: 'M.C. Ricklefs' },
    { title: 'Bahasa Indonesia untuk Akademik', author: 'Gorys Keraf' },
    { title: 'Statistika untuk Penelitian', author: 'Sugiyono' },
    { title: 'Metodologi Penelitian Kualitatif', author: 'Lexy J. Moleong' },
    { title: 'Metodologi Penelitian Kuantitatif', author: 'Sugiyono' },
    { title: 'Etika Profesi', author: 'K. Bertens' },
    { title: 'Kewirausahaan', author: 'Suryana' }
  ]
};

const COVER_COLORS = [
  '1a365d', '2c5282', '2b6cb0', '3182ce', '4299e1', // Blues
  '22543d', '276749', '2f855a', '38a169', '48bb78', // Greens  
  '742a2a', '9b2c2c', 'c53030', 'e53e3e', 'f56565', // Reds
  '744210', '975a16', 'b7791f', 'd69e2e', 'ecc94b', // Yellows
  '322659', '44337a', '553c9a', '6b46c1', '805ad5', // Purples
  '1a202c', '2d3748', '4a5568', '718096', 'a0aec0'  // Grays
];

// ============================================================================
// DATA GENERATORS
// ============================================================================

/**
 * Generate visitors data (1000 entries, 30 hari terakhir)
 */
function generateVisitors() {
  const visitors = [];
  const baseDate = new Date(); // Use current date
  const uniqueNIMs = new Set();

  // Pre-generate ~300 unique students who will be visitors
  const studentsPool = [];
  for (let i = 0; i < 350; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2023);
    const nim = generateNIM(facultyData.name, year);

    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      // Determine gender from first name (Indonesian naming pattern)
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({
        nim,
        nama: `${firstName} ${pickRandom(LAST_NAMES)}`,
        faculty: facultyData.name,
        prodi: pickRandom(facultyData.majors),
        gender: isFemale ? 'P' : 'L'
      });
    }
  }

  let visitorId = 1;

  // Generate 1000 visitor entries over 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const dayOfWeek = currentDate.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

    // Determine number of visitors for this day
    // Add traffic variability - some days high, some low
    let dailyVisitors;
    const trafficVariance = Math.random();
    let trafficMultiplier = 1;

    // 20% chance of high traffic day (surge)
    if (trafficVariance > 0.8) {
      trafficMultiplier = 1.5;
    }
    // 15% chance of low traffic day
    else if (trafficVariance < 0.15) {
      trafficMultiplier = 0.5;
    }

    if (isWeekendDay) {
      dailyVisitors = Math.round(randomInt(10, 25) * trafficMultiplier);
    } else {
      dailyVisitors = Math.round(randomInt(25, 60) * trafficMultiplier);
    }

    for (let v = 0; v < dailyVisitors && visitors.length < 1000; v++) {
      const student = pickRandom(studentsPool);

      // Generate entry time based on realistic patterns
      // 70% during work hours (8-17)
      // Peak hours: 10-11 and 14-15
      let entryHour;
      const hourPattern = Math.random();

      if (hourPattern < 0.15) {
        // Early morning: 8-9 AM
        entryHour = 8 + randomFloat(0, 1);
      } else if (hourPattern < 0.40) {
        // Peak morning: 9-12 PM
        entryHour = 9 + randomFloat(0, 3);
      } else if (hourPattern < 0.50) {
        // Lunch break: 12-13
        entryHour = 12 + randomFloat(0, 1);
      } else if (hourPattern < 0.80) {
        // Peak afternoon: 13-16
        entryHour = 13 + randomFloat(0, 3);
      } else {
        // Evening: 16-18
        entryHour = 16 + randomFloat(0, 2);
      }

      const entryMinutes = Math.floor((entryHour % 1) * 60);
      const entryHourInt = Math.floor(entryHour);

      const entryTime = new Date(currentDate);
      entryTime.setHours(entryHourInt, entryMinutes, randomInt(0, 59));

      // Generate duration: 30 minutes to 4 hours, average ~2 hours
      // Use normal-ish distribution
      let durationMinutes;
      const durationRoll = Math.random();
      if (durationRoll < 0.1) {
        durationMinutes = randomInt(30, 60); // Short visit
      } else if (durationRoll < 0.7) {
        durationMinutes = randomInt(60, 150); // Average visit (~1-2.5 hours)
      } else if (durationRoll < 0.9) {
        durationMinutes = randomInt(150, 210); // Long visit (2.5-3.5 hours)
      } else {
        durationMinutes = randomInt(210, 240); // Very long visit (3.5-4 hours)
      }

      const exitTime = addMinutes(entryTime, durationMinutes);

      // Determine status: most have exited, some still inside (only for recent days)
      let status = 'exited';
      if (dayOffset >= 29 && Math.random() < 0.05) {
        status = 'inside'; // ~5% of today's visitors are still inside
      }

      const room = pickRandom(ROOMS);
      visitors.push({
        id: `V${String(visitorId).padStart(4, '0')}`,
        nama: student.nama,
        nim: student.nim,
        faculty: student.faculty,
        prodi: student.prodi,
        gender: student.gender,
        ruangan: room.id,
        ruanganName: room.name,
        visitTime: entryTime.toISOString(),
        entryTime: entryTime.toISOString(),
        exitTime: status === 'inside' ? null : exitTime.toISOString(),
        status
      });

      visitorId++;
    }
  }

  return visitors;
}

/**
 * Generate books data (200 books)
 */
function generateBooks() {
  const books = [];
  let bookId = 1;

  // Calculate how many books per category based on weights
  const categoryBooks = {};
  let remaining = 200;

  for (let i = 0; i < BOOK_CATEGORIES.length; i++) {
    const cat = BOOK_CATEGORIES[i];
    const count = i === BOOK_CATEGORIES.length - 1
      ? remaining
      : Math.round(200 * cat.weight / 100);
    categoryBooks[cat.name] = count;
    remaining -= count;
  }

  // Generate books for each category
  for (const [category, count] of Object.entries(categoryBooks)) {
    const categoryBooksList = BOOKS_BY_CATEGORY[category];

    for (let i = 0; i < count; i++) {
      // Cycle through available titles, adding variation
      const baseBook = categoryBooksList[i % categoryBooksList.length];
      const colorIdx = randomInt(0, COVER_COLORS.length - 1);
      const year = randomInt(2005, 2023);

      books.push({
        id: `B${String(bookId).padStart(3, '0')}`,
        title: baseBook.title,
        author: baseBook.author,
        category,
        isbn: generateISBN(),
        year,
        coverUrl: `https://via.placeholder.com/150x200/${COVER_COLORS[colorIdx]}/fff?text=${encodeURIComponent(baseBook.title.substring(0, 15))}`,
        rating: Math.round(randomFloat(3.5, 5.0) * 10) / 10,
        totalCopies: randomInt(2, 8),
        availableCopies: randomInt(0, 5)
      });

      bookId++;
    }
  }

  // Ensure availableCopies <= totalCopies
  books.forEach(book => {
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }
  });

  return books;
}

/**
 * Generate loans data (2000 transactions)
 * - 80% returned on time
 * - 15% returned late
 * - 5% still active
 */
function generateLoans(visitors, books) {
  const loans = [];

  // Get unique visitor NIMs
  const uniqueNIMs = [...new Set(visitors.map(v => v.nim))];

  // Create popularity weights for books (80-20 rule)
  // 20% of books get 80% of loans
  const popularBooksCount = Math.ceil(books.length * 0.2);
  const bookWeights = books.map((_, idx) => {
    if (idx < popularBooksCount) {
      return 4; // Popular books get 4x weight
    }
    return 1;
  });

  const baseDate = new Date(); // Use current date

  for (let i = 0; i < 2000; i++) {
    const loanId = `L${String(i + 1).padStart(4, '0')}`;
    const userId = pickRandom(uniqueNIMs);

    // Pick book with weighted selection
    const bookIndex = pickWeighted(
      books.map((_, idx) => idx),
      bookWeights
    );
    const book = books[bookIndex];

    // Generate loan date (within last 60 days to allow for returns)
    const daysAgo = randomInt(0, 60);
    const loanDate = subDays(baseDate, daysAgo);

    // Set loan time to realistic hours (8-17)
    const loanHour = randomInt(8, 17);
    const loanMinute = randomInt(0, 59);
    loanDate.setHours(loanHour, loanMinute, randomInt(0, 59));

    const dueDate = addDays(loanDate, 7); // 7 day loan period

    // Determine status and return date
    let status, returnDate;
    const statusRoll = Math.random();

    if (daysAgo <= 7 && statusRoll < 0.3) {
      // Recent loans more likely to be active
      status = 'active';
      returnDate = null;
    } else if (statusRoll < 0.05) {
      // 5% still active (for older loans)
      status = 'active';
      returnDate = null;
    } else if (statusRoll < 0.20) {
      // 15% returned late
      status = 'late';
      const lateDays = randomInt(1, 7);
      returnDate = addDays(dueDate, lateDays);
      returnDate.setHours(randomInt(8, 17), randomInt(0, 59), randomInt(0, 59));
    } else {
      // 80% returned on time
      status = 'returned';
      const earlyDays = randomInt(0, 6);
      returnDate = addDays(loanDate, earlyDays + 1);
      returnDate.setHours(randomInt(8, 17), randomInt(0, 59), randomInt(0, 59));

      // Make sure return date doesn't exceed due date for on-time returns
      if (returnDate > dueDate) {
        returnDate = new Date(dueDate);
        returnDate.setHours(randomInt(8, 17), randomInt(0, 59), randomInt(0, 59));
      }
    }

    loans.push({
      id: loanId,
      userId,
      bookId: book.id,
      loanDate: loanDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: returnDate ? returnDate.toISOString() : null,
      status
    });
  }

  return loans;
}

// ============================================================================
// AUDIOVISUAL VISITS GENERATOR
// ============================================================================

// Uses GENDERS and ROOMS constants defined above
const GENDER_WEIGHTS = [55, 45]; // Slightly more male visitors

/**
 * Generate audiovisual room visits (500 entries, 30 hari terakhir)
 * Data: nama, nim, gender, visitTime
 */
function generateAudiovisualVisits() {
  const avVisits = [];
  const baseDate = new Date();
  const uniqueNIMs = new Set();

  // Pre-generate ~150 unique students who will visit audiovisual room
  const studentsPool = [];
  for (let i = 0; i < 150; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2024);
    const nim = generateNIM(facultyData.name, year);

    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({
        nim,
        nama: `${firstName} ${pickRandom(LAST_NAMES)}`,
        faculty: facultyData.name,
        prodi: pickRandom(facultyData.majors),
        gender: isFemale ? 'P' : 'L'
      });
    }
  }

  let visitId = 1;

  // Generate 500 audiovisual visits over 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const dayOfWeek = currentDate.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

    // Determine number of AV visits for this day
    let dailyVisits;
    const trafficVariance = Math.random();
    let trafficMultiplier = 1;

    // 20% chance of high traffic day
    if (trafficVariance > 0.8) {
      trafficMultiplier = 1.5;
    }
    // 15% chance of low traffic day
    else if (trafficVariance < 0.15) {
      trafficMultiplier = 0.5;
    }

    if (isWeekendDay) {
      dailyVisits = Math.round(randomInt(5, 12) * trafficMultiplier);
    } else {
      dailyVisits = Math.round(randomInt(12, 25) * trafficMultiplier);
    }

    for (let v = 0; v < dailyVisits && avVisits.length < 500; v++) {
      const student = pickRandom(studentsPool);

      // Generate visit time based on realistic patterns
      let visitHour;
      const hourPattern = Math.random();

      if (hourPattern < 0.20) {
        // Morning: 8-10 AM
        visitHour = 8 + randomFloat(0, 2);
      } else if (hourPattern < 0.50) {
        // Late morning: 10-12 PM
        visitHour = 10 + randomFloat(0, 2);
      } else if (hourPattern < 0.65) {
        // After lunch: 13-15
        visitHour = 13 + randomFloat(0, 2);
      } else {
        // Afternoon: 15-17
        visitHour = 15 + randomFloat(0, 2);
      }

      const visitMinutes = Math.floor((visitHour % 1) * 60);
      const visitHourInt = Math.floor(visitHour);

      const visitTime = new Date(currentDate);
      visitTime.setHours(visitHourInt, visitMinutes, randomInt(0, 59));

      avVisits.push({
        id: `AV${String(visitId).padStart(4, '0')}`,
        nama: student.nama,
        nim: student.nim,
        faculty: student.faculty,
        prodi: student.prodi,
        gender: student.gender,
        visitTime: visitTime.toISOString()
      });

      visitId++;
    }
  }

  return avVisits;
}

// ============================================================================
// GENERATE AND EXPORT DATA
// ============================================================================

// Generate referensi room visits (similar pattern to audiovisual)
function generateReferensiVisits() {
  const refVisits = [];
  const baseDate = new Date();
  const uniqueNIMs = new Set();

  const studentsPool = [];
  for (let i = 0; i < 200; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2024);
    const nim = generateNIM(facultyData.name, year);

    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({
        nim,
        nama: `${firstName} ${pickRandom(LAST_NAMES)}`,
        faculty: facultyData.name,
        prodi: pickRandom(facultyData.majors),
        gender: isFemale ? 'P' : 'L'
      });
    }
  }

  let visitId = 1;

  // Generate 700 referensi visits over 30 days (more than audiovisual)
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const dayOfWeek = currentDate.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

    let dailyVisits;
    const trafficVariance = Math.random();
    let trafficMultiplier = 1;

    if (trafficVariance > 0.8) {
      trafficMultiplier = 1.5;
    } else if (trafficVariance < 0.15) {
      trafficMultiplier = 0.5;
    }

    if (isWeekendDay) {
      dailyVisits = Math.round(randomInt(8, 18) * trafficMultiplier);
    } else {
      dailyVisits = Math.round(randomInt(18, 35) * trafficMultiplier);
    }

    for (let v = 0; v < dailyVisits && refVisits.length < 700; v++) {
      const student = pickRandom(studentsPool);

      let visitHour;
      const hourPattern = Math.random();

      if (hourPattern < 0.25) {
        visitHour = 8 + randomFloat(0, 2);
      } else if (hourPattern < 0.55) {
        visitHour = 10 + randomFloat(0, 2);
      } else if (hourPattern < 0.70) {
        visitHour = 13 + randomFloat(0, 2);
      } else {
        visitHour = 15 + randomFloat(0, 2);
      }

      const visitMinutes = Math.floor((visitHour % 1) * 60);
      const visitHourInt = Math.floor(visitHour);

      const visitTime = new Date(currentDate);
      visitTime.setHours(visitHourInt, visitMinutes, randomInt(0, 59));

      refVisits.push({
        id: `REF${String(visitId).padStart(4, '0')}`,
        nama: student.nama,
        nim: student.nim,
        faculty: student.faculty,
        prodi: student.prodi,
        gender: student.gender,
        visitTime: visitTime.toISOString()
      });

      visitId++;
    }
  }

  return refVisits;
}

// Generate sirkulasi visits for specific floor
function generateSirkulasiVisits(floorNum) {
  const sirkVisits = [];
  const baseDate = new Date();
  const uniqueNIMs = new Set();

  const studentsPool = [];
  const poolSize = floorNum === 1 ? 250 : 200;

  for (let i = 0; i < poolSize; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2024);
    const nim = generateNIM(facultyData.name, year);

    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({
        nim,
        nama: `${firstName} ${pickRandom(LAST_NAMES)}`,
        faculty: facultyData.name,
        prodi: pickRandom(facultyData.majors),
        gender: isFemale ? 'P' : 'L'
      });
    }
  }

  let visitId = 1;
  const maxVisits = floorNum === 1 ? 900 : 750;

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const dayOfWeek = currentDate.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

    let dailyVisits;
    const trafficVariance = Math.random();
    let trafficMultiplier = 1;

    if (trafficVariance > 0.8) {
      trafficMultiplier = 1.5;
    } else if (trafficVariance < 0.15) {
      trafficMultiplier = 0.5;
    }

    if (isWeekendDay) {
      dailyVisits = Math.round(randomInt(10, 22) * trafficMultiplier);
    } else {
      dailyVisits = Math.round(randomInt(25, 45) * trafficMultiplier);
    }

    for (let v = 0; v < dailyVisits && sirkVisits.length < maxVisits; v++) {
      const student = pickRandom(studentsPool);

      let visitHour;
      const hourPattern = Math.random();

      if (hourPattern < 0.20) {
        visitHour = 8 + randomFloat(0, 2);
      } else if (hourPattern < 0.50) {
        visitHour = 10 + randomFloat(0, 2);
      } else if (hourPattern < 0.70) {
        visitHour = 13 + randomFloat(0, 2);
      } else {
        visitHour = 15 + randomFloat(0, 2);
      }

      const visitMinutes = Math.floor((visitHour % 1) * 60);
      const visitHourInt = Math.floor(visitHour);

      const visitTime = new Date(currentDate);
      visitTime.setHours(visitHourInt, visitMinutes, randomInt(0, 59));

      sirkVisits.push({
        id: `SIRK${floorNum}-${String(visitId).padStart(4, '0')}`,
        nama: student.nama,
        nim: student.nim,
        faculty: student.faculty,
        prodi: student.prodi,
        gender: student.gender,
        floor: floorNum,
        visitTime: visitTime.toISOString()
      });

      visitId++;
    }
  }

  return sirkVisits;
}

// Generate Karel visits
function generateKarelVisits() {
  const karelVisits = [];
  const baseDate = new Date();
  const uniqueNIMs = new Set();
  const studentsPool = [];

  for (let i = 0; i < 150; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2024);
    const nim = generateNIM(facultyData.name, year);
    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({ nim, nama: `${firstName} ${pickRandom(LAST_NAMES)}`, faculty: facultyData.name, prodi: pickRandom(facultyData.majors), gender: isFemale ? 'P' : 'L' });
    }
  }

  let visitId = 1;
  for (let dayOffset = 0; dayOffset < 30 && karelVisits.length < 450; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const isWeekendDay = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const dailyVisits = isWeekendDay ? randomInt(5, 12) : randomInt(12, 22);

    for (let v = 0; v < dailyVisits && karelVisits.length < 450; v++) {
      const student = pickRandom(studentsPool);
      const visitHour = 8 + randomFloat(0, 8);
      const visitTime = new Date(currentDate);
      visitTime.setHours(Math.floor(visitHour), Math.floor((visitHour % 1) * 60), randomInt(0, 59));
      karelVisits.push({ id: `KAREL${String(visitId++).padStart(4, '0')}`, ...student, visitTime: visitTime.toISOString() });
    }
  }
  return karelVisits;
}

// Generate SmartLab visits
function generateSmartLabVisits() {
  const smartlabVisits = [];
  const baseDate = new Date();
  const uniqueNIMs = new Set();
  const studentsPool = [];

  for (let i = 0; i < 180; i++) {
    const facultyData = pickWeighted(FACULTIES, FACULTY_WEIGHTS);
    const year = randomInt(2020, 2024);
    const nim = generateNIM(facultyData.name, year);
    if (!uniqueNIMs.has(nim)) {
      uniqueNIMs.add(nim);
      const firstName = pickRandom(FIRST_NAMES);
      const isFemale = ['Siti', 'Dewi', 'Ani', 'Bunga', 'Citra', 'Diana', 'Eka', 'Fitri', 'Gita', 'Hana',
        'Indah', 'Julia', 'Kartika', 'Lestari', 'Maya', 'Novi', 'Oktavia', 'Putri', 'Qirana', 'Ratna',
        'Sari', 'Tari', 'Umi', 'Vira', 'Wulan', 'Yuni', 'Zahra', 'Amelia', 'Bella', 'Cantika'].includes(firstName);
      studentsPool.push({ nim, nama: `${firstName} ${pickRandom(LAST_NAMES)}`, faculty: facultyData.name, prodi: pickRandom(facultyData.majors), gender: isFemale ? 'P' : 'L' });
    }
  }

  let visitId = 1;
  for (let dayOffset = 0; dayOffset < 30 && smartlabVisits.length < 550; dayOffset++) {
    const currentDate = subDays(baseDate, 29 - dayOffset);
    const isWeekendDay = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const dailyVisits = isWeekendDay ? randomInt(8, 15) : randomInt(15, 28);

    for (let v = 0; v < dailyVisits && smartlabVisits.length < 550; v++) {
      const student = pickRandom(studentsPool);
      const visitHour = 8 + randomFloat(0, 9);
      const visitTime = new Date(currentDate);
      visitTime.setHours(Math.floor(visitHour), Math.floor((visitHour % 1) * 60), randomInt(0, 59));
      smartlabVisits.push({ id: `SMART${String(visitId++).padStart(4, '0')}`, ...student, visitTime: visitTime.toISOString() });
    }
  }
  return smartlabVisits;
}

// Generate all data with proper relationships
export const visitors = generateVisitors();
export const books = generateBooks();
export const loans = generateLoans(visitors, books);
export const audiovisualVisits = generateAudiovisualVisits();
export const referensiVisits = generateReferensiVisits();
export const sirkulasiLantai1Visits = generateSirkulasiVisits(1);
export const sirkulasiLantai2Visits = generateSirkulasiVisits(2);
export const karelVisits = generateKarelVisits();
export const smartlabVisits = generateSmartLabVisits();

export const regenerateData = () => {
  window.location.reload();
};

// Data is ready to use



