const STORAGE_KEY = "country-explorer-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(code: string): boolean {
  return getFavorites().includes(code.toUpperCase());
}

export function toggleFavorite(code: string): string[] {
  const normalized = code.toUpperCase();
  const current = getFavorites();
  const next = current.includes(normalized)
    ? current.filter((c) => c !== normalized)
    : [...current, normalized];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("favorites-changed"));
  return next;
}
