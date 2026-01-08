/**
 * Analytics Utility Functions untuk Prototype Dashboard
 * 
 * File ini berisi semua fungsi analisis data:
 * - Visitor Analytics (peak hours, duration, distribution, trends)
 * - Loan Analytics (top books, category popularity, late analysis, trends)
 * - Recommendation System (collaborative, content-based, trending)
 * - Helper Functions (date utilities, calculations)
 */

import { 
  parseISO, 
  differenceInMinutes, 
  differenceInDays,
  format, 
  isToday as dateFnsIsToday,
  subDays,
  startOfDay,
  isAfter,
  getHours
} from 'date-fns';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check apakah tanggal adalah hari ini
 * @param {string|Date} date - Tanggal yang akan dicek
 * @returns {boolean} True jika tanggal adalah hari ini
 */
export function isToday(date) {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsIsToday(dateObj);
}

/**
 * Format durasi menit ke format yang mudah dibaca
 * Contoh: 150 -> "2 jam 30 menit"
 * @param {number} minutes - Durasi dalam menit
 * @returns {string} Durasi dalam format yang mudah dibaca
 */
export function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes) || minutes < 0) {
    return '0 menit';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins} menit`;
  } else if (mins === 0) {
    return `${hours} jam`;
  } else {
    return `${hours} jam ${mins} menit`;
  }
}

/**
 * Hitung rata-rata dari array angka
 * @param {number[]} numbers - Array angka
 * @returns {number} Nilai rata-rata, 0 jika array kosong
 */
export function average(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const validNumbers = numbers.filter(n => n != null && !isNaN(n));
  if (validNumbers.length === 0) return 0;
  return validNumbers.reduce((sum, n) => sum + n, 0) / validNumbers.length;
}

/**
 * Hitung median dari array angka
 * @param {number[]} numbers - Array angka
 * @returns {number} Nilai median, 0 jika array kosong
 */
export function median(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  
  // Filter dan sort
  const validNumbers = numbers.filter(n => n != null && !isNaN(n));
  if (validNumbers.length === 0) return 0;
  
  const sorted = [...validNumbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  // Jika jumlah genap, ambil rata-rata 2 nilai tengah
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
}

/**
 * Parse tanggal dari string ISO ke Date object dengan error handling
 * @param {string|Date} date - Tanggal dalam format ISO string atau Date object
 * @returns {Date|null} Date object atau null jika invalid
 */
function safeParse(date) {
  if (!date) return null;
  if (date instanceof Date) return date;
  try {
    return parseISO(date);
  } catch {
    return null;
  }
}

// ============================================================================
// VISITOR ANALYTICS
// ============================================================================

/**
 * Hitung jam sibuk perpustakaan
 * 
 * Logic:
 * 1. Group visitors by hour (0-23)
 * 2. Count visits per hour
 * 3. Mark hours as "peak" if > 1.5x average
 * 
 * @param {Array} visitors - Array of visitor objects
 * @returns {Array} Array jam dengan info visit count dan isPeak
 *   Format: [{ hour: "08:00", visits: 45, isPeak: true }, ...]
 */
export function calculatePeakHours(visitors) {
  if (!visitors || visitors.length === 0) {
    // Return empty hours array
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      visits: 0,
      isPeak: false
    }));
  }

  // Step 1: Group visitors by entry hour
  // Menggunakan Map untuk O(n) performance
  const hourCounts = new Map();
  
  // Initialize semua jam dengan 0
  for (let h = 0; h < 24; h++) {
    hourCounts.set(h, 0);
  }
  
  // Count visits per hour
  visitors.forEach(visitor => {
    const entryTime = safeParse(visitor.entryTime);
    if (entryTime) {
      const hour = getHours(entryTime);
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }
  });

  // Step 2: Calculate average untuk determine peak threshold
  const counts = Array.from(hourCounts.values());
  const avgVisits = average(counts);
  const peakThreshold = avgVisits * 1.5;

  // Step 3: Build result array dengan isPeak flag
  const result = [];
  for (let h = 0; h < 24; h++) {
    const visits = hourCounts.get(h) || 0;
    result.push({
      hour: `${String(h).padStart(2, '0')}:00`,
      visits,
      isPeak: visits > peakThreshold
    });
  }

  return result;
}

/**
 * Hitung durasi rata-rata kunjungan
 * 
 * Logic:
 * 1. Filter visitors yang sudah exit (status = 'exited')
 * 2. Calculate duration = exitTime - entryTime (dalam menit)
 * 3. Return average, median, min, max
 * 
 * @param {Array} visitors - Array of visitor objects
 * @returns {Object} Statistik durasi { average, median, min, max, formatted }
 */
export function calculateAverageDuration(visitors) {
  const defaultResult = {
    average: 0,
    median: 0,
    min: 0,
    max: 0,
    formattedAverage: '0 menit',
    formattedMedian: '0 menit'
  };

  if (!visitors || visitors.length === 0) {
    return defaultResult;
  }

  // Step 1: Filter visitors yang sudah exit dan hitung durasi
  const durations = [];
  
  visitors.forEach(visitor => {
    // Hanya proses yang sudah exit
    if (visitor.status !== 'exited' || !visitor.exitTime || !visitor.entryTime) {
      return;
    }

    const entryTime = safeParse(visitor.entryTime);
    const exitTime = safeParse(visitor.exitTime);
    
    if (entryTime && exitTime) {
      const durationMinutes = differenceInMinutes(exitTime, entryTime);
      // Validasi durasi masuk akal (0 - 720 menit / 12 jam)
      if (durationMinutes >= 0 && durationMinutes <= 720) {
        durations.push(durationMinutes);
      }
    }
  });

  if (durations.length === 0) {
    return defaultResult;
  }

  // Step 2 & 3: Calculate statistics
  const sorted = [...durations].sort((a, b) => a - b);
  const avgValue = average(durations);
  const medianValue = median(durations);
  const minValue = sorted[0];
  const maxValue = sorted[sorted.length - 1];

  return {
    average: Math.round(avgValue),
    median: Math.round(medianValue),
    min: minValue,
    max: maxValue,
    formattedAverage: formatDuration(avgValue),
    formattedMedian: formatDuration(medianValue)
  };
}

/**
 * Distribusi pengunjung per fakultas
 * 
 * Logic:
 * 1. Group by faculty
 * 2. Count dan hitung percentage
 * 3. Sort by count descending
 * 
 * @param {Array} visitors - Array of visitor objects
 * @returns {Array} Distribusi per fakultas
 *   Format: [{ faculty: "Fakultas Teknik", count: 250, percentage: 25 }, ...]
 */
export function getFacultyDistribution(visitors) {
  if (!visitors || visitors.length === 0) {
    return [];
  }

  // Step 1: Group by faculty menggunakan Map untuk O(n)
  const facultyCounts = new Map();
  
  visitors.forEach(visitor => {
    if (visitor.faculty) {
      const current = facultyCounts.get(visitor.faculty) || 0;
      facultyCounts.set(visitor.faculty, current + 1);
    }
  });

  // Step 2: Convert to array dan calculate percentage
  const total = visitors.length;
  const result = Array.from(facultyCounts.entries()).map(([faculty, count]) => ({
    faculty,
    count,
    percentage: Math.round((count / total) * 100 * 10) / 10 // 1 decimal place
  }));

  // Step 3: Sort by count descending
  result.sort((a, b) => b.count - a.count);

  return result;
}

/**
 * Trend kunjungan per hari (N hari terakhir)
 * 
 * Logic:
 * 1. Group by date
 * 2. Count per day
 * 3. Fill missing days dengan 0
 * 
 * @param {Array} visitors - Array of visitor objects
 * @param {number} days - Jumlah hari kebelakang (default 30)
 * @param {Date} referenceDate - Tanggal referensi (default: today dari data)
 * @returns {Array} Trend per hari
 *   Format: [{ date: "2024-01-01", dateFormatted: "1 Jan", visits: 120 }, ...]
 */
export function getVisitorTrend(visitors, days = 30, referenceDate = null) {
  // Determine reference date dari data jika tidak provided
  // Menggunakan tanggal entry terbaru sebagai "today"
  let refDate = referenceDate;
  if (!refDate && visitors && visitors.length > 0) {
    const dates = visitors
      .map(v => safeParse(v.entryTime))
      .filter(d => d != null);
    if (dates.length > 0) {
      refDate = new Date(Math.max(...dates.map(d => d.getTime())));
    }
  }
  if (!refDate) {
    refDate = new Date();
  }

  // Step 1: Initialize semua hari dengan 0
  const dateCounts = new Map();
  for (let i = 0; i < days; i++) {
    const date = subDays(startOfDay(refDate), days - 1 - i);
    const dateKey = format(date, 'yyyy-MM-dd');
    dateCounts.set(dateKey, { date: dateKey, dateObj: date, visits: 0 });
  }

  // Step 2: Count visits per day
  if (visitors && visitors.length > 0) {
    visitors.forEach(visitor => {
      const entryTime = safeParse(visitor.entryTime);
      if (entryTime) {
        const dateKey = format(startOfDay(entryTime), 'yyyy-MM-dd');
        const existing = dateCounts.get(dateKey);
        if (existing) {
          existing.visits++;
        }
      }
    });
  }

  // Step 3: Convert to sorted array
  const result = Array.from(dateCounts.values())
    .sort((a, b) => a.dateObj - b.dateObj)
    .map(item => ({
      date: item.date,
      dateFormatted: format(item.dateObj, 'd MMM'),
      visits: item.visits
    }));

  return result;
}

// ============================================================================
// LOAN ANALYTICS
// ============================================================================

/**
 * Top N buku terpopuler berdasarkan jumlah peminjaman
 * 
 * Logic:
 * 1. Count loans per bookId menggunakan Map (O(n))
 * 2. Join dengan data books untuk get title, author, cover
 * 3. Sort by count descending
 * 4. Return top N
 * 
 * @param {Array} loans - Array of loan objects
 * @param {Array} books - Array of book objects
 * @param {number} limit - Jumlah buku yang diambil (default 10)
 * @returns {Array} Top N buku
 *   Format: [{ id, title, author, coverUrl, category, totalLoans: 45 }, ...]
 */
export function getTopBooks(loans, books, limit = 10) {
  if (!loans || loans.length === 0 || !books || books.length === 0) {
    return [];
  }

  // Step 1: Count loans per book (O(n))
  const loanCounts = new Map();
  loans.forEach(loan => {
    if (loan.bookId) {
      loanCounts.set(loan.bookId, (loanCounts.get(loan.bookId) || 0) + 1);
    }
  });

  // Step 2: Create book lookup map for O(1) access
  const bookMap = new Map();
  books.forEach(book => {
    bookMap.set(book.id, book);
  });

  // Step 3: Build result with book details
  const result = [];
  loanCounts.forEach((totalLoans, bookId) => {
    const book = bookMap.get(bookId);
    if (book) {
      result.push({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        category: book.category,
        rating: book.rating,
        totalLoans
      });
    }
  });

  // Step 4: Sort and limit
  result.sort((a, b) => b.totalLoans - a.totalLoans);
  
  return result.slice(0, limit);
}

/**
 * Kategori buku paling diminati
 * 
 * Logic:
 * 1. Map loans ke category lewat bookId
 * 2. Count per category
 * 3. Sort descending
 * 
 * @param {Array} loans - Array of loan objects
 * @param {Array} books - Array of book objects
 * @returns {Array} Popularity per kategori
 *   Format: [{ category: "Teknologi Informasi", count: 450, percentage: 30 }, ...]
 */
export function getCategoryPopularity(loans, books) {
  if (!loans || loans.length === 0 || !books || books.length === 0) {
    return [];
  }

  // Create book-to-category lookup (O(n))
  const bookCategory = new Map();
  books.forEach(book => {
    bookCategory.set(book.id, book.category);
  });

  // Count loans per category (O(n))
  const categoryCounts = new Map();
  let validLoans = 0;
  
  loans.forEach(loan => {
    const category = bookCategory.get(loan.bookId);
    if (category) {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
      validLoans++;
    }
  });

  // Convert to array with percentage and sort
  const result = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / validLoans) * 100 * 10) / 10
    }))
    .sort((a, b) => b.count - a.count);

  return result;
}

/**
 * Analisis keterlambatan pengembalian
 * 
 * Logic:
 * 1. Filter loans yang late (status = 'late' atau returnDate > dueDate)
 * 2. Calculate late rate percentage
 * 3. Calculate average days late
 * 
 * @param {Array} loans - Array of loan objects
 * @returns {Object} Statistik keterlambatan
 *   Format: { lateRate: 15.5, avgLateDays: 3, totalLate: 150, totalReturned: 1000 }
 */
export function analyzeLateReturns(loans) {
  const defaultResult = {
    lateRate: 0,
    avgLateDays: 0,
    totalLate: 0,
    totalReturned: 0,
    lateByDays: [] // Distribusi keterlambatan per hari
  };

  if (!loans || loans.length === 0) {
    return defaultResult;
  }

  // Filter dan analisis
  const returnedLoans = loans.filter(loan => 
    loan.status === 'returned' || loan.status === 'late'
  );
  
  let lateLoans = 0;
  const lateDays = [];
  const lateDistribution = new Map(); // Untuk distribusi per hari

  returnedLoans.forEach(loan => {
    const returnDate = safeParse(loan.returnDate);
    const dueDate = safeParse(loan.dueDate);
    
    if (returnDate && dueDate) {
      if (isAfter(returnDate, dueDate)) {
        lateLoans++;
        const daysLate = differenceInDays(returnDate, dueDate);
        lateDays.push(daysLate);
        
        // Track distribution
        const dayKey = Math.min(daysLate, 7); // Cap at 7+ days
        lateDistribution.set(dayKey, (lateDistribution.get(dayKey) || 0) + 1);
      }
    } else if (loan.status === 'late') {
      // Fallback jika status sudah 'late'
      lateLoans++;
    }
  });

  const totalReturned = returnedLoans.length;
  const lateRate = totalReturned > 0 
    ? Math.round((lateLoans / totalReturned) * 100 * 10) / 10 
    : 0;

  // Build late distribution array
  const lateByDays = [];
  for (let i = 1; i <= 7; i++) {
    lateByDays.push({
      days: i === 7 ? '7+' : String(i),
      count: lateDistribution.get(i) || 0
    });
  }

  return {
    lateRate,
    avgLateDays: Math.round(average(lateDays) * 10) / 10,
    totalLate: lateLoans,
    totalReturned,
    lateByDays
  };
}

/**
 * Trend peminjaman per bulan
 * 
 * Logic:
 * 1. Group by month
 * 2. Count per month
 * 
 * @param {Array} loans - Array of loan objects
 * @param {number} months - Jumlah bulan kebelakang (default 6)
 * @returns {Array} Trend per bulan
 *   Format: [{ month: "Jan 2024", monthKey: "2024-01", count: 340 }, ...]
 */
export function getLoanTrend(loans, months = 6) {
  if (!loans || loans.length === 0) {
    return [];
  }

  // Find reference date dari data
  const loanDates = loans
    .map(l => safeParse(l.loanDate))
    .filter(d => d != null);
  
  if (loanDates.length === 0) {
    return [];
  }

  const latestDate = new Date(Math.max(...loanDates.map(d => d.getTime())));

  // Initialize months
  const monthCounts = new Map();
  for (let i = 0; i < months; i++) {
    const date = new Date(latestDate.getFullYear(), latestDate.getMonth() - (months - 1 - i), 1);
    const monthKey = format(date, 'yyyy-MM');
    monthCounts.set(monthKey, {
      month: format(date, 'MMM yyyy'),
      monthKey,
      count: 0
    });
  }

  // Count loans per month
  loans.forEach(loan => {
    const loanDate = safeParse(loan.loanDate);
    if (loanDate) {
      const monthKey = format(loanDate, 'yyyy-MM');
      const existing = monthCounts.get(monthKey);
      if (existing) {
        existing.count++;
      }
    }
  });

  // Convert to sorted array
  return Array.from(monthCounts.values())
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

// ============================================================================
// RECOMMENDATION SYSTEM
// ============================================================================

/**
 * Collaborative Filtering: "Yang pinjam buku ini juga pinjam..."
 * 
 * Logic:
 * 1. Find all users yang pinjam targetBookId
 * 2. Find buku lain yang dipinjam users tersebut
 * 3. Count frequency & rank (semakin sering = semakin mirip)
 * 4. Exclude targetBookId dari hasil
 * 
 * @param {string} targetBookId - ID buku target
 * @param {Array} loans - Array of loan objects
 * @param {Array} books - Array of book objects
 * @param {number} limit - Jumlah rekomendasi (default 5)
 * @returns {Array} Rekomendasi buku
 *   Format: [{ id, title, author, coverUrl, category, similarity: 23 }, ...]
 */
export function getCollaborativeRecommendations(targetBookId, loans, books, limit = 5) {
  if (!targetBookId || !loans || loans.length === 0 || !books || books.length === 0) {
    return [];
  }

  // Step 1: Find users yang pinjam target book (O(n))
  const usersWhoBorrowed = new Set();
  loans.forEach(loan => {
    if (loan.bookId === targetBookId) {
      usersWhoBorrowed.add(loan.userId);
    }
  });

  if (usersWhoBorrowed.size === 0) {
    return [];
  }

  // Step 2: Find other books borrowed by these users (O(n))
  const bookFrequency = new Map();
  loans.forEach(loan => {
    if (usersWhoBorrowed.has(loan.userId) && loan.bookId !== targetBookId) {
      bookFrequency.set(loan.bookId, (bookFrequency.get(loan.bookId) || 0) + 1);
    }
  });

  // Step 3: Create book lookup
  const bookMap = new Map();
  books.forEach(book => bookMap.set(book.id, book));

  // Step 4: Build and sort results
  const recommendations = [];
  bookFrequency.forEach((similarity, bookId) => {
    const book = bookMap.get(bookId);
    if (book) {
      recommendations.push({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        category: book.category,
        rating: book.rating,
        similarity // Higher = more users also borrowed this
      });
    }
  });

  // Sort by similarity descending
  recommendations.sort((a, b) => b.similarity - a.similarity);

  return recommendations.slice(0, limit);
}

/**
 * Content-Based: Rekomendasi berdasarkan kategori favorit user
 * 
 * Logic:
 * 1. Get riwayat peminjaman user
 * 2. Find kategori favorit (most borrowed category)
 * 3. Recommend buku dari kategori yang sama yang belum dipinjam
 * 4. Sort by rating
 * 
 * @param {string} userId - NIM/ID user
 * @param {Array} loans - Array of loan objects
 * @param {Array} books - Array of book objects
 * @param {number} limit - Jumlah rekomendasi (default 5)
 * @returns {Array} Rekomendasi buku
 *   Format: [{ id, title, author, category, coverUrl, rating }, ...]
 */
export function getContentBasedRecommendations(userId, loans, books, limit = 5) {
  if (!userId || !loans || loans.length === 0 || !books || books.length === 0) {
    return [];
  }

  // Step 1: Get user's borrowed books
  const userLoans = loans.filter(loan => loan.userId === userId);
  if (userLoans.length === 0) {
    // Return highest rated books if user has no history
    return [...books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        coverUrl: book.coverUrl,
        rating: book.rating
      }));
  }

  // Create book lookup
  const bookMap = new Map();
  books.forEach(book => bookMap.set(book.id, book));

  // Step 2: Find favorite categories
  const categoryCount = new Map();
  const borrowedBookIds = new Set();
  
  userLoans.forEach(loan => {
    borrowedBookIds.add(loan.bookId);
    const book = bookMap.get(loan.bookId);
    if (book) {
      categoryCount.set(book.category, (categoryCount.get(book.category) || 0) + 1);
    }
  });

  // Sort categories by frequency
  const sortedCategories = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  if (sortedCategories.length === 0) {
    return [];
  }

  // Step 3: Find books from favorite categories that user hasn't borrowed
  const recommendations = [];
  
  // Prioritize by category order (most favorite first)
  sortedCategories.forEach((category, categoryIndex) => {
    books
      .filter(book => 
        book.category === category && 
        !borrowedBookIds.has(book.id)
      )
      .forEach(book => {
        recommendations.push({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          coverUrl: book.coverUrl,
          rating: book.rating,
          categoryPriority: categoryIndex
        });
      });
  });

  // Step 4: Sort by category priority, then by rating
  recommendations.sort((a, b) => {
    if (a.categoryPriority !== b.categoryPriority) {
      return a.categoryPriority - b.categoryPriority;
    }
    return b.rating - a.rating;
  });

  // Remove categoryPriority from output
  return recommendations.slice(0, limit).map(({ categoryPriority, ...rest }) => rest);
}

/**
 * Trending: Buku paling banyak dipinjam dalam periode tertentu
 * 
 * Logic:
 * 1. Filter loans dalam X hari terakhir dari tanggal referensi
 * 2. Count per book
 * 3. Return top N dengan detail buku
 * 
 * @param {Array} loans - Array of loan objects
 * @param {Array} books - Array of book objects
 * @param {number} daysRange - Jumlah hari kebelakang (default 7)
 * @param {number} limit - Jumlah buku (default 10)
 * @returns {Array} Trending books (format sama seperti getTopBooks)
 */
export function getTrendingBooks(loans, books, daysRange = 7, limit = 10) {
  if (!loans || loans.length === 0 || !books || books.length === 0) {
    return [];
  }

  // Find latest date in data for reference
  const loanDates = loans
    .map(l => safeParse(l.loanDate))
    .filter(d => d != null);
  
  if (loanDates.length === 0) {
    return [];
  }

  const latestDate = new Date(Math.max(...loanDates.map(d => d.getTime())));
  const cutoffDate = subDays(latestDate, daysRange);

  // Step 1: Filter loans within date range
  const recentLoans = loans.filter(loan => {
    const loanDate = safeParse(loan.loanDate);
    return loanDate && isAfter(loanDate, cutoffDate);
  });

  // Step 2: Use getTopBooks with filtered loans
  return getTopBooks(recentLoans, books, limit);
}

// ============================================================================
// DASHBOARD SUMMARY FUNCTIONS
// ============================================================================

/**
 * Generate summary statistics untuk dashboard overview
 * 
 * @param {Array} visitors - Array of visitor objects
 * @param {Array} books - Array of book objects
 * @param {Array} loans - Array of loan objects
 * @returns {Object} Summary statistics
 */
export function getDashboardSummary(visitors, books, loans) {
  // Today's stats (based on latest date in data)
  let todayDate = new Date();
  if (visitors && visitors.length > 0) {
    const dates = visitors.map(v => safeParse(v.entryTime)).filter(d => d != null);
    if (dates.length > 0) {
      todayDate = new Date(Math.max(...dates.map(d => d.getTime())));
    }
  }

  const todayVisitors = visitors?.filter(v => {
    const entryDate = safeParse(v.entryTime);
    return entryDate && format(entryDate, 'yyyy-MM-dd') === format(todayDate, 'yyyy-MM-dd');
  }) || [];

  const currentlyInside = visitors?.filter(v => v.status === 'inside') || [];

  const activeLoans = loans?.filter(l => l.status === 'active') || [];

  const lateAnalysis = analyzeLateReturns(loans);
  const durationStats = calculateAverageDuration(visitors);

  return {
    // Visitors
    totalVisitorsToday: todayVisitors.length,
    currentlyInside: currentlyInside.length,
    averageDuration: durationStats.formattedAverage,
    
    // Books
    totalBooks: books?.length || 0,
    totalAvailableBooks: books?.reduce((sum, b) => sum + (b.availableCopies || 0), 0) || 0,
    
    // Loans
    totalActiveLoans: activeLoans.length,
    lateRate: lateAnalysis.lateRate,
    
    // Meta
    lastUpdated: format(todayDate, 'dd MMM yyyy HH:mm')
  };
}

/**
 * Get active visitors (currently inside library)
 * 
 * @param {Array} visitors - Array of visitor objects
 * @returns {Array} Visitors yang masih di dalam perpustakaan
 */
export function getActiveVisitors(visitors) {
  if (!visitors || visitors.length === 0) {
    return [];
  }

  return visitors
    .filter(v => v.status === 'inside')
    .map(v => ({
      id: v.id,
      name: v.name,
      nim: v.nim,
      faculty: v.faculty,
      major: v.major,
      entryTime: v.entryTime,
      entryTimeFormatted: safeParse(v.entryTime) 
        ? format(safeParse(v.entryTime), 'HH:mm') 
        : '-'
    }));
}

/**
 * Search books by title or author
 * 
 * @param {Array} books - Array of book objects
 * @param {string} query - Search query
 * @returns {Array} Matching books
 */
export function searchBooks(books, query) {
  if (!books || books.length === 0 || !query || query.trim() === '') {
    return books || [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return books.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    book.category.toLowerCase().includes(lowerQuery)
  );
}
