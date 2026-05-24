"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import RegionFilter from "@/components/RegionFilter";
import SortSelect from "@/components/SortSelect";
import ResultsBar from "@/components/ResultsBar";
import CountryGrid from "@/components/CountryGrid";
import LoadingGrid from "@/components/LoadingGrid";
import { getAllCountries, getUniqueRegions, sortCountries } from "@/lib/api";
import { useFavorites } from "@/hooks/useFavorites";
import { Country, SortOption } from "@/types/country";

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites } = useFavorites();

  const regions = useMemo(
    () => getUniqueRegions(countries),
    [countries],
  );

  const filteredCountries = useMemo(() => {
    let result = countries;

    if (selectedRegion) {
      result = result.filter((c) => c.region === selectedRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.common.toLowerCase().includes(q) ||
          c.name.official.toLowerCase().includes(q) ||
          c.cca2.toLowerCase().includes(q) ||
          c.cca3.toLowerCase().includes(q) ||
          (c.capital?.[0]?.toLowerCase().includes(q) ?? false),
      );
    }

    if (favoritesOnly) {
      result = result.filter((c) => favorites.includes(c.cca2));
    }

    return sortCountries(result, sortBy);
  }, [
    countries,
    selectedRegion,
    searchQuery,
    favoritesOnly,
    favorites,
    sortBy,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedRegion) ||
    favoritesOnly;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setErrorMsg(null);
      } catch (error) {
        console.error("Failed to load countries:", error);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load countries",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const retry = () => {
    setLoading(true);
    setErrorMsg(null);
    getAllCountries()
      .then((data) => setCountries(data))
      .catch((err) =>
        setErrorMsg(
          err instanceof Error ? err.message : "Failed to load countries",
        ),
      )
      .finally(() => setLoading(false));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
    setFavoritesOnly(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search name, code, or capital..."
        />
        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={regions}
        />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>

      {!loading && !errorMsg && (
        <ResultsBar
          shown={filteredCountries.length}
          total={countries.length}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyChange={setFavoritesOnly}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {loading ? (
        <LoadingGrid />
      ) : errorMsg ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button
            type="button"
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <CountryGrid countries={filteredCountries} />
      )}
    </div>
  );
}
