import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * DateRangePicker Component
 * 
 * Komponen untuk memilih rentang tanggal dengan preset options.
 */

// Preset date ranges
const PRESETS = [
  { label: 'Hari Ini', days: 0 },
  { label: '7 Hari Terakhir', days: 7 },
  { label: '30 Hari Terakhir', days: 30 },
  { label: '3 Bulan Terakhir', days: 90 },
  { label: 'Semua Waktu', days: null },
];

function DateRangePicker({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('30 Hari Terakhir');

  // Helper to format date to local ISO string (YYYY-MM-DDTHH:mm:ss.sss)
  const formatLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 23);
  };

  // Calculate date range from preset
  const calculateDateRange = (days) => {
    if (days === null) {
      return { startDate: null, endDate: null };
    }

    // End date is NOW
    const endDate = new Date();

    // Start date calculation
    const startDate = new Date();
    if (days === 0) {
      // Calculate start of day in local time
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);
    }

    return {
      startDate: formatLocalISO(startDate),
      endDate: formatLocalISO(endDate),
    };
  };

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.label);
    const range = calculateDateRange(preset.days);
    onChange?.(range);
    setIsOpen(false);
  };

  // Format display text
  const displayText = useMemo(() => {
    if (value?.startDate && value?.endDate) {
      const start = new Date(value.startDate);
      const end = new Date(value.endDate);
      const formatter = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
      });
      return `${formatter.format(start)} - ${formatter.format(end)}`;
    }
    return selectedPreset;
  }, [value, selectedPreset]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-outline flex items-center gap-2 text-sm dark:text-slate-200 dark:border-dark-border-accent dark:hover:bg-dark-800 ${isOpen ? 'bg-gray-50 dark:bg-dark-800' : ''}`}
      >
        <Calendar className="w-4 h-4" />
        <span>{displayText}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border-accent py-2 z-50 min-w-[180px]">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetSelect(preset)}
                className={`
                  w-full px-4 py-2 text-left text-sm transition-colors
                  text-gray-700 dark:text-slate-300
                  hover:bg-gray-50 dark:hover:bg-dark-700
                  ${selectedPreset === preset.label ? 'bg-gray-100 dark:bg-dark-700 font-medium text-gray-900 dark:text-slate-100' : ''}
                `}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DateRangePicker;
