import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * Search input untuk cari buku atau mahasiswa
 */

function SearchBar({ 
  placeholder = "Cari buku atau mahasiswa...",
  onSearch,
  suggestions = [],
  onSelect
}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch?.('');
  };

  const handleSelect = (item) => {
    setQuery(item.label || item.title || item.name);
    setShowSuggestions(false);
    onSelect?.(item);
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm transition-all"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-auto">
          {suggestions.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-border last:border-b-0"
            >
              <p className="text-sm font-medium text-black">
                {item.title || item.name || item.label}
              </p>
              {item.subtitle && (
                <p className="text-xs text-text-secondary">{item.subtitle}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
