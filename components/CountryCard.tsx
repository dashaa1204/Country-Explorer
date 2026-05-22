"use client";

import Link from "next/link";
import Image from "next/image";
import { CountryCardProps } from "@/types/country";

export default function CountryCard({ country }: CountryCardProps) {
  return (
    <Link href={`/country/${country.cca2}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <div className="relative w-full h-40">
          <Image
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {country.name.common}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Region:</span> {country.region}
            </p>
            {country.capital && (
              <p>
                <span className="font-medium">Capital:</span>{" "}
                {country.capital[0]}
              </p>
            )}
            <p>
              <span className="font-medium">Population:</span>{" "}
              {country.population.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
