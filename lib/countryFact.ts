import { Country } from "@/types/country";

function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

export async function fetchWikipediaFact(countryName: string): Promise<string | null> {
  try {
    const title = encodeURIComponent(countryName.replace(/ /g, "_"));
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { extract?: string };
    if (!data.extract) return null;
    return firstSentence(data.extract);
  } catch {
    return null;
  }
}

export function deriveCountryFact(
  country: Country,
  allCountries: Country[],
): string | null {
  if (country.flags.alt?.trim()) {
    return country.flags.alt.trim();
  }

  const regionPeers = allCountries.filter((c) => c.region === country.region);

  if (regionPeers.length > 1) {
    const mostPopulous = [...regionPeers].sort(
      (a, b) => b.population - a.population,
    )[0];
    if (mostPopulous.cca2 === country.cca2) {
      return `${country.name.common} is the most populous country in ${country.region}, with about ${country.population.toLocaleString()} people.`;
    }

    const largest = [...regionPeers]
      .filter((c) => c.area)
      .sort((a, b) => (b.area ?? 0) - (a.area ?? 0))[0];
    if (largest?.cca2 === country.cca2 && country.area) {
      return `${country.name.common} is the largest country in ${country.region} by area, covering ${country.area.toLocaleString()} km².`;
    }
  }

  if (country.landlocked) {
    const landlockedInRegion = regionPeers.filter((c) => c.landlocked).length;
    if (landlockedInRegion > 1) {
      return `${country.name.common} is landlocked — one of ${landlockedInRegion} landlocked countries in ${country.region}.`;
    }
    return `${country.name.common} is a landlocked country with no direct access to the sea.`;
  }

  if (country.borders && country.borders.length >= 5) {
    return `${country.name.common} shares borders with ${country.borders.length} countries, making it one of the most connected nations in its neighborhood.`;
  }

  if (country.capital && country.capital.length > 1) {
    return `${country.name.common} has more than one capital city: ${country.capital.join(", ")}.`;
  }

  if (country.timezones && country.timezones.length > 2) {
    return `Time in ${country.name.common} spans ${country.timezones.length} official time zones.`;
  }

  const langCount = country.languages
    ? Object.keys(country.languages).length
    : 0;
  if (langCount >= 3) {
    return `${country.name.common} officially recognizes ${langCount} languages, reflecting its cultural diversity.`;
  }

  if (country.area && country.population) {
    const density = Math.round(country.population / country.area);
    if (density > 500) {
      return `With roughly ${density.toLocaleString()} people per km², ${country.name.common} is among the more densely populated countries in the world.`;
    }
    if (density < 5 && country.area > 100_000) {
      return `Despite its large size (${country.area.toLocaleString()} km²), ${country.name.common} has a very low population density — about ${density} people per km².`;
    }
  }

  return null;
}

export async function getCountryInterestingFact(
  country: Country,
  allCountries: Country[],
): Promise<string> {
  const derived = deriveCountryFact(country, allCountries);
  if (derived) return derived;

  const wiki = await fetchWikipediaFact(country.name.common);
  if (wiki) return wiki;

  const officialWiki = await fetchWikipediaFact(country.name.official);
  if (officialWiki) return officialWiki;

  return `${country.name.common} (${country.name.official}) is located in ${country.region}${country.subregion ? `, ${country.subregion}` : ""}, with a population of about ${country.population.toLocaleString()}.`;
}
