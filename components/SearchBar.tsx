"use client";

import { SearchBarProps } from "@/types/country";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search countries...",
}: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
