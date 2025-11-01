import { useEffect, useState } from 'react';

/**
 * Custom debounce hook
 * Delays updating a value until the user stops typing for a specified time
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - clear timer if value changes before delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
