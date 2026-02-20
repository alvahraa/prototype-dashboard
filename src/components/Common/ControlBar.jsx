
import React, { useState } from 'react';
import { Download, Calendar, ChevronDown } from 'lucide-react';

/**
 * ControlBar Component
 * 
 * Global control bar with:
 * - Date range dropdown
 * - Export button
 */

const dateOptions = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'month', label: 'This Month' },
  { id: 'custom', label: 'Custom Range' },
];

function ControlBar({ onDateChange, onExport }) {
  const [selectedDate, setSelectedDate] = useState('30d');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDateSelect = (option) => {
    setSelectedDate(option.id);
    setIsDropdownOpen(false);
    console.log(`Date range updated to: ${option.label}`);
    if (onDateChange) {
      onDateChange(option);
    }
  };

  const handleExport = () => {
    console.log('Export triggered');
    if (onExport) {
      onExport();
    } else {
      alert('Export feature: Data akan di-export sebagai CSV');
    }
  };

  const selectedOption = dateOptions.find(o => o.id === selectedDate);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{selectedOption?.label}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                {dateOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDateSelect(option)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      selectedDate === option.id ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Current Selection Info */}
        <span className="text-sm text-gray-400">
          Data period: <span className="text-gray-600 font-medium">{selectedOption?.label}</span>
        </span>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>
    </div>
  );
}

export default ControlBar;
