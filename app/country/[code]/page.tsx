"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getCountryByCode } from "@/lib/api";
import { Country } from "@/types/country";

export default function CountryDetail() {
  const params = useParams();
  const code = params.code as string;
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch (err) {
        setError("Failed to load country details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchCountry();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">
          {error || "Country not found"}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Countries
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
        ← Back to Countries
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flag */}
          <div>
            <div className="relative w-full h-64">
              <Image
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{country.name.common}</h1>
            <p className="text-gray-600 text-lg mb-6">
              {country.name.official}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  General Information
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Code:</span> {country.cca2} /{" "}
                    {country.cca3}
                  </li>
                  <li>
                    <span className="font-medium">Region:</span>{" "}
                    {country.region}
                  </li>
                  {country.subregion && (
                    <li>
                      <span className="font-medium">Subregion:</span>{" "}
                      {country.subregion}
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Population:</span>{" "}
                    {country.population.toLocaleString()}
                  </li>
                  {country.area && (
                    <li>
                      <span className="font-medium">Area:</span>{" "}
                      {country.area.toLocaleString()} km²
                    </li>
                  )}
                </ul>
              </div>

              {country.capital && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Capital
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {country.capital.join(", ")}
                  </p>
                </div>
              )}

              {country.languages &&
                Object.keys(country.languages).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Languages
                    </h3>
                    <p className="mt-2 text-gray-700">
                      {Object.values(country.languages).join(", ")}
                    </p>
                  </div>
                )}

              {country.currencies &&
                Object.keys(country.currencies).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Currencies
                    </h3>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      {Object.entries(country.currencies).map(
                        ([code, currency]) => (
                          <li key={code}>
                            {currency.symbol} {currency.name} ({code})
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {country.timezones && country.timezones.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Timezones
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {country.timezones.join(", ")}
                  </p>
                </div>
              )}

              {country.borders && country.borders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Borders
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {country.borders.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
