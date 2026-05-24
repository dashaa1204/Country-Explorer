"use client";

interface ResultsBarProps {
  shown: number;
  total: number;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ResultsBar({
  shown,
  total,
  favoritesOnly,
  onFavoritesOnlyChange,
  onClearFilters,
  hasActiveFilters,
}: ResultsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <p className="text-gray-700">
        Showing <span className="font-semibold">{shown}</span> of{" "}
        <span className="font-semibold">{total}</span> countries
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => onFavoritesOnlyChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Favorites only
        </label>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
