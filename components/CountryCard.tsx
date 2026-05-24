"use client";

import Link from "next/link";
import Image from "next/image";
import { CountryCardProps } from "@/types/country";
import FavoriteButton from "./FavoriteButton";
import { formatPopulation, populationDensity } from "@/lib/format";
import { getTravelDescription } from "@/lib/travelDescription";

function truncate(text: string, max = 110): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export default function CountryCard({ country }: CountryCardProps) {
  const density = populationDensity(country.population, country.area);
  const travelSnippet = truncate(getTravelDescription(country));

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton code={country.cca2} size="sm" className="drop-shadow" />
      </div>
      <Link href={`/country/${country.cca2}`} className="block h-full">
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
              {country.name.common}
            </h3>
            <span className="text-xs font-mono text-gray-400 shrink-0">
              {country.cca2}
            </span>
          </div>
          <p className="text-xs text-teal-700 font-medium mb-2">
            ✈️ 3 travel routes
          </p>
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{travelSnippet}</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Region:</span> {country.region}
              {country.subregion ? ` · ${country.subregion}` : ""}
            </p>
            {country.capital?.[0] && (
              <p>
                <span className="font-medium">Capital:</span>{" "}
                {country.capital[0]}
              </p>
            )}
            <p>
              <span className="font-medium">Population:</span>{" "}
              {formatPopulation(country.population)}
              <span className="text-gray-400 ml-1">
                ({country.population.toLocaleString()})
              </span>
            </p>
            {country.area && (
              <p>
                <span className="font-medium">Area:</span>{" "}
                {country.area.toLocaleString()} km²
                {density && (
                  <span className="text-gray-400"> · {density}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
