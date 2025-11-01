import type { Country } from '../types/country';

interface CountryCardProps {
  country: Country;
}/**
 * CountryCard Component
 * Displays a single country's information in a card format
 */
export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  // Format population with thousands separators
  const formattedPopulation = country.population.toLocaleString();
  // Get the capital city (first one if multiple exist)
  const capital = country.capital?.[0] || 'N/A';

  return (
    <div className="group bg-white rounded-lg border border-border hover:border-gray-400 transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Flag Image */}
      <div className="relative h-40 overflow-hidden bg-gray-50">
        <img
          src={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Country Information */}
      <div className="p-4">
        {/* Country Name */}
        <h3 className="font-semibold text-foreground text-lg mb-3 truncate group-hover:text-primary transition-colors duration-200">
          {country.name.common}
        </h3>

        {/* Country Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Capital</span>
            <span className="font-medium text-foreground truncate ml-2">{capital}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Population</span>
            <span className="font-medium text-foreground">{formattedPopulation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
