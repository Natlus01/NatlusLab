import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari berdasarkan nama atau kode...',
  className = '',
  ariaLabel = 'Pencarian data',
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <span className="absolute left-3.5 text-blueGray-400 pointer-events-none" aria-hidden="true">
        <Search className="w-4 h-4" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-xs rounded border border-blueGray-300 bg-white text-blueGray-700 placeholder:text-blueGray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-lightBlue-500 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus kata kunci pencarian"
          className="absolute right-2 p-1.5 text-blueGray-400 hover:text-blueGray-600 rounded transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
