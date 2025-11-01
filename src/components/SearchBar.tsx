import { useState, useRef, useEffect } from 'react';

// Props interface - defines what data this component receives from parent
interface SearchBarProps {
  searchTerm: string;                          // Current search value
  onSearchChange: (term: string) => void;      // Callback function
  suggestions?: string[];                      // Optional autocomplete suggestions
}

/**
 * Highlight Component - Highlights matching text in suggestions
 */
const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  // Create regex to find all matches (case insensitive)
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="font-semibold text-foreground">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

/**
 * SearchBar Component with Autocomplete
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  suggestions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on search term
  const filteredSuggestions = suggestions
    .filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
      suggestion.toLowerCase() !== searchTerm.toLowerCase()
    )
    .slice(0, 8); // Limit to 8 suggestions

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      if (e.key === 'ArrowDown' && searchTerm) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSearchChange(filteredSuggestions[selectedIndex]);
          setIsOpen(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (value: string) => {
    onSearchChange(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search countries..."
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => searchTerm && setIsOpen(true)}
        className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-input rounded-md
                   focus:outline-none focus:ring-1 focus:ring-ring
                   placeholder:text-muted-foreground"
        autoComplete="off"
      />
      {searchTerm && (
        <button
          onClick={() => {
            onSearchChange('');
            setIsOpen(false);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors
                ${index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <HighlightText text={suggestion} highlight={searchTerm} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
