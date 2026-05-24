"use client";

import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  code: string;
  size?: "sm" | "md";
  className?: string;
}

export default function FavoriteButton({
  code,
  size = "md",
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(code);
  const sizeClass = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(code);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Save to favorites"}
      className={`${sizeClass} leading-none transition-transform hover:scale-110 ${className}`}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
