import type { SortOption } from '../types/country';

interface SortControlsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

/**
 * SortControls Component
 * Provides buttons to sort countries by name or population
 */
export const SortControls: React.FC<SortControlsProps> = ({ sortOption, onSortChange }) => {
  const isActive = (option: SortOption) => sortOption === option;

  const getButtonClass = (option: SortOption) =>
    `px-3 py-1.5 text-sm rounded-md transition-colors ${
      isActive(option)
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Sort by:</span>
        <div className="flex gap-1">
          <button
            onClick={() => onSortChange('name-asc')}
            className={getButtonClass('name-asc')}
          >
            Name A-Z
          </button>
          <button
            onClick={() => onSortChange('name-desc')}
            className={getButtonClass('name-desc')}
          >
            Name Z-A
          </button>
        </div>
      </div>
      <div className="h-4 w-px bg-border hidden sm:block" />
      <div className="flex gap-1">
        <button
          onClick={() => onSortChange('population-asc')}
          className={getButtonClass('population-asc')}
        >
          Population ↑
        </button>
        <button
          onClick={() => onSortChange('population-desc')}
          className={getButtonClass('population-desc')}
        >
          Population ↓
        </button>
      </div>
    </div>
  );
};
