import { Country } from "@/types/country";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://restcountries.com/v3.1";

// Keep requested fields to <= 10 (restcountries limits field filtering)
const LIST_FIELDS = [
  "name",
  "cca2",
  "cca3",
  "region",
  "subregion",
  "population",
  "area",
  "capital",
  "flags",
].join(",");

export function buildCountryNameMap(
  countries: Country[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of countries) {
    map.set(c.cca3, c.name.common);
    map.set(c.cca2, c.name.common);
  }
  return map;
}

export function sortCountries(
  countries: Country[],
  sortBy: import("@/types/country").SortOption,
): Country[] {
  const sorted = [...countries];
  switch (sortBy) {
    case "population-desc":
      return sorted.sort((a, b) => b.population - a.population);
    case "population-asc":
      return sorted.sort((a, b) => a.population - b.population);
    case "area-desc":
      return sorted.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
    case "name":
    default:
      return sorted.sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
      );
  }
}

async function safeFetch(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const msg = `Failed to fetch ${url}: ${response.status} ${response.statusText} ${body}`;
    console.error(msg);
    throw new Error(msg);
  }
  return response.json();
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const url = `${API_URL}/all?fields=${LIST_FIELDS}`;
    return await safeFetch(url);
  } catch (error) {
    throw error;
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  try {
    const url = `${API_URL}/alpha/${encodeURIComponent(code)}`;
    const data = await safeFetch(url);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    throw error;
  }
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
  try {
    const url = `${API_URL}/region/${encodeURIComponent(region)}?fields=${LIST_FIELDS}`;
    return await safeFetch(url);
  } catch (error) {
    throw error;
  }
}

export async function searchCountries(query: string): Promise<Country[]> {
  try {
    const url = `${API_URL}/name/${encodeURIComponent(query)}?fields=${LIST_FIELDS}`;
    return await safeFetch(url);
  } catch (error) {
    return [];
  }
}

export function getUniqueRegions(countries: Country[]): string[] {
  const regions = new Set(countries.map((c) => c.region).filter(Boolean));
  return Array.from(regions).sort();
}
