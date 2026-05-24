export function formatPopulation(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function populationDensity(
  population: number,
  area?: number,
): string | null {
  if (!area || area <= 0) return null;
  const density = Math.round(population / area);
  return `${density.toLocaleString()} people/km²`;
}

export function googleMapsUrl(latlng?: [number, number], label?: string): string | null {
  if (!latlng) return null;
  const [lat, lng] = latlng;
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function wikipediaUrl(countryName: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(countryName.replace(/ /g, "_"))}`;
}
