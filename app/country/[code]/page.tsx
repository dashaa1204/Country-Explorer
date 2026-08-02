"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getAllCountries, getCountryByCode, buildCountryNameMap } from "@/lib/api";
import { Country } from "@/types/country";
import FavoriteButton from "@/components/FavoriteButton";
import BorderLinks from "@/components/BorderLinks";
import {
  formatPopulation,
  googleMapsUrl,
  populationDensity,
  wikipediaUrl,
} from "@/lib/format";
import { getCountryInterestingFact } from "@/lib/countryFact";
import { getTravelRoutes } from "@/lib/travelRoutes";
import { getTravelDescription } from "@/lib/travelDescription";
import InterestingFact from "@/components/InterestingFact";
import TravelRoutes from "@/components/TravelRoutes";
import TravelDescription from "@/components/TravelDescription";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-800">{children}</dd>
    </div>
  );
}

export default function CountryDetail() {
  const params = useParams();
  const code = params.code as string;
  const [country, setCountry] = useState<Country | null>(null);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [interestingFact, setInterestingFact] = useState<string | null>(null);
  const [factLoading, setFactLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [detail, all] = await Promise.all([
          getCountryByCode(code),
          getAllCountries(),
        ]);
        if (cancelled) return;
        setCountry(detail);
        setAllCountries(all);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load country details");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!country || allCountries.length === 0) return;

    let cancelled = false;
    setFactLoading(true);
    setInterestingFact(null);

    getCountryInterestingFact(country, allCountries)
      .then((fact) => {
        if (!cancelled) setInterestingFact(fact);
      })
      .finally(() => {
        if (!cancelled) setFactLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [country, allCountries]);

  const nameMap = useMemo(
    () => buildCountryNameMap(allCountries),
    [allCountries],
  );

  const travelRoutes = useMemo(() => {
    if (!country) return [];
    return getTravelRoutes(country, nameMap);
  }, [country, nameMap]);

  const travelDescription = useMemo(() => {
    if (!country) return "";
    return getTravelDescription(country);
  }, [country]);

  const mapsLink = country
    ? country.maps?.googleMaps ??
      googleMapsUrl(country.latlng, country.name.common)
    : null;

  const density = country
    ? populationDensity(country.population, country.area)
    : null;

  const copyCode = async () => {
    if (!country) return;
    await navigator.clipboard.writeText(country.cca2);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-lg text-gray-500 animate-pulse">
          Loading country…
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-xl text-red-500 mb-4">
          {error || "Country not found"}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to all countries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to all countries
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {country.name.common}
          </h1>
          <p className="text-gray-600 mt-1">{country.name.official}</p>
        </div>
        <FavoriteButton code={country.cca2} />
      </div>

      <TravelDescription
        description={travelDescription}
        countryName={country.name.common}
      />

      <TravelRoutes routes={travelRoutes} countryName={country.name.common} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative aspect-[3/2] w-full self-start bg-gray-100 p-6 lg:p-8">
            <Image
              src={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                type="button"
                onClick={copyCode}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                {copied ? "Copied!" : `Copy code (${country.cca2})`}
              </button>
              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Open in Maps
                </a>
              )}
              <a
                href={wikipediaUrl(country.name.common)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                Wikipedia
              </a>
            </div>

            <InterestingFact
              fact={interestingFact}
              loading={factLoading}
              countryName={country.name.common}
            />

            <dl className="divide-y divide-gray-100 mt-6">
              <InfoRow label="Codes">
                {country.cca2} / {country.cca3}
              </InfoRow>
              <InfoRow label="Region">
                {country.region}
                {country.subregion && ` · ${country.subregion}`}
                {country.continents?.length
                  ? ` (${country.continents.join(", ")})`
                  : ""}
              </InfoRow>
              {country.capital && (
                <InfoRow label="Capital(s)">
                  {country.capital.join(", ")}
                </InfoRow>
              )}
              <InfoRow label="Population">
                {country.population.toLocaleString()}
                <span className="text-gray-500 ml-2">
                  (~{formatPopulation(country.population)})
                </span>
              </InfoRow>
              {country.area && (
                <InfoRow label="Area">
                  {country.area.toLocaleString()} km²
                  {density && (
                    <span className="block text-sm text-gray-500 mt-1">
                      {density}
                    </span>
                  )}
                </InfoRow>
              )}
              {country.languages &&
                Object.keys(country.languages).length > 0 && (
                  <InfoRow label="Languages">
                    {Object.values(country.languages).join(", ")}
                  </InfoRow>
                )}
              {country.currencies &&
                Object.keys(country.currencies).length > 0 && (
                  <InfoRow label="Currencies">
                    <ul className="space-y-1">
                      {Object.entries(country.currencies).map(
                        ([currCode, currency]) => (
                          <li key={currCode}>
                            {currency.symbol} {currency.name} ({currCode})
                          </li>
                        ),
                      )}
                    </ul>
                  </InfoRow>
                )}
              {country.timezones && country.timezones.length > 0 && (
                <InfoRow label="Timezones">
                  {country.timezones.join(", ")}
                </InfoRow>
              )}
              <InfoRow label="Status">
                {[
                  country.unMember && "UN member",
                  country.landlocked && "Landlocked",
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </InfoRow>
              {country.borders && country.borders.length > 0 && (
                <InfoRow label="Bordering countries">
                  <BorderLinks
                    borderCodes={country.borders}
                    nameMap={nameMap}
                  />
                </InfoRow>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
