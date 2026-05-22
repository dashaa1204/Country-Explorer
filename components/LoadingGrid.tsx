"use client";

export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-300 rounded-lg h-64 animate-pulse" />
      ))}
    </div>
  );
}
