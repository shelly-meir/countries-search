// This interface defines the shape of data we get from REST Countries API
export interface Country {
  name: {
    common: string;      // The common name of the country
    official: string;    // The official name
  };
  capital?: string[];    // Array of capital cities (optional, some countries have multiple or none)
  population: number;    // Population count
  flags: {
    png: string;         // URL to PNG flag image
    svg: string;         // URL to SVG flag image
    alt?: string;        // Alternative text for flag
  };
  cca3: string;          // 3-letter country code (used as unique identifier)
}

// Type for sort options - similar to enums in Angular
export type SortOption = 'name-asc' | 'name-desc' | 'population-asc' | 'population-desc';
