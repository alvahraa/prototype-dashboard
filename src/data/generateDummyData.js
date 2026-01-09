/**
 * Dummy Data Generator untuk Prototype Dashboard
 * 
 * Data ini mencakup:
 * - 1000 visitor entries (30 hari terakhir)
 * - 200 buku dengan berbagai kategori
 * - 2000 transaksi peminjaman
 */

import { subDays, addMinutes, addDays } from 'date-fns';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Seeded random untuk konsistensi data
let seed = 12345;
function seededRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return seededRandom() * (max - min) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function pickWeighted(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = seededRandom() * totalWeight;
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
  { name: 'Fakultas Teknik', majors: ['Teknik Informatika', 'Teknik Elektro', 'Teknik Mesin', 'Teknik Sipil', 'Teknik Industri'] },
  { name: 'Fakultas Hukum', majors: ['Ilmu Hukum'] },
  { name: 'Fakultas Ekonomi & Bisnis', majors: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan'] },
  { name: 'Fakultas Kedokteran', majors: ['Pendidikan Dokter', 'Farmasi', 'Gizi'] },
  { name: 'Fakultas Keguruan & Ilmu Pendidikan', majors: ['Pendidikan Matematika', 'Pendidikan Bahasa Inggris', 'Pendidikan Guru SD'] },
  { name: 'Fakultas Ilmu Keperawatan', majors: ['Ilmu Keperawatan', 'Kebidanan'] },
  { name: 'Fakultas Agama Islam', majors: ['Pendidikan Agama Islam', 'Ekonomi Syariah'] },
  { name: 'Fakultas Psikologi', majors: ['Psikologi'] },
  { name: 'Fakultas Bahasa & Ilmu Komunikasi', majors: ['Ilmu Komunikasi', 'Sastra Inggris'] }
];

const FACULTY_WEIGHTS = [25, 12, 18, 10, 12, 8, 5, 5, 5]; // Teknik paling banyak

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
      studentsPool.push({
        nim,
        name: `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`,
        faculty: facultyData.name,
        major: pickRandom(facultyData.majors)
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
    // Weekdays: 30-50 visitors, Weekends: 10-20 visitors
    let dailyVisitors;
    if (isWeekendDay) {
      dailyVisitors = randomInt(10, 20);
    } else {
      dailyVisitors = randomInt(30, 50);
    }
    
    for (let v = 0; v < dailyVisitors && visitors.length < 1000; v++) {
      const student = pickRandom(studentsPool);
      
      // Generate entry time based on realistic patterns
      // 70% during work hours (8-17)
      // Peak hours: 10-11 and 14-15
      let entryHour;
      const hourPattern = seededRandom();
      
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
      const durationRoll = seededRandom();
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
      if (dayOffset >= 29 && seededRandom() < 0.05) {
        status = 'inside'; // ~5% of today's visitors are still inside
      }
      
      visitors.push({
        id: `V${String(visitorId).padStart(4, '0')}`,
        name: student.name,
        nim: student.nim,
        faculty: student.faculty,
        major: student.major,
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
    const statusRoll = seededRandom();
    
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
// GENERATE AND EXPORT DATA
// ============================================================================

// Generate all data with proper relationships
export const visitors = generateVisitors();
export const books = generateBooks();
export const loans = generateLoans(visitors, books);

// Data is ready to use
// visitors: 1000 entries, books: 200 entries, loans: 2000 entries
