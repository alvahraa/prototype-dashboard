import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  PackageX, 
  Terminal,
  Play,
  CheckCircle,
  X
} from 'lucide-react';

/**
 * SmartInsights Component - The AI Brain
 * 
 * Dynamic recommendations based on data analysis
 * - No emojis, only Lucide icons
 * - Terminal-style command execution
 * - Monospace font for technical feel
 */

// Toast notification state
let toastQueue = [];
let setToasts = null;

// Generate insight ID
function generateInsightId() {
  return `INS-${Date.now().toString(36).toUpperCase()}`;
}

// Terminal Toast Component
function TerminalToast({ message, onClose, status = 'running' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <div className="bg-gray-900 text-green-400 px-4 py-3 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 font-mono">SYSTEM_ROOT</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-2 font-mono text-sm">
          <span className="text-gray-500">&gt; </span>
          <span>{message}</span>
          {status === 'success' && (
            <span className="text-emerald-400 ml-2">[SUCCESS]</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Insight Card Component
function InsightCard({ insight, onExecute }) {
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);
    await onExecute(insight);
    setTimeout(() => setExecuting(false), 1500);
  };

  const iconMap = {
    warning: AlertTriangle,
    spike: TrendingUp,
    stockout: PackageX,
  };

  const colorMap = {
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    spike: 'bg-blue-50 text-blue-600 border-blue-200',
    stockout: 'bg-rose-50 text-rose-600 border-rose-200',
  };

  const Icon = iconMap[insight.type] || AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${colorMap[insight.type] || colorMap.warning}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
            <code className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {insight.id}
            </code>
          </div>
          <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
          <motion.button
            onClick={handleExecute}
            disabled={executing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg disabled:opacity-50"
          >
            {executing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{insight.action}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Main SmartInsights Component
function SmartInsights({ lateLoans = 0, visitorCount = 0, avgVisitors = 0, topBooks = [] }) {
  const [toast, setToast] = useState(null);

  // Generate insights based on data
  const insights = [];

  // High delinquency detection
  if (lateLoans > 5) {
    insights.push({
      id: generateInsightId(),
      type: 'warning',
      title: 'High Delinquency Detected',
      description: `${lateLoans} overdue loans require attention. Consider sending batch reminders.`,
      action: 'Run Protocol',
      command: '/usr/bin/send_reminders.py --batch --priority=high',
    });
  }

  // Traffic spike detection
  if (visitorCount > avgVisitors * 1.2 && avgVisitors > 0) {
    insights.push({
      id: generateInsightId(),
      type: 'spike',
      title: 'Traffic Spike Detected',
      description: `Visitor count is ${Math.round((visitorCount / avgVisitors - 1) * 100)}% above average. Peak hours protocol may be needed.`,
      action: 'Activate Protocol',
      command: '/usr/bin/peak_hours_protocol.sh --mode=active',
    });
  }

  // Stockout alert
  const outOfStock = topBooks.find(book => book.stock === 0);
  if (outOfStock) {
    insights.push({
      id: generateInsightId(),
      type: 'stockout',
      title: 'Stockout Alert',
      description: `"${outOfStock.title}" has 0 copies available. Restock required.`,
      action: 'Request Restock',
      command: `/usr/bin/restock_request.py --book-id=${outOfStock.id}`,
    });
  }

  // Execute command handler
  const handleExecute = async (insight) => {
    // Show terminal toast
    setToast({
      message: `Executing script ${insight.command}`,
      status: 'running',
    });

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    setToast({
      message: `Executed: ${insight.command}`,
      status: 'success',
    });

    // Auto-close after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  if (insights.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Terminal className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Smart Insights</h3>
            <p className="text-xs text-gray-500 font-mono">STATUS: ALL_SYSTEMS_NOMINAL</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl text-emerald-700">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">No critical issues detected. All metrics within normal parameters.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Terminal className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Smart Insights</h3>
            <p className="text-xs text-gray-500 font-mono">
              {insights.length} ACTIVE_ALERT{insights.length > 1 ? 'S' : ''}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {insights.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onExecute={handleExecute}
            />
          ))}
        </div>
      </div>

      {/* Terminal Toast */}
      <AnimatePresence>
        {toast && (
          <TerminalToast
            message={toast.message}
            status={toast.status}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default SmartInsights;
