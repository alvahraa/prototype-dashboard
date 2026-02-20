import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Hook untuk animasi counting
function useCountUp(endValue, duration = 1000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (endValue === 0) {
            setCount(0);
            return;
        }

        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [endValue, duration]);

    return count;
}

// Single KPI Card - Premium Style
function KPICard({ icon: Icon, label, title, value, subLabel, trend, trendUp, status, color, loading, index = 0, customDisplay }) {
    // Handle different prop names (label vs title) to be compatible with both usages
    const displayLabel = label || title;

    // Determine trend color
    const getTrendColor = () => {
        // Explicit color overrides
        if (color === 'rose') return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10';
        if (color === 'emerald') return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
        if (color === 'blue') return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10';

        // Logic based on trendUp prop (Good = Emerald, Bad/Down = Rose usually, but depends on context)
        // Adjust logic: If trendUp is true (Good), use Emerald. If false (Bad), use Rose.
        if (trendUp === true) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
        if (trendUp === false) return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10';

        // Fallback based on trend value (Positive = Green, Negative = Red)
        if (trend > 0) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
        if (trend < 0) return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10';

        return 'text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50';
    };

    const animatedValue = useCountUp(loading ? 0 : value, 1200);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                delay: index * 0.08
            }}
            whileHover={{ y: -3 }}
            className={`rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${loading ? 'bg-gray-100 dark:bg-[#1e293b] border-transparent' :
                'bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-700/50'
                } ${customDisplay ? 'border-l-4 border-l-indigo-500' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Label - Muted */}
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-3">{displayLabel}</p>

                    {/* Value */}
                    <div className="flex items-baseline gap-3">
                        {loading ? (
                            <div className="h-10 w-20 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                        ) : customDisplay ? (
                            customDisplay
                        ) : (
                            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
                                {animatedValue.toLocaleString('id-ID')}
                            </span>
                        )}

                        {/* Trend indicator - Subtle */}
                        {(trend || status) && !loading && (
                            <span className={`text-xs font-medium flex items-center gap-0.5 px-2 py-1 rounded-full ${getTrendColor()}`}>
                                {trend && (trend > 0 || trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                                {trend || status}
                            </span>
                        )}
                    </div>

                    {/* Sub label */}
                    {subLabel && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{subLabel}</p>
                    )}
                </div>

                {/* Icon - Subtle background */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                    <Icon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                </div>
            </div>
        </motion.div>
    );
}

export default KPICard;
