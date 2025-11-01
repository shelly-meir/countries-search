import { useState, useEffect, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Country, SortOption } from './types/country';
import { fetchAllCountries } from './services/api';
import { CountryCard } from './components/CountryCard';
import { SearchBar } from './components/SearchBar';
import { SortControls } from './components/SortControls';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import { useDebounce } from './hooks/useDebounce';

/**
 * Main App Component
 */
function App() {

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  // Debounce search term to avoid filtering on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Extract country names for autocomplete
  const countryNames = useMemo(() =>
    countries.map(country => country.name.common),
    [countries]
  );

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Skip if we've already fetched (prevents StrictMode double-call)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []); // Empty dependency array = run once on mount


  const filteredAndSortedCountries = useMemo(() => {
    // Step 1: Filter by search term (using debounced value for performance)
    let filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    // Step 2: Sort based on selected option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.common.localeCompare(b.name.common);
        case 'name-desc':
          return b.name.common.localeCompare(a.name.common);
        case 'population-asc':
          return a.population - b.population;
        case 'population-desc':
          return b.population - a.population;
        default:
          return 0;
      }
    });

    return sorted;
  }, [countries, debouncedSearchTerm, sortOption]); // Recalculate when these change


  const handleRetry = () => {
    // Reset the ref to allow refetching
    hasFetchedRef.current = false;

    // Trigger a re-fetch by resetting states
    setLoading(true);
    setError(null);
    fetchAllCountries()
      .then(setCountries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const parentRef = useRef<HTMLDivElement>(null);

  // Determine number of columns based on screen width
  // This matches our Tailwind grid: 1 col mobile, 2 sm, 3 lg, 4 xl
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 1;  // mobile
    if (width < 1024) return 2; // tablet
    if (width < 1280) return 3; // desktop
    return 4; // large desktop
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  // Update column count on window resize
  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group countries into rows based on column count
  const rows = useMemo(() => {
    const result: Country[][] = [];
    for (let i = 0; i < filteredAndSortedCountries.length; i += columnCount) {
      result.push(filteredAndSortedCountries.slice(i, i + columnCount));
    }
    return result;
  }, [filteredAndSortedCountries, columnCount]);

  // Virtual scrolling for rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320, // Estimated row height (card height + gap)
    overscan: 2, // Render 2 extra rows above/below viewport
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-xl font-semibold">Countries</h1>
            </div>
            {!loading && !error && (
              <div className="text-sm text-muted-foreground">
                {countries.length} countries
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="w-full sm:w-96">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  suggestions={countryNames}
                />
              </div>
              <SortControls
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedCountries.length === countries.length
                  ? `Showing all ${countries.length} countries`
                  : `Showing ${filteredAndSortedCountries.length} of ${countries.length} countries`}
              </p>
            </div>

            {/* Countries Grid with Virtual Scrolling */}
            {filteredAndSortedCountries.length > 0 ? (
              <div
                ref={parentRef}
                className="h-[calc(100vh-320px)] overflow-auto"
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1">
                        {rows[virtualRow.index].map((country) => (
                          <CountryCard
                            key={country.cca3}
                            country={country}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-1">No countries found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No results for "{debouncedSearchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data from{' '}
            <a
              href="https://restcountries.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              REST Countries API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
