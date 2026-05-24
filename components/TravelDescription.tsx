"use client";

interface TravelDescriptionProps {
  description: string;
  countryName: string;
}

export default function TravelDescription({
  description,
  countryName,
}: TravelDescriptionProps) {
  return (
    <section
      className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4"
      aria-label={`About traveling in ${countryName}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 mb-2">
        About this destination
      </h2>
      <p className="text-slate-800 leading-relaxed">{description}</p>
    </section>
  );
}
