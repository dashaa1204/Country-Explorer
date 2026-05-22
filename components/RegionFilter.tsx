"use client";

import { RegionFilterProps } from "@/types/country";

export default function RegionFilter({
  selectedRegion,
  onRegionChange,
  regions,
}: RegionFilterProps) {
  return (
    <div className="mb-6" suppressHydrationWarning>
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        suppressHydrationWarning
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
