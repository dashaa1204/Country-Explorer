import { CURATED_ROUTES } from "@/data/curated-routes";
import { Country } from "@/types/country";
import { TravelRoute, TravelPace } from "@/types/travel";

function borderNeighborNames(
  country: Country,
  nameMap: Map<string, string>,
): string[] {
  return (country.borders ?? [])
    .map((code) => nameMap.get(code) ?? code)
    .slice(0, 3);
}

function generateRoutes(
  country: Country,
  nameMap: Map<string, string>,
): TravelRoute[] {
  const code = country.cca2;
  const name = country.name.common;
  const capital = country.capital?.[0] ?? name;
  const region = country.region;
  const sub = country.subregion ?? region;
  const large = (country.area ?? 0) > 500_000;
  const medium = (country.area ?? 0) > 100_000;
  const coastal = !country.landlocked;
  const neighbors = borderNeighborNames(country, nameMap);

  const routes: TravelRoute[] = [];

  routes.push({
    id: `${code}-capital`,
    title: `${capital} City Highlights`,
    duration: large ? "4-5 days" : "2-3 days",
    summary: `A city-focused route through ${name}'s capital and key nearby sights.`,
    stops: [
      capital,
      `${capital} Historic District`,
      `${capital} Modern District`,
      coastal ? `${capital} Waterfront Area` : `${capital} Day Trip Zone`,
    ].filter(Boolean),
    bestFor: "First-time visitors with limited time",
    pace: "balanced",
  });

  if (large || medium) {
    const pace: TravelPace = large ? "active" : "balanced";
    routes.push({
      id: `${code}-regions`,
      title: `${sub} Regional Loop`,
      duration: large ? "10-14 days" : "6-8 days",
      summary: `A multi-region route across ${name} in ${region}.`,
      stops: [
        capital,
        `${name} Eastern Region`,
        `${name} Western Region`,
        large ? `${name} National Park Area` : `${name} Countryside Town`,
      ],
      bestFor: "Longer trips with road or domestic flight plans",
      pace,
    });
  } else {
    routes.push({
      id: `${code}-weekend`,
      title: `${name} Full Overview`,
      duration: "3-4 days",
      summary: `A compact route covering the main highlights of this smaller country.`,
      stops: [capital, `${name} Nature/Coast Spot`, `${name} Cultural Landmark`],
      bestFor: "Short holidays",
      pace: "relax",
    });
  }

  if (neighbors.length > 0) {
    routes.push({
      id: `${code}-borders`,
      title: "Cross-Border Combo",
      duration: "7-10 days",
      summary: `${name} + ${neighbors.slice(0, 2).join(", ")} in one multi-country trip.`,
      stops: [capital, ...neighbors.map((n) => `${n} (neighbor)`), capital],
      bestFor: "Travelers planning multi-country journeys",
      pace: "active",
    });
  } else if (coastal) {
    routes.push({
      id: `${code}-coast`,
      title: "Coast & Sea Escape",
      duration: "5-7 days",
      summary: `A coastal route for beaches, islands, and water activities in ${name}.`,
      stops: [
        capital,
        `${name} Main Beach Area`,
        `${name} Islands/Marine Park`,
      ],
      bestFor: "Beach vacations",
      pace: "relax",
    });
  } else {
    routes.push({
      id: `${code}-nature`,
      title: "Nature Adventure",
      duration: "5-7 days",
      summary: `A nature-focused route through mountains, parks, and outdoor highlights in ${name}.`,
      stops: [
        capital,
        `${name} National Park`,
        `${name} Mountain/Lake Area`,
      ],
      bestFor: "Nature and photography",
      pace: "active",
    });
  }

  return routes.slice(0, 3);
}

export function getTravelRoutes(
  country: Country,
  nameMap: Map<string, string>,
): TravelRoute[] {
  const curated = CURATED_ROUTES[country.cca2];
  if (curated?.length) {
    return curated.slice(0, 3);
  }
  return generateRoutes(country, nameMap);
}
