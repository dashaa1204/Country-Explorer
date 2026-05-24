import { CURATED_TRAVEL_DESCRIPTIONS } from "@/data/travel-descriptions";
import { Country } from "@/types/country";

const SUBREGION_TRAITS: Record<string, string> = {
  "South-Eastern Asia":
    "tropical climates, rich street food, ancient temples, and busy markets",
  "Eastern Asia":
    "a blend of megacities, deep history, and dramatic natural scenery",
  "Western Asia":
    "historic crossroads, desert landscapes, and distinctive regional cuisine",
  "Southern Asia":
    "colorful culture, spice-driven food, and iconic landmarks",
  "Central Asia":
    "Silk Road heritage, wide steppes, and remote mountain routes",
  "Western Europe":
    "walkable cities, museums, cafes, and easy train connections",
  "Eastern Europe":
    "affordable cities, castles, and a mix of old towns and nightlife",
  "Northern Europe":
    "fjords, design culture, and long summer days or winter lights",
  "Southern Europe":
    "Mediterranean coasts, historic plazas, and relaxed dining culture",
  "Middle Africa": "rainforests, rivers, and vibrant local traditions",
  "Western Africa": "music, markets, and diverse coastal and inland cultures",
  "Eastern Africa": "safaris, highlands, and world-famous wildlife routes",
  "Southern Africa": "scenic drives, wine regions, and major nature reserves",
  "Northern Africa": "deserts, ancient ruins, and medina-style old cities",
  "Central America": "jungles, volcanoes, and compact multi-country trips",
  "Caribbean": "turquoise water, island hopping, and beach resorts",
  "South America":
    "Andean peaks, rainforests, and energetic cities with strong local culture",
  "North America":
    "road-trip friendly routes, national parks, and diverse city experiences",
  Australia: "coastal cities, unique wildlife, and vast outback landscapes",
  "New Zealand": "mountains, lakes, and outdoor adventure in compact distances",
  Melanesia: "coral reefs, island culture, and off-the-beaten-path beaches",
  Polynesia: "remote islands, lagoon scenery, and slow-paced island life",
};

const REGION_TRAITS: Record<string, string> = {
  Africa: "wildlife, cultural diversity, and landscapes from desert to rainforest",
  Americas: "everything from modern cities to mountains, coasts, and jungles",
  Asia: "some of the world's oldest cultures, varied food, and dramatic geography",
  Europe: "dense history, short travel distances, and strong regional identity",
  Oceania: "island scenery, marine life, and outdoor-focused travel",
};

function generateTravelDescription(country: Country): string {
  const name = country.name.common;
  const capital = country.capital?.[0];
  const sub = country.subregion;
  const traits =
    (sub && SUBREGION_TRAITS[sub]) ||
    REGION_TRAITS[country.region] ||
    "distinct local culture and memorable places to explore";

  const parts: string[] = [
    `${name} offers ${traits}.`,
  ];

  if (capital) {
    parts.push(`Most trips start in ${capital}, then branch into regional highlights.`);
  }

  if (country.landlocked) {
    parts.push("As a landlocked destination, road or rail routes often define the journey.");
  } else if (country.borders && country.borders.length > 0) {
    parts.push("Its location makes it easy to combine with neighboring countries on one trip.");
  }

  const langCount = country.languages
    ? Object.keys(country.languages).length
    : 0;
  if (langCount >= 3) {
    parts.push("Expect rich cultural variety across regions and languages.");
  }

  return parts.join(" ");
}

export function getTravelDescription(country: Country): string {
  const curated = CURATED_TRAVEL_DESCRIPTIONS[country.cca2];
  if (curated) return curated;
  return generateTravelDescription(country);
}
