"use client";

import { useCallback, useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("favorites-changed", onChange);
    return () => window.removeEventListener("favorites-changed", onChange);
  }, [refresh]);

  const toggle = useCallback((code: string) => {
    toggleFavorite(code);
  }, []);

  const check = useCallback(
    (code: string) => favorites.includes(code.toUpperCase()),
    [favorites],
  );

  return { favorites, toggle, isFavorite: check, count: favorites.length };
}
