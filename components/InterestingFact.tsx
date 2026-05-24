"use client";

interface InterestingFactProps {
  fact: string | null;
  loading?: boolean;
  countryName: string;
}

export default function InterestingFact({
  fact,
  loading,
  countryName,
}: InterestingFactProps) {
  return (
    <section
      className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5"
      aria-labelledby="interesting-fact-heading"
    >
      <h2
        id="interesting-fact-heading"
        className="text-sm font-semibold uppercase tracking-wide text-amber-800 mb-2"
      >
        💡 Interesting Fact
      </h2>
      {loading ? (
        <p className="text-amber-900/60 animate-pulse text-sm">
          Loading a fact about {countryName}...
        </p>
      ) : (
        <p className="text-amber-950 leading-relaxed">{fact}</p>
      )}
    </section>
  );
}
