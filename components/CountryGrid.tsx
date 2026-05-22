"use client";

import { Country } from "@/types/country";
import CountryCard from "./CountryCard";

interface CountryGridProps {
  countries: Country[];
  isLoading?: boolean;
}

export default function CountryGrid({
  countries,
  isLoading,
}: CountryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No countries found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {countries.map((country) => (
        <CountryCard key={country.cca2} country={country} />
      ))}
    </div>
  );
}
