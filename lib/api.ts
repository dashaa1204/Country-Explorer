import { Country } from "@/types/country";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://restcountries.com/v3.1";

// Keep requested fields to <= 10 (restcountries limits field filtering)
const LIST_FIELDS = [
  "name",
  "cca2",
  "cca3",
  "region",
  "population",
  "capital",
  "flags",
].join(",");

const DETAIL_FIELDS = [
  "name",
  "cca2",
  "cca3",
  "region",
  "subregion",
  "population",
  "capital",
  "flags",
  "languages",
  "currencies",
].join(",");

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
    console.error("Error fetching countries:", error);
    throw error;
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  try {
    const url = `${API_URL}/alpha/${encodeURIComponent(code)}?fields=${DETAIL_FIELDS}`;
    const data = await safeFetch(url);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(`Error fetching country ${code}:`, error);
    throw error;
  }
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
  try {
    const url = `${API_URL}/region/${encodeURIComponent(region)}?fields=${LIST_FIELDS}`;
    return await safeFetch(url);
  } catch (error) {
    console.error(`Error fetching countries for region ${region}:`, error);
    throw error;
  }
}

export async function searchCountries(query: string): Promise<Country[]> {
  try {
    const url = `${API_URL}/name/${encodeURIComponent(query)}?fields=${LIST_FIELDS}`;
    return await safeFetch(url);
  } catch (error) {
    console.error(`Error searching countries with query "${query}":`, error);
    return [];
  }
}

export function getUniqueRegions(countries: Country[]): string[] {
  const regions = new Set(countries.map((c) => c.region).filter(Boolean));
  return Array.from(regions).sort();
}
