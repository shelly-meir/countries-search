import type { Country } from '../types/country';

// Base URL for the REST Countries API v3.1
const BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Fetches all countries from the REST Countries API
 * @returns Promise<Country[]> - Array of country objects
 * @throws Error if the API request fails
 */
export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    // Only fetch the fields we need to reduce payload size
    const fields = 'name,capital,population,flags,cca3';
    const response = await fetch(`${BASE_URL}/all?fields=${fields}`);

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data: Country[] = await response.json();
    return data;
  } catch (error) {
    // Re-throw with a more user-friendly message
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries. Please check your internet connection and try again.');
  }
};
