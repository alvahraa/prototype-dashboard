import React, { createContext, useContext, useState, useEffect } from 'react';

// Production-safe: no dummy data import. Notifications use real data or empty defaults.
const visitors = [];
const loans = [];
const books = [];

/**
 * NotificationContext
 * 
 * Analyzes generated simulation data and creates reactive notifications:
 * - [WARNING] Overdue items detected
 * - [ALERT] High traffic detected
 * - [INFO] System status updates
 */

const NotificationContext = createContext(null);

// Notification types
const NOTIFICATION_TYPES = {
  ALERT: 'alert',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success'
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Analyze data and generate notifications on mount
  useEffect(() => {
    const alerts = analyzeDataAndGenerateAlerts();
    setNotifications(alerts);
    setUnreadCount(alerts.filter(n => !n.read).length);
  }, []);

  // Analyze simulation data
  function analyzeDataAndGenerateAlerts() {
    const now = new Date();
    const alerts = [];
    let alertId = 1;

    // 1. Analyze Overdue Loans
    const overdueLoans = loans.filter(loan => {
      if (loan.returnDate) return false; // Already returned
      const dueDate = new Date(loan.dueDate);
      return dueDate < now;
    });

    if (overdueLoans.length > 0) {
      alerts.push({
        id: alertId++,
        type: NOTIFICATION_TYPES.WARNING,
        title: '[WARNING] Overdue Detection',
        message: `System Warning: ${overdueLoans.length} overdue items detected. Immediate action required.`,
        timestamp: now.toISOString(),
        read: false
      });
    }

    // 2. Analyze Late Returns (returned after due date)
    const lateReturns = loans.filter(loan => loan.status === 'late');
    if (lateReturns.length > 10) {
      alerts.push({
        id: alertId++,
        type: NOTIFICATION_TYPES.ALERT,
        title: '[ALERT] High Late Return Rate',
        message: `System Alert: ${lateReturns.length} late returns recorded this period. Consider policy review.`,
        timestamp: now.toISOString(),
        read: false
      });
    }

    // 3. Analyze Today's Traffic
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayVisitors = visitors.filter(v => {
      const entryTime = new Date(v.entryTime);
      return entryTime >= todayStart && entryTime <= todayEnd;
    });

    const HIGH_TRAFFIC_THRESHOLD = 40;
    if (todayVisitors.length > HIGH_TRAFFIC_THRESHOLD) {
      alerts.push({
        id: alertId++,
        type: NOTIFICATION_TYPES.ALERT,
        title: '[ALERT] High Traffic Detected',
        message: `Traffic Alert: ${todayVisitors.length} visitors today exceeds threshold of ${HIGH_TRAFFIC_THRESHOLD}.`,
        timestamp: now.toISOString(),
        read: false
      });
    }

    // 4. Low Inventory Alert
    const lowStockBooks = books.filter(b => b.availableCopies === 0);
    if (lowStockBooks.length > 5) {
      alerts.push({
        id: alertId++,
        type: NOTIFICATION_TYPES.WARNING,
        title: '[WARNING] Stock Alert',
        message: `Inventory Warning: ${lowStockBooks.length} books have zero available copies.`,
        timestamp: now.toISOString(),
        read: false
      });
    }

    // 5. System Status - Always show
    alerts.push({
      id: alertId++,
      type: NOTIFICATION_TYPES.INFO,
      title: '[INFO] Simulation Refresh',
      message: `System Info: Simulation data refreshed. Generated ${visitors.length} visitors, ${loans.length} loans.`,
      timestamp: now.toISOString(),
      read: false
    });

    // 6. Active Loans Summary
    const activeLoans = loans.filter(l => l.status === 'active');
    if (activeLoans.length > 0) {
      alerts.push({
        id: alertId++,
        type: NOTIFICATION_TYPES.INFO,
        title: '[INFO] Active Loans',
        message: `Current Status: ${activeLoans.length} active loans in the system.`,
        timestamp: now.toISOString(),
        read: false
      });
    }

    return alerts.sort((a, b) => {
      // Sort by type priority: ALERT > WARNING > INFO
      const priority = { alert: 0, warning: 1, info: 2, success: 3 };
      return priority[a.type] - priority[b.type];
    });
  }

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export default NotificationContext;
