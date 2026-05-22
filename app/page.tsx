"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import RegionFilter from "@/components/RegionFilter";
import CountryGrid from "@/components/CountryGrid";
import LoadingGrid from "@/components/LoadingGrid";
import {
  getAllCountries,
  getUniqueRegions,
  searchCountries,
  getCountriesByRegion,
} from "@/lib/api";
import { Country } from "@/types/country";

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setRegions(getUniqueRegions(data));
        setErrorMsg(null);
      } catch (error) {
        console.error("Failed to load countries:", error);
        setErrorMsg(error?.message || 'Failed to load countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search and region filtering
  useEffect(() => {
    const applyFilters = async () => {
      let result = countries;

      // Apply region filter
      if (selectedRegion) {
        result = result.filter((country) => country.region === selectedRegion);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        result = result.filter(
          (country) =>
            country.name.common
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            country.name.official
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            country.cca2.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.cca3.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      setFilteredCountries(result);
    };

    applyFilters();
  }, [searchQuery, selectedRegion, countries]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by country name or code..."
        />
        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={regions}
        />
      </div>

      {loading ? (
        <LoadingGrid />
      ) : (
        <>
          {errorMsg ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{errorMsg}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setErrorMsg(null);
                  getAllCountries()
                    .then((data) => {
                      setCountries(data);
                      setFilteredCountries(data);
                      setRegions(getUniqueRegions(data));
                    })
                    .catch((err) => setErrorMsg(err?.message || 'Failed to load countries'))
                    .finally(() => setLoading(false));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <CountryGrid countries={filteredCountries} />
          )}
        </>
      )}
    </div>
  );
}
