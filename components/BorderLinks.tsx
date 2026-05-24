"use client";

import Link from "next/link";

interface BorderLinksProps {
  borderCodes: string[];
  nameMap: Map<string, string>;
}

export default function BorderLinks({ borderCodes, nameMap }: BorderLinksProps) {
  if (!borderCodes.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {borderCodes.map((code) => (
        <Link
          key={code}
          href={`/country/${code}`}
          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
        >
          {nameMap.get(code) ?? code}
        </Link>
      ))}
    </div>
  );
}
