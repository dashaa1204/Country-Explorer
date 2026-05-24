"use client";

import { TravelRoute, TravelPace } from "@/types/travel";

const PACE_LABEL: Record<TravelPace, string> = {
  relax: "Relaxed",
  balanced: "Balanced",
  active: "Active",
};

const PACE_STYLE: Record<TravelPace, string> = {
  relax: "bg-emerald-100 text-emerald-800",
  balanced: "bg-blue-100 text-blue-800",
  active: "bg-orange-100 text-orange-800",
};

interface TravelRoutesProps {
  routes: TravelRoute[];
  countryName: string;
}

export default function TravelRoutes({ routes, countryName }: TravelRoutesProps) {
  if (!routes.length) return null;

  return (
    <section
      className="mt-8"
      aria-labelledby="travel-routes-heading"
    >
      <div className="mb-4">
        <h2
          id="travel-routes-heading"
          className="text-xl font-bold text-gray-900"
        >
          ✈️ {countryName} - Travel Routes
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          2-3 ready-to-use itineraries for this country - duration, stops, and best fit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {routes.map((route, index) => (
          <article
            key={route.id}
            className="flex flex-col rounded-xl border border-teal-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="bg-teal-600 text-white px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium opacity-90">
                  Route {index + 1}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${PACE_STYLE[route.pace]}`}
                >
                  {PACE_LABEL[route.pace]}
                </span>
              </div>
              <h3 className="font-semibold text-lg mt-1 leading-snug">
                {route.title}
              </h3>
              <p className="text-teal-100 text-sm mt-1">{route.duration}</p>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {route.summary}
              </p>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                  Stops
                </h4>
                <ol className="space-y-1.5">
                  {route.stops.map((stop, i) => (
                    <li
                      key={`${route.id}-stop-${i}`}
                      className="flex gap-2 text-sm text-gray-800"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span>{stop}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-auto text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span className="font-medium text-gray-600">Best for:</span>{" "}
                {route.bestFor}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
